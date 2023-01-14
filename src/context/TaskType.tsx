import { createContext, useContext, useState } from "react";

interface TaskTypeInterface {
  important: boolean;
  urgent: boolean;
}

interface TaskTypeContextInterface {
  taskType: TaskTypeInterface | null;
  setImpUrg(): void;
  setImpNotUrg(): void;
  setNotImpUrg(): void;
  setNotImpNotUrg(): void;
}

export const TaskTypeContext = createContext<TaskTypeContextInterface | null>(
  null
);

export const TaskTypeProvider = ({ children }: { children: JSX.Element }) => {
  const [taskType, setTaskType] = useState<TaskTypeInterface | null>(null);

  const setImpUrg = () => {
    let obj: TaskTypeInterface = { important: true, urgent: true };
    setTaskType(obj);
    return obj;
  };

  const setImpNotUrg = () => {
    let obj: TaskTypeInterface = { important: true, urgent: false };
    setTaskType(obj);
    return obj;
  };

  const setNotImpUrg = () => {
    let obj: TaskTypeInterface = { important: false, urgent: true };
    setTaskType(obj);
    return obj;
  };

  const setNotImpNotUrg = () => {
    let obj: TaskTypeInterface = { important: false, urgent: false };
    setTaskType(obj);
    return obj;
  };

  return (
    <TaskTypeContext.Provider
      value={{
        taskType,
        setImpUrg,
        setImpNotUrg,
        setNotImpUrg,
        setNotImpNotUrg,
      }}
    >
      {children}
    </TaskTypeContext.Provider>
  );
};

export const useTaskType = () => {
  return useContext(TaskTypeContext);
};
