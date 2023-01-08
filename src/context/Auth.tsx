import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextInterface {
  user: any;
  login(z: any): any;
  logout(): any;
  updateUser(z: any): any;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  const login = (user: any) => {
    setUser(user);
    return user;
  };

  const updateUser = (user: any) => {
    setUser(user);
    return user;
  };

  const logout = () => {
    setUser(null);
    return "ok";
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
