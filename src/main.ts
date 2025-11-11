import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';

import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { usersReducer } from './app/store/users/users.reducer';
import { UsersEffects } from './app/store/users/users.effects';
import { reducers } from './app/store';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    importProvidersFrom(IonicStorageModule.forRoot()),
    provideHttpClient(withInterceptors([AuthInterceptor])),

    //Provide do NgRx Store
    // provideStore({// PASSANDO O REDUCER DIRETAMENTE CASO TENHA VARIOS PASSAR O ARRY REDUCERS QUE TEM EM INDEX.TS NA STORE EXEMPLO ABAIXO
    //   users: usersReducer,
    // }),

    // STORE com TODOS os reducers
    provideStore(reducers),

    //Provide do NgRx Effects
    provideEffects([UsersEffects]),

    //Provide do NgRx DevTools
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false, // Mude para true em produção
    }),
  ],
});
