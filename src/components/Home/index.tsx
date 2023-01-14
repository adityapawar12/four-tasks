import SharedComponents from "../SharedComponents";

import styles from "./index.module.css";

const Home = () => {
  return (
    <>
      <SharedComponents
        showHeader={true}
        showSideNav={true}
        showAddTask={true}
        showFooter={false}
      />
    </>
  );
};

export default Home;
