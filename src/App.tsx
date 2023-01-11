import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import NoMatch from "./components/NoMatch";
import Login from "./components/Login";
import RequireAuth from "./components/RequireAuth";

import { AuthProvider } from "./context/Auth";
import { TaskTypeProvider } from "./context/TaskType";

import styles from "./App.module.css";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <TaskTypeProvider>
          <React.Suspense fallback={"Loading..."}>
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Login />
                  </RequireAuth>
                }
              />
              <Route
                path="/login"
                element={
                  <RequireAuth>
                    <Login />
                  </RequireAuth>
                }
              />

              <Route
                path="/home"
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />

              <Route path="*" element={<NoMatch />} />
            </Routes>
          </React.Suspense>
        </TaskTypeProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
