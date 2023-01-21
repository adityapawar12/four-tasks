import { createContext, useContext, useState } from "react";
import { TaskInterface } from "../models/Task";

interface TaskContextInterface {
  task: TaskInterface | null;
  isEditingTaskDone: boolean;
  isTaskAdded: boolean;
  setEditTask(task: TaskInterface | null): void;
  toggleIsEditingTask(): void;
  toggleIsTaskAdded(): void;
}

export const TaskContext = createContext<TaskContextInterface | null>(null);

export const TaskProvider = ({ children }: { children: JSX.Element }) => {
  const [task, setTask] = useState<TaskInterface | null>(null);
  const [isEditingTaskDone, setIsEditingTaskDone] = useState<boolean>(false);
  const [isTaskAdded, setIsTaskAdded] = useState<boolean>(false);

  const setEditTask = (task: TaskInterface | null): void => {
    let obj: TaskInterface | null = task;
    setTask(obj);
  };

  const toggleIsEditingTask = (): void => {
    setIsEditingTaskDone((prevIsEditingTaskDone: boolean) => {
      return !prevIsEditingTaskDone;
    });
  };

  const toggleIsTaskAdded = (): void => {
    setIsTaskAdded((prevIsTaskAdded: boolean) => {
      return !prevIsTaskAdded;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        task,
        isEditingTaskDone,
        isTaskAdded,
        setEditTask,
        toggleIsEditingTask,
        toggleIsTaskAdded,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  return useContext(TaskContext);
};
