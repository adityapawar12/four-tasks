import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import styles from "./index.module.css";

const RequireAuth = ({ children }: any) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth?.user && !localStorage.getItem("userLoginInfo")) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }
  const userD: string = localStorage.getItem("userLoginInfo") as string;
  auth?.updateUser(JSON.parse(userD));

  return <>{children}</>;
};

export default RequireAuth;
