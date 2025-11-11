import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn, // Usar HttpHandlerFn para interceptor funcional
  HttpInterceptorFn, // Usar HttpInterceptorFn para o tipo principal
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError, switchMap, catchError } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';
import { AuthService } from '../services/auth/auth.service';
import { UserAuth } from '../models/user.model';
import { StorageKeys } from 'src/app/shareds/consts/storage-keys';
import { NetworkService } from '../services/network/network.service';

// Variáveis de estado fora da função principal, pois o interceptor é um singleton
let isRefreshing = false;
let useRefreshToken = false;

// Refatorado para ser uma função
export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn // Usamos HttpHandlerFn aqui
): Observable<HttpEvent<any>> => {
  if (req.url.includes('login')) {
    return next(req);
  }

  const storage = inject(StorageService);
  const networkService = inject(NetworkService);
  const authService = inject(AuthService);

  const handle401Error = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    user?: UserAuth
  ): Observable<HttpEvent<any>> => {
    useRefreshToken = true;
    isRefreshing = true;

    if (user?.refresh_token) {
      return authService.refreshToken().pipe(
        switchMap((newUser: UserAuth) =>
          from(storage.setSecureStorage(StorageKeys.USER, newUser)).pipe(
            switchMap(() => {
              isRefreshing = false;
              useRefreshToken = false;

              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newUser.access_token}`,
                },
              });
              return next(newReq);
            })
          )
        ),
        catchError(() => {
          isRefreshing = false;
          authService.logout();
          return throwError(
            () =>
              new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })
          );
        })
      );
    } else {
      isRefreshing = false;
      authService.logout();
      return throwError(
        () => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })
      );
    }
  };
  // Fim das funções internas

  // Lógica principal do interceptor
  return from(networkService.getConnectionType()).pipe(
    switchMap((connectionType) => {
      if (connectionType === 'none') {
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 0,
              statusText: 'Offline',
              url: req.url,
              error: { message: 'offline' },
            })
        );
      }

      return from(storage.getSecureStorage<UserAuth>(StorageKeys.USER)).pipe(
        switchMap((user) => {
          const tokenToUse = useRefreshToken
            ? user?.refresh_token
            : user?.access_token;

          const authHeader = tokenToUse ? `Bearer ${tokenToUse}` : '';

          const clonedReq = req.clone({
            setHeaders: { Authorization: authHeader },
          });

          return next(clonedReq).pipe(
            catchError((error: HttpErrorResponse) => {
              useRefreshToken = false;

              if (error.status === 401 && !isRefreshing) {
                return handle401Error(req, next, user ?? undefined);
              }

              return throwError(() => error);
            })
          );
        })
      );
    }),
    catchError((error) => {
      console.error('Interceptor Error: - auth.interceptor.ts:119', error);
      return throwError(() => error);
    })
  );
};
