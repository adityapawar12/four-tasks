import { createContext, useContext, useEffect, useState } from "react";

interface TaskTypeContextInterface {
  important: boolean;
  urgent: boolean;
  setImpUrg(): any;
  setImpNotUrg(): any;
  setNotImpUrg(): any;
  setNotImpNotUrg(): any;
}

export const TaskTypeContext = createContext<TaskTypeContextInterface | null>(
  null
);

export const TaskTypeProvider = ({ children }: any) => {
  const [taskType, setTaskType] = useState<TaskTypeContextInterface | null>(
    null
  );

  useEffect(() => {
    console.log("THE TASK TYPE >>>>>> ", taskType);
  }, [taskType]);

  const setImpUrg = () => {
    let obj: any = { important: true, urgent: true };
    setTaskType(obj);
    return obj;
  };

  const setImpNotUrg = () => {
    let obj: any = { important: true, urgent: false };
    setTaskType(obj);
    return obj;
  };

  const setNotImpUrg = () => {
    let obj: any = { important: false, urgent: true };
    setTaskType(obj);
    return obj;
  };

  const setNotImpNotUrg = () => {
    let obj: any = { important: false, urgent: false };
    setTaskType(obj);
    return obj;
  };

  return (
    <TaskTypeContext.Provider
      value={{
        important: true,
        urgent: true,
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
