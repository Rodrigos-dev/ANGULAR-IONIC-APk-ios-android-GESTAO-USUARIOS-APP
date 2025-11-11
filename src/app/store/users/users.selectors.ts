// selector sem paginacao
// users.selectors.ts
// import { createSelector, createFeatureSelector } from '@ngrx/store';
// import { UsersState } from './users.state';

// export const selectUsersState = createFeatureSelector<UsersState>('users');

// export const selectUsersList = createSelector(
//   selectUsersState,
//   (state) => state.list
// );

// export const selectUsersLoading = createSelector(
//   selectUsersState,
//   (state) => state.loading
// );

// export const selectUsersError = createSelector(
//   selectUsersState,
//   (state) => state.error
// );

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UsersState } from './users.state';

// users.selectors.ts
export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUsersList = createSelector(
  selectUsersState,
  (state) => state.list
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);

export const selectUsersLoadingMore = createSelector(
  selectUsersState,
  (state) => state.loadingMore
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error
);

export const selectUsersPage = createSelector(
  selectUsersState,
  (state) => state.page
);

export const selectUsersTotal = createSelector(
  selectUsersState,
  (state) => state.total
);

export const selectUsersHasMore = createSelector(
  selectUsersState,
  (state) => state.hasMore
);

// ✅ GET BY ID - Selectors ***********************************************
export const selectSelectedUser = createSelector(
  selectUsersState,
  (state) => state.selectedUser
);

export const selectSelectedUserLoading = createSelector(
  selectUsersState,
  (state) => state.selectedUserLoading
);

export const selectSelectedUserError = createSelector(
  selectUsersState,
  (state) => state.selectedUserError
);

//delete user
// users.selectors.ts
export const selectDeleteUserLoading = createSelector(
  selectUsersState,
  (state) => state.deleteLoading
);

export const selectDeleteUserError = createSelector(
  selectUsersState,
  (state) => state.deleteError
);

//create user
export const selectCreateUserLoading = createSelector(
  selectUsersState,
  (state) => state.createLoading
);

export const selectCreateUserError = createSelector(
  selectUsersState,
  (state) => state.createError
);

// UPDATE Selectors (já criamos)
export const selectUpdateUserLoading = createSelector(
  selectUsersState,
  (state) => state.updateLoading
);

export const selectUpdateUserError = createSelector(
  selectUsersState,
  (state) => state.updateError
);
