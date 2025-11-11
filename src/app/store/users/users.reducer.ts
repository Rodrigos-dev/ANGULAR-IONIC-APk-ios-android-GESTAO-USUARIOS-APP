import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { initialState } from './users.state';

// export const usersReducer = createReducer(
//   initialState,

//   on(UsersActions.loadUsers, (state) => ({
//     ...state,
//     loading: true,
//     error: null,
//   })),

//   on(UsersActions.loadUsersSuccess, (state, { users }) => ({
//     ...state,
//     list: users,
//     loading: false,
//   })),

//   on(UsersActions.loadUsersFailure, (state, { error }) => ({
//     ...state,
//     loading: false,
//     error: error,
//   }))
// );

//********************************************************************************** */

// lista com paginacao
// users.reducer.ts
export const usersReducer = createReducer(
  initialState,

  // Primeira carga
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Load More
  on(UsersActions.loadMoreUsers, (state) => ({
    ...state,
    loadingMore: true,
    error: null,
  })),

  // Success primeira carga
  on(UsersActions.loadUsersSuccess, (state, { users, total, page }) => ({
    ...state,
    list: users,
    total: total,
    page: page,
    loading: false,
    hasMore: users.length < total,
  })),

  // Success load more
  on(UsersActions.loadMoreUsersSuccess, (state, { users, page }) => ({
    ...state,
    list: [...state.list, ...users], // ✅ Concatena arrays
    page: page,
    loadingMore: false,
    hasMore: state.list.length + users.length < state.total,
  })),

  // ✅ GET BY ID - Reducers *****************************************************************
  on(UsersActions.loadUserById, (state) => ({
    ...state,
    selectedUserLoading: true,
    selectedUserError: null,
  })),

  on(UsersActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    selectedUserLoading: false,
  })),

  on(UsersActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    selectedUserLoading: false,
    selectedUserError: error,
  })),

  on(UsersActions.clearSelectedUser, (state) => ({
    ...state,
    selectedUser: null,
    selectedUserError: null,
  })),

  //delete user
  // users.reducer.ts
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    deleteLoading: true, // ✅ SET loading do delete
    deleteError: null, // ✅ LIMPA erro anterior
  })),

  on(UsersActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    deleteLoading: false, // ✅ UNSET loading
    list: state.list.filter((user) => user.id !== id),
    total: state.total - 1,
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
  })),

  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    deleteLoading: false, // ✅ UNSET loading
    deleteError: error, // ✅ SET erro do delete
  })),

  //CREATE USER
  // users.reducer.ts
  on(UsersActions.createUser, (state) => ({
    ...state,
    createLoading: true,
    createError: null,
  })),

  on(UsersActions.createUserSuccess, (state, { user }) => ({
    ...state,
    createLoading: false,
    list: [user, ...state.list],
    total: state.total + 1,
  })),

  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    createLoading: false,
    createError: error,
  })),

  //  UPDATE Reducers (já criamos)
  on(UsersActions.updateUser, (state) => ({
    ...state,
    updateLoading: true,
    updateError: null,
  })),

  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    updateLoading: false,
    list: state.list.map((u) => (u.id === user.id ? user : u)),
    selectedUser:
      state.selectedUser?.id === user.id ? user : state.selectedUser,
  })),

  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    updateLoading: false,
    updateError: error,
  }))
);
