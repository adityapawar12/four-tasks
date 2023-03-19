import { useSideNav } from "../../context/SideNav";

import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaNotesMedical,
  FaTasks,
  FaTimesCircle,
} from "react-icons/fa";

const SideNav = () => {
  const sideNavCont = useSideNav();

  return (
    <div>
      {sideNavCont?.sideNav.isOpen ? (
        <div
          onMouseLeave={() => {
            sideNavCont?.toggleSideNav!();
          }}
        >
          <div
            className={`fixed overflow-y-auto overflow-x-hidden top-16 sm:top-20 left-0 sm:left-4 bottom-0 sm:bottom-4 rounded-none sm:rounded-2xl w-64 sm:w-72 shadow-sm sm:shadow-lg shadow-slate-300 z-40 bg-white text-slate-900 p-4`}
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
          onMouseEnter={() => {
            sideNavCont?.toggleSideNav!();
          }}
          onMouseLeave={() => {
            sideNavCont?.toggleSideNav!();
          }}
          className={`fixed overflow-y-auto hidden sm:block overflow-x-hidden top-20 left-4 bottom-4 rounded-2xl w-14 shadow-lg shadow-slate-300 z-40 bg-white text-slate-900 p-2`}
        >
          <div className={`flex flex-col`}>
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
    </div>
  );
};

export default SideNav;
