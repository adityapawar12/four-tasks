import Header from "../Header";
import Footer from "../Footer";
import SideNav from "../SideNav";
import AddEditTask from "../AddEditTask";
import AddEditNote from "../AddEditNote";

type showComponents = {
  showHeader: boolean;
  showSideNav: boolean;
  showAddTask: boolean;
  showAddNote: boolean;
  showFooter: boolean;
};

const SharedComponents = ({
  showHeader,
  showSideNav,
  showAddTask,
  showAddNote,
  showFooter,
}: showComponents) => {
  return (
    <>
      {showHeader ? <Header /> : null}
      {showSideNav ? <SideNav /> : null}
      {showAddTask ? <AddEditTask /> : null}
      {showAddNote ? <AddEditNote /> : null}
      {showFooter ? <Footer /> : null}
    </>
  );
};

export default SharedComponents;
