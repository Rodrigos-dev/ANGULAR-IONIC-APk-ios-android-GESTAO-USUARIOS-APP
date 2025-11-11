import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';
import { StorageService } from '../storage/storage.service';
import { StorageKeys } from 'src/app/shareds/consts/storage-keys';
import { Login } from '../../models/auth.model';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/shareds/consts/rotas';
import { UserAuth } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpService = inject(HttpService);
  private readonly storage = inject(StorageService);

  private readonly router = inject(Router);

  async isLoggedUser(): Promise<boolean> {
    const existeKey: boolean = await this.storage.keysSecureStorage(
      StorageKeys.USER
    );
    if (!existeKey) return false;

    const hasUser = await this.storage.getSecureStorage(StorageKeys.USER);
    return !!hasUser;
  }

  login(body: Login): Observable<UserAuth> {
    const url = `${environment.urlBase}/auth/login`;
    return this.httpService.post<UserAuth>(url, body);
  }

  refreshToken(): Observable<UserAuth> {
    const url = `${environment.urlBase}/auth/refresh-token`;
    return this.httpService.post<UserAuth>(url, {});
  }

  async logout(): Promise<void> {
    try {
      await this.storage.removeSecureStorage(StorageKeys.USER);
    } catch (error) {
      console.error('Erro ao limpar storage: - auth.service.ts:45', error);
    } finally {
      this.router.navigate([AppRoutes.LOGIN]);
    }
  }
}
