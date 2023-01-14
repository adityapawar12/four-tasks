import { useEffect } from "react";

import { useAuth } from "../../context/Auth";

import { Navigate, useLocation, useNavigate } from "react-router-dom";

import styles from "./index.module.css";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userD: string | null = localStorage.getItem(`userLoginInfo`);

    if (userD && JSON.parse(userD)) {
      navigate(`/home`);
      auth?.updateUser(JSON.parse(userD));
    }
  }, []);

  if (
    location.pathname !== `/login` &&
    !auth?.user &&
    !localStorage.getItem(`userLoginInfo`)
  ) {
    return <Navigate to={`/login`} state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
