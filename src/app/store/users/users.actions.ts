// users.actions.ts
// lidano com arquivos sem paginacao
// import { createAction, props } from '@ngrx/store';

// export const loadUsers = createAction('[Users] Load Users');

// export const loadUsersSuccess = createAction(
//   '[Users] Load Users Success',
//   props<{ users: any[] }>()
// );

// export const loadUsersFailure = createAction(
//   '[Users] Load Users Failure',
//   props<{ error: string }>()
// );

// trabalhando com paginacao
import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/core/models/user.model';

// Load Users
export const loadUsers = createAction('[Users] Load Users');

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[]; total: number; page: number }>()
);

// Load More Users
export const loadMoreUsers = createAction('[Users] Load More Users');

export const loadMoreUsersSuccess = createAction(
  '[Users] Load More Users Success',
  props<{ users: User[]; page: number }>()
);

// Failure
export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

// ✅ GET BY ID ACTIONS *******************************************************************
export const loadUserById = createAction(
  '[Users] Load User By ID',
  props<{ id: number }>()
);

export const loadUserByIdSuccess = createAction(
  '[Users] Load User By ID Success',
  props<{ user: User }>()
);

export const loadUserByIdFailure = createAction(
  '[Users] Load User By ID Failure',
  props<{ error: string }>()
);

// ✅ CLEAR SELECTED USER (importante!)
export const clearSelectedUser = createAction('[Users] Clear Selected User');

//Delete users
// users.actions.ts - Adicione estas actions
export const deleteUser = createAction(
  '[Users] Delete User',
  props<{ id: number }>()
);

export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ id: number }>()
);

export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: string }>()
);

//CRIAR USUARIO
// users.actions.ts
export const createUser = createAction(
  '[Users] Create User',
  props<{ userData: Partial<User> }>()
);

export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: User }>()
);

export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: string }>()
);

// UPDATE Actions (já criamos anteriormente)
export const updateUser = createAction(
  '[Users] Update User',
  props<{ id: number; data: Partial<User> }>()
);

export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: string }>()
);
