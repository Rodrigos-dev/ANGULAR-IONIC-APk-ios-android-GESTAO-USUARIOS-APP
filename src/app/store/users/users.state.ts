import { User } from 'src/app/core/models/user.model';

//******STATE PARA LISTA COM PAGINACAO

export interface UsersState {
  list: User[];
  loading: boolean;
  loadingMore: boolean; // ✅ Loading específico para "load more"
  error: string | null;
  page: number;
  total: number;
  hasMore: boolean;

  selectedUser: User | null; // ✅ NOVO - usuário selecionado
  selectedUserLoading: boolean; // ✅ NOVO - loading do detalhe
  selectedUserError: string | null; // ✅ NOVO - erro do detalhe

  // ✅ ADICIONE ESTES CAMPOS PARA OPERAÇÕES CRUD
  createLoading: boolean;
  createError: string | null;

  updateLoading: boolean;
  updateError: string | null;

  deleteLoading: boolean;
  deleteError: string | null;
}

//STATE INITIAL PARA LISTA COM PAGINACAO
export const initialState: UsersState = {
  list: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  total: 0,
  hasMore: true,

  selectedUser: null, // ✅ INICIAL
  selectedUserLoading: false, // ✅ INICIAL
  selectedUserError: null, // ✅ INICIAL

  // ✅ INICIALIZE OS NOVOS CAMPOS
  createLoading: false,
  createError: null,

  updateLoading: false,
  updateError: null,

  deleteLoading: false,
  deleteError: null,
};
//******STATE PARA LISTA COM PAGINACAO

//********************************************************************************************************************** */

//********** PARA LIDAR COM LISTA SEM PAGINACAO */

//arquivo sem paginacao
// export interface UsersState {
//   list: any[];
//   loading: boolean;
//   error: string | null;
// }

// export const initialState: UsersState = {
//   list: [],
//   loading: false,
//   error: null,
// };

//********** PARA LIDAR COM LISTA SEM PAGINACAO */
