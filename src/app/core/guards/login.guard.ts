import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { AppRoutes } from 'src/app/shareds/consts/rotas';

export const loginGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = await authService.isLoggedUser();

  if (isLoggedIn) {
    return router.createUrlTree([AppRoutes.USER]);
  }

  return true;
};
