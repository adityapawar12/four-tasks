import { TaskInterface } from "../../models/Task";

const Task = (props: any) => {
  const taskData: TaskInterface = props.task;
  console.log(taskData);

  return (
    <div
      className={`text-base font-medium border-[1px] border-gray-200 shadow-none hover:shadow-md hover:shadow-slate-300 hover:border-gray-400 rounded-xl break-inside-avoid-column p-4`}
    >
      {taskData.title.length > 100
        ? `${taskData.title.substring(0, 100)}...`
        : taskData.title}
    </div>
  );
};

export default Task;
