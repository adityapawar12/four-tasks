import { useNavigate } from "react-router";

import { useAuth } from "../../context/Auth";

import styles from "./index.module.css";

const Header = () => {
  const navigate = useNavigate();

  const userCont = useAuth();

  const logoutUser = () => {
    localStorage.removeItem("userLoginInfo");
    userCont?.logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-violet-700 text-white p-5">
        <div className="flex flex-row">
          <div className="sm:basis-1/2 basis-3/4">
            <h2 className=" font-bold text-xl">
              Four Tasks | {userCont?.user?.name}
            </h2>
          </div>
          <div className="sm:basis-1/2 basis-1/4">
            <div className="flex justify-end">
              <button
                onClick={logoutUser}
                className="px-3 py-1 bg-white text-violet-700 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
