import SharedComponents from "../SharedComponents";

const Notes = () => {
  return (
    <>
      <SharedComponents
        showHeader={true}
        showSideNav={true}
        showAddTask={false}
        showAddNote={true}
        showFooter={false}
      />
    </>
  );
};

export default Notes;
