import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import NoMatch from "./components/NoMatch";
import Login from "./components/Login";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/Auth";
import { TaskTypeProvider } from "./context/TaskType";
import { SideNavProvider } from "./context/SideNav";
import { ThemeProvider } from "./context/Theme";

import styles from "./App.module.css";
import { TaskProvider } from "./context/AddEditTask";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <ThemeProvider>
          <TaskProvider>
            <TaskTypeProvider>
              <SideNavProvider>
                <React.Suspense fallback={"Loading..."}>
                  <Routes>
                    <Route
                      path={`/`}
                      element={
                        <RequireAuth>
                          <Login />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path={`/login`}
                      element={
                        <RequireAuth>
                          <Login />
                        </RequireAuth>
                      }
                    />

                    <Route
                      path={`/home`}
                      element={
                        <RequireAuth>
                          <Home />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path={`/tasks`}
                      element={
                        <RequireAuth>
                          <Tasks />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path={`/notes`}
                      element={
                        <RequireAuth>
                          <Notes />
                        </RequireAuth>
                      }
                    />

                    <Route path={`*`} element={<NoMatch />} />
                  </Routes>
                </React.Suspense>
              </SideNavProvider>
            </TaskTypeProvider>
          </TaskProvider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
