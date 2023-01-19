import { useState, useEffect } from "react";

import SharedComponents from "../SharedComponents";
import { supabase } from "../../supabaseClient";

import styles from "./index.module.css";
import { TaskInterface } from "../AddEditTask";

const Tasks = () => {
  const [tasksList, setTasksList] = useState<Array<any> | null>([]);

  const getTasksDB = async (): Promise<Array<any> | null> => {
    let { data } = await supabase.from(`tasks`).select(`*`);
    console.log("TASKS DATA >>> ", data);
    return data;
  };

  useEffect(() => {
    getTasksDB()
      .then((data: any) => {
        setTasksList(data);
      })
      .catch((err: any) => {
        console.log(err);
      });

    return () => {
      setTasksList([]);
    };
  }, []);

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
            className={`my-3 mx-2 p-4 rounded-xl bg-gray-50 border-zinc-200 border`}
          >
            <h1 className={`text-2xl font-bold`}>{task.title}</h1>
            <p className={`text-lg font-normal`}>{task.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Tasks;
