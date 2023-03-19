import styles from "./styles.module.css";

const HomeTopCards = ({ tasksCount, text }: any) => {
  return (
    <div
      className={`basis-1/2 border-violet-600 ${styles.topCards} rounded-2xl m-2 text-violet-600 border-2 py-2 px-6 flex flex-ro justify-start items-start`}
    >
      <div className={`text-3xl font-bold p-1`}>{tasksCount}</div>
      <div className={`text-xs font-semibold mt-1`}>{text}</div>
    </div>
  );
};

export default HomeTopCards;
