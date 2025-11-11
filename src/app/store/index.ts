import { ActionReducerMap } from '@ngrx/store';
import { usersReducer } from './users/users.reducer';
import { UsersState } from './users/users.state';

export interface AppState {
  users: UsersState;
}

export const reducers: ActionReducerMap<AppState> = {
  users: usersReducer,
};

//EXEMPLO CASO TENHA MUITOS REDUCERS, AI NO MAIN EM PROVIDERS EM provideStore ADD O REDUCERS - provideStore(reducers),
// INTERFACE GLOBAL do App State
// export interface AppState {
//   users: UsersState;
//   auth: AuthState;
//   products: ProductsState;
//   cart: CartState;
// }

// // COMBINAÇÃO de TODOS os reducers
// export const reducers: ActionReducerMap<AppState> = {
//   users: usersReducer,
//   auth: authReducer,
//   products: productsReducer,
//   cart: cartReducer
// };
