import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  withLatestFrom,
  tap,
  filter,
} from 'rxjs/operators';

// Actions
import * as UsersActions from './users.actions';

// Services (ajuste para o seu service)

// Selectors
import { selectSelectedUser, selectUsersPage } from './users.selectors';
import { UsersService } from 'src/app/core/services/user/user.service';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly usersService = inject(UsersService);

  // EFFECT: Carregar usuários (primeira carga)
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.usersService.getUsers(1).pipe(
          map((response) =>
            UsersActions.loadUsersSuccess({
              users: response.users,
              total: response.total,
              page: 1,
            })
          ),
          catchError((error) =>
            of(
              UsersActions.loadUsersFailure({
                error: error.message || 'Erro ao carregar usuários',
              })
            )
          )
        )
      )
    )
  );

  // EFFECT: Carregar mais usuários (pagination)
  loadMoreUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadMoreUsers),
      withLatestFrom(this.store.select(selectUsersPage)),
      switchMap(([action, currentPage]) =>
        this.usersService.getUsers(currentPage + 1).pipe(
          map((response) =>
            UsersActions.loadMoreUsersSuccess({
              users: response.users,
              page: currentPage + 1,
            })
          ),
          catchError((error) =>
            of(
              UsersActions.loadUsersFailure({
                error: error.message || 'Erro ao carregar mais usuários',
              })
            )
          )
        )
      )
    )
  );

  // EFFECT: Success - Log ou outras ações
  loadUsersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.loadUsersSuccess),
        tap(({ users, total }) => {
          console.log(
            `Carregados ${users.length} de ${total} usuários - users.effects.ts:85`
          );
        })
      ),
    { dispatch: false } //Não dispara nova action
  );

  // EFFECT: Failure - Log de erro
  loadUsersFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.loadUsersFailure),
        tap(({ error }) => {
          console.error('Erro no Users Effects: - users.effects.ts:97', error);
          // Aqui você pode mostrar toast, etc
        })
      ),
    { dispatch: false }
  );

  // ✅ GET BY ID - Effect
  // aki busca toda vez
  // loadUserById$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UsersActions.loadUserById),
  //     switchMap(({ id }) =>
  //       this.usersService.getUserById(id).pipe(
  //         map((user) => UsersActions.loadUserByIdSuccess({ user })),
  //         catchError((error) =>
  //           of(
  //             UsersActions.loadUserByIdFailure({
  //               error: error.message || 'Erro ao carregar usuário',
  //             })
  //           )
  //         )
  //       )
  //     )
  //   )
  // )

  // aki so buca quando o id é diferente
  loadUserByIds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUserById),
      withLatestFrom(this.store.select(selectSelectedUser)),
      filter(
        ([{ id }, currentUser]) => !currentUser || currentUser.id !== id // ✅ Só busca se for user diferente
      ),
      switchMap(([{ id }]) =>
        this.usersService.getUserById(id).pipe(
          map((user) => UsersActions.loadUserByIdSuccess({ user })),
          catchError((error) =>
            of(UsersActions.loadUserByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  //delete user
  // users.effects.ts
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ id }) =>
        this.usersService.deleteUser(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError((error) =>
            of(
              UsersActions.deleteUserFailure({
                error: error.message || 'Erro ao excluir usuário',
              })
            )
          )
        )
      )
    )
  );

  //CRIAR USUARIO
  // users.effects.ts
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      switchMap(({ userData }) =>
        this.usersService.createUser(userData).pipe(
          map((newUser) => UsersActions.createUserSuccess({ user: newUser })),
          catchError((error) =>
            of(
              UsersActions.createUserFailure({
                error: error.message || 'Erro ao criar usuário',
              })
            )
          )
        )
      )
    )
  );

  // UPDATE Effect (já criamos)
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      switchMap(({ id, data }) =>
        this.usersService.updateUser(id, data).pipe(
          map((updatedUser) =>
            UsersActions.updateUserSuccess({ user: updatedUser })
          ),
          catchError((error) =>
            of(
              UsersActions.updateUserFailure({
                error: error.message || 'Erro ao atualizar usuário',
              })
            )
          )
        )
      )
    )
  );
}
