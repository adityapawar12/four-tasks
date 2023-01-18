import { useSideNav } from "../../context/SideNav";

import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaNotesMedical,
  FaTasks,
  FaAngleLeft,
} from "react-icons/fa";

import styles from "./index.module.css";

const SideNav = () => {
  const sideNavCont = useSideNav();

  return (
    <>
      {sideNavCont?.sideNav.isOpen ? (
        <div>
          <div
            onClick={() => {
              sideNavCont?.toggleSideNav!();
            }}
            className={`absolute left-72 mx-4 top-24 hidden sm:block text-violet-700 bg-white z-50 rounded-r-2xl text-xl p-2 border-l-0 border-2 border-slate-100`}
          >
            <FaAngleLeft />
          </div>
          <div
            className={`fixed overflow-y-auto overflow-x-hidden top-16 sm:top-20 left-0 sm:left-4 bottom-0 sm:bottom-4 rounded-none sm:rounded-2xl w-64 sm:w-72 shadow-sm sm:shadow-2xl shadow-slate-500 z-40 bg-white text-slate-900 p-4`}
          >
            <div className={`flex flex-col`}>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `p-3 mb-2 flex align-bottom items-center bg-violet-700 text-white rounded-2xl`
                    : `p-3 mb-2 flex align-bottom items-center hover:bg-violet-700 hover:text-white text-violet-700 bg-white rounded-2xl`
                }
                end
                to={`/home`}
              >
                <FaHome className={`basis-auto text-lg`} />
                <p className={`basis-auto p-0 m-0 pl-2 text-lg`}>Home</p>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `p-3 mb-2 flex align-bottom items-center bg-violet-700 text-white rounded-2xl`
                    : `p-3 mb-2 flex align-bottom items-center hover:bg-violet-700 hover:text-white text-violet-700 bg-white rounded-2xl`
                }
                end
                to={`/tasks`}
              >
                <FaTasks className={`basis-auto text-lg`} />
                <p className={`basis-auto p-0 m-0 pl-2 text-lg`}>Tasks</p>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `p-3 mb-2 flex align-bottom items-center bg-violet-700 text-white rounded-2xl`
                    : `p-3 mb-2 flex align-bottom items-center hover:bg-violet-700 hover:text-white text-violet-700 bg-white rounded-2xl`
                }
                end
                to={`/notes`}
              >
                <FaNotesMedical className={`basis-auto text-lg`} />
                <p className={`basis-auto p-0 m-0 pl-2 text-lg`}>Notes</p>
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`fixed overflow-y-auto hidden sm:block overflow-x-hidden top-20 left-4 bottom-4 rounded-2xl w-14 shadow-2xl shadow-slate-500 z-40 bg-white text-slate-900 p-2`}
        >
          <div className={`flex flex-col`}>
            <div
              onClick={() => {
                sideNavCont?.toggleSideNav!();
              }}
              className={`p-3 mt-3 mb-2 flex align-bottom items-center hover:bg-violet-700 hover:text-white text-violet-700 bg-white rounded-2xl`}
            >
              <FaBars />
            </div>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? `p-3 mb-2 flex align-bottom items-center text-white bg-violet-700 rounded-2xl`
                  : `p-3 mb-2 flex align-bottom items-center hover:bg-violet-700 hover:text-white text-violet-700 bg-white rounded-2xl`
              }
              end
              to={`/home`}
            >
              <FaHome className={`basis-auto text-lg`} />
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? `p-3 mb-2 flex align-bottom items-center text-white bg-violet-700 rounded-2xl`
                  : `p-3 mb-2 flex align-bottom items-center hover:bg-violet-700 hover:text-white text-violet-700 bg-white rounded-2xl`
              }
              end
              to={`/tasks`}
            >
              <FaTasks className={`basis-auto text-lg`} />
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? `p-3 mb-2 flex align-bottom items-center text-white bg-violet-700 rounded-2xl`
                  : `p-3 mb-2 flex align-bottom items-center hover:bg-violet-700 hover:text-white text-violet-700 bg-white rounded-2xl`
              }
              end
              to={`/notes`}
            >
              <FaNotesMedical className={`basis-auto text-lg`} />
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};

export default SideNav;
