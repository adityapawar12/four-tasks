import Header from "../Header";
import SideNav from "../SideNav";
import AddTask from "../AddTask";
import Footer from "../Footer";

import styles from "./index.module.css";

type showComponents = {
  showHeader: boolean;
  showSideNav: boolean;
  showAddTask: boolean;
  showFooter: boolean;
};

const SharedComponents = ({
  showHeader,
  showSideNav,
  showAddTask,
  showFooter,
}: showComponents) => {
  return (
    <>
      {showHeader ? <Header /> : null}
      {showSideNav ? <SideNav /> : null}
      {showAddTask ? <AddTask /> : null}
      {showFooter ? <Footer /> : null}
    </>
  );
};

export default SharedComponents;
