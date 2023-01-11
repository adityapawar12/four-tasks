import AddTask from "../AddTask";
import Header from "../Header";

import styles from "./index.module.css";

const Home = () => {
  return (
    <>
      <div className="relative">
        <div className=" mb-16">
          <Header />
        </div>
      </div>
      <AddTask />
    </>
  );
};

export default Home;
