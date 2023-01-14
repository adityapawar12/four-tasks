import SharedComponents from "../SharedComponents";

import styles from "./index.module.css";

const Tasks = () => {
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

export default Tasks;
