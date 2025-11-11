import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { AppRoutes } from 'src/app/shareds/consts/rotas';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const url = state.url;

  const isLoggedIn = await authService.isLoggedUser();

  if (isLoggedIn) return true;

  return router.createUrlTree([AppRoutes.LOGIN], {
    queryParams: { returnUrl: url },
  });
};
