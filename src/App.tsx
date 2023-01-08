import React from "react";
import styles from "./App.module.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import NoMatch from "./components/NoMatch";
import Login from "./components/Login";
import { AuthContext, AuthProvider } from "./context/Auth";
import RequireAuth from "./components/RequireAuth";

const App = () => {
  return (
    <div className={styles.mainDiv}>
      <AuthProvider>
        <React.Suspense fallback={"Loading..."}>
          <Routes>
            {/* PAGES WITH NO AUTH REQ */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* PAGES WITH AUTH REQ */}
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />

            {/* NO MATCHING ROUTE */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </div>
  );
};

export default App;
