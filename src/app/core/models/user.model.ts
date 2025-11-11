export interface UpdateResult {
  generatedMaps: any[];
  raw: any[];
  affected: number;
}

export interface UserAuth {
  user: {
    name: string;
    email: string;
    id: string;
    roleUser: string;
  };
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  document: string;
  codeForgetPassword: string | null;
  roleUser: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserResponse {
  total: number;
  users: User[];
}
