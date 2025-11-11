import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth.layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/guard.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/splash/splash/splash.page').then((m) => m.SplashPage),
    pathMatch: 'full',
  },

  // --- Rota sem sidebar---
  {
    path: 'login', // O path é 'login'
    component: AuthLayoutComponent,
    children: [
      {
        path: '', // O path vazio ('') aqui significa /login
        loadComponent: () =>
          import('./pages/auth/login/login.page').then((m) => m.LoginPage),
        canActivate: [loginGuard],
      },
    ],
  },

  // rota com sidebar
  {
    path: 'users',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/user/users/users.page').then((m) => m.UsersPage),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
