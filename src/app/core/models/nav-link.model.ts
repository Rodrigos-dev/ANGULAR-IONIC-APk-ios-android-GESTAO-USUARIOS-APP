export interface NavLink {
  path?: string;
  label: string;
  exact?: boolean;
  menuId?: string;
  children?: NavLink[];
}
