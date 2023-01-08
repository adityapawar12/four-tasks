import { useNavigate } from "react-router";
import { useAuth } from "../../context/Auth";
import styles from "./index.module.css";

const Home = () => {
  const navigate = useNavigate();
  const userCont = useAuth();

  const logoutUser = () => {
    localStorage.removeItem("userLoginInfo");
    userCont?.logout();
    navigate("/login");
  };

  return userCont?.user ? (
    <>
      <div className="relative">
        <div
          className="fixed top-0 left-0 right-0 bg-violet-700 text-white p-5
    "
        >
          <div className="flex flex-row">
            <div className="basis-1/4">
              <h2 className=" font-bold text-xl">
                Four Tasks | {userCont?.user.name}
              </h2>
            </div>
            <div className="basis-1/4"></div>
            <div className="basis-1/4"></div>
            <div className="basis-1/4">
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
        <div className=" mb-16"></div>

        {/* <div className="fixed bottom-0 left-0 right-0 bg-violet-700 text-white py-5">
      <div className="flex flex-row ">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">Footer</div>
        <div className="basis-1/4"></div>
      </div>
    </div> */}
      </div>
    </>
  ) : (
    <>not ok</>
  );
};

export default Home;
