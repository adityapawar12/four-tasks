import { useNavigate } from "react-router";

import { useAuth } from "../../context/Auth";
import { useSideNav } from "../../context/SideNav";

import { FaBars } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();

  const userCont = useAuth();
  const sideNavCont = useSideNav();

  const logoutUser = () => {
    localStorage.removeItem(`userLoginInfo`);
    userCont?.logout();
    navigate(`/login`);
  };

  return (
    <header className={`mb-16`}>
      <div
        className={`fixed top-0 z-50 left-0 right-0 bg-violet-700 text-white p-5`}
      >
        <div className={`flex flex-row`}>
          <div className={`sm:basis-1/2 basis-3/4`}>
            <span
              className={`font-bold text-xl  inline sm:hidden pr-4`}
              onClick={sideNavCont?.toggleSideNav}
            >
              <FaBars className={`inline`} />
            </span>
            <h2 className={`font-bold text-xl inline sm:block`}>Four Tasks</h2>
          </div>
          <div className={`sm:basis-1/2 basis-1/4`}>
            <div className={`flex justify-end`}>
              <button
                onClick={logoutUser}
                className={`px-3 py-1 bg-white text-violet-700 rounded-2xl`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
