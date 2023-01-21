import SharedComponents from "../SharedComponents";

const Home = () => {
  return (
    <>
      <SharedComponents
        showHeader={true}
        showSideNav={true}
        showAddTask={true}
        showAddNote={false}
        showFooter={false}
      />
    </>
  );
};

export default Home;
