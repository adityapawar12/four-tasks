import { useState, useEffect } from "react";

import SharedComponents from "../SharedComponents";
import { supabase } from "../../supabaseClient";

import styles from "./index.module.css";
import { TaskInterface } from "../AddEditTask";
import { useTask } from "../../context/AddEditTask";
import { useAuth } from "../../context/Auth";
import { FaInfoCircle } from "react-icons/fa";

const Tasks = () => {
  const [tasksList, setTasksList] = useState<Array<any> | null>([]);

  const authContext = useAuth();

  const getTasksDB = async (): Promise<Array<any> | null> => {
    let { data } = await supabase
      .from(`tasks`)
      .select(`*`)
      .eq("user_id", authContext?.user?.id)
      .order("id", { ascending: false });
    return data;
  };

  const taskContext = useTask();

  const getTaskToEdit = (task: TaskInterface) => {
    taskContext?.setEditTask(task);
    taskContext?.toggleIsEditingTask();
  };

  useEffect(() => {
    getTasksDB()
      .then((data: any) => {
        setTasksList(data);
      })
      .catch((err: any) => {});

    return () => {
      setTasksList([]);
    };
  }, []);

  useEffect(() => {
    if (!taskContext?.isEditingTaskDone || taskContext?.isTaskAdded) {
      getTasksDB()
        .then((data: any) => {
          setTasksList(data);
        })
        .catch((err: any) => {});
    }
  }, [taskContext]);

  return (
    <>
      <SharedComponents
        showHeader={true}
        showSideNav={true}
        showAddTask={true}
        showFooter={false}
      />

      <ul className={`mt-24`}>
        {tasksList?.map((task: TaskInterface) => (
          <li
            key={task.id}
            className={`my-3 mx-2 p-4 rounded-xl ${
              task.is_important && task.is_urgent ? "bg-violet-800" : ""
            } ${task.is_important && !task.is_urgent ? "bg-violet-600" : ""} ${
              !task.is_important && task.is_urgent ? "bg-violet-600" : ""
            } ${
              !task.is_important && !task.is_urgent ? "bg-violet-400" : ""
            } text-slate-100 border-zinc-200 border`}
          >
            <div className={`flex flex-row`}>
              <div
                className={`basis-3/4`}
                onClick={() => {
                  getTaskToEdit(task);
                }}
              >
                <h1 className={`text-2xl font-bold`}>{task.title}</h1>
                <p className={`text-lg font-normal`}>{task.description}</p>
              </div>
              <div className={`basis-1/4 relative`}>
                <FaInfoCircle className={`text-xl absolute right-0`} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Tasks;
