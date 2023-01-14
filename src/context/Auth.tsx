import { createContext, useContext, useState } from "react";

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
interface AuthContextInterface {
  user: AuthUserInterface | null;
  login(z: AuthLoginUserInterface): void;
  logout(): void;
  updateUser(z: AuthUserInterface): void;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<AuthUserInterface | null>(null);

  const login = (user: AuthLoginUserInterface): void => {
    setUser(user);
  };

  const updateUser = (user: AuthUserInterface): void => {
    setUser(user);
  };

  const logout = (): void => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
