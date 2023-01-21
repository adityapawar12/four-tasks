export interface AuthUserInterface {
  id?: number;
  name?: string;
  email: string;
  phone?: string;
  password?: string;
  inserted_at?: string;
  updated_at?: string;
}

export interface AuthLoginUserInterface {
  email: string;
  password: string;
}
