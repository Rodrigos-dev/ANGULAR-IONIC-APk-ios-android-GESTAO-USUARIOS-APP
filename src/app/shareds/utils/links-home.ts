import { NavLink } from 'src/app/core/models/nav-link.model';
import { AppRoutes } from '../consts/rotas';

export const LINKS_HOME: NavLink[] = [
  {
    label: 'Cadastro',
    menuId: 'cadastroMenu',
    children: [{ path: AppRoutes.REGISTER_USERS, label: 'Usuários' }],
  },
  { path: AppRoutes.SETTINGS, label: 'Configurações', exact: true },
];
