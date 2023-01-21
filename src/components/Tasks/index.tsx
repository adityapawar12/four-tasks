import { useState, useEffect } from "react";

import { useAuth } from "../../context/Auth";
import { supabase } from "../../supabaseClient";
import { TaskInterface } from "../../models/Task";
import { useTask } from "../../context/AddEditTask";
import SharedComponents from "../SharedComponents";
import { useSideNav } from "../../context/SideNav";

import dayjs from "dayjs";
import Modal from "react-modal";
import { FaCheck, FaClock, FaInfoCircle, FaTimes } from "react-icons/fa";

type TaskFilter = {
  time: timeEnum;
  status: statusEnum;
};

enum timeEnum {
  ALL = "ALL",
  TODAY = "TODAY",
}

enum statusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

Modal.setAppElement("#root");
const Tasks = () => {
  const [tasksList, setTasksList] = useState<Map<
    string,
    Array<TaskInterface>
  > | null>(null);
  const [tasksDatesList, setTasksDatesList] = useState<any>(null);
  const [selectedTaskInfo, setSelectedTaskInfo] =
    useState<TaskInterface | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>({
    time: timeEnum.TODAY,
    status: statusEnum.PENDING,
  });

  const authContext = useAuth();

  const getTasksDB = async () => {
    setTasksDatesList([]);
    if (taskFilter.time === "TODAY") {
      let { data } = await supabase
        .from(`tasks`)
        .select(`*`)
        .eq("user_id", authContext?.user?.id)
        .eq("status", taskFilter.status)
        .gte("inserted_at", dayjs().format("YYYY-MM-DD"))
        .lte("inserted_at", dayjs().add(1, "day").format("YYYY-MM-DD"))
        .order("id", { ascending: false })
        .order("inserted_at", { ascending: false });

      if (data) {
        let dataByDate = new Map();

        for (let index = 0; index < data.length; index++) {
          if (
            dataByDate.get(
              dayjs(data[index].inserted_at).format("DD MMM, YYYY")
            )
          ) {
            dataByDate.set(
              dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
              [
                ...dataByDate.get(
                  dayjs(data[index].inserted_at).format("DD MMM, YYYY")
                ),
                data[index],
              ]
            );
          } else {
            dataByDate.set(
              dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
              [data[index]]
            );
            setTasksDatesList((prevTaskDatesList: any) => {
              if (prevTaskDatesList && data) {
                if (
                  prevTaskDatesList.includes(
                    dayjs(data[index].inserted_at).format("DD MMM, YYYY")
                  )
                ) {
                  return [...prevTaskDatesList];
                } else {
                  return [
                    ...prevTaskDatesList,
                    dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
                  ];
                }
              } else if (data) {
                return [dayjs(data[index].inserted_at).format("DD MMM, YYYY")];
              }
            });
          }
        }
        let sendData: Map<string, Array<TaskInterface>> = dataByDate;
        return dataByDate;
      }
    }

    let { data } = await supabase
      .from(`tasks`)
      .select(`*`)
      .eq("user_id", authContext?.user?.id)
      .eq("status", taskFilter.status)
      .order("id", { ascending: false })
      .order("inserted_at", { ascending: false });

    if (data) {
      let dataByDate = new Map();

      for (let index = 0; index < data.length; index++) {
        if (
          dataByDate.get(dayjs(data[index].inserted_at).format("DD MMM, YYYY"))
        ) {
          dataByDate.set(
            dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
            [
              ...dataByDate.get(
                dayjs(data[index].inserted_at).format("DD MMM, YYYY")
              ),
              data[index],
            ]
          );
        } else {
          dataByDate.set(
            dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
            [data[index]]
          );
          setTasksDatesList((prevTaskDatesList: any) => {
            if (prevTaskDatesList && data) {
              if (
                prevTaskDatesList.includes(
                  dayjs(data[index].inserted_at).format("DD MMM, YYYY")
                )
              ) {
                return [...prevTaskDatesList];
              } else {
                return [
                  ...prevTaskDatesList,
                  dayjs(data[index].inserted_at).format("DD MMM, YYYY"),
                ];
              }
            } else if (data) {
              return [dayjs(data[index].inserted_at).format("DD MMM, YYYY")];
            }
          });
        }
      }
      let sendData: Map<string, Array<TaskInterface>> = dataByDate;
      return dataByDate;
    }
  };

  const taskContext = useTask();
  const sideNavContext = useSideNav();

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
      setTasksList(null);
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

  const customStylesInput = {
    overlay: {
      background: `rgba(255, 255, 255, 0)`,
    },
    content: {
      top: `50%`,
      left: `50%`,
      right: `auto`,
      bottom: `auto`,
      width: `23rem`,
      marginRight: `-50%`,
      padding: `0px 0px`,
      boxShadow: `0 1px 2px 0 rgba(60,64,67,0.302),0 2px 6px 2px rgba(60,64,67,0.149)`,
      border: `0`,
      borderRadius: `1rem`,
      transform: `translate(-50%, -50%)`,
    },
  };

  useEffect(() => {
    getTasksDB()
      .then((data: any) => {
        setTasksList(data);
      })
      .catch((err: any) => {});

    return () => {
      setTasksList(null);
    };
  }, [taskFilter]);

  const updateTaskToPending = async (task: TaskInterface) => {
    taskContext?.toggleIsEditingTask();
    const { data, error } = await supabase
      .from("tasks")
      .update([
        {
          status: statusEnum.PENDING,
        },
      ])
      .eq("id", task?.id);

    taskContext?.toggleIsEditingTask();
  };

  const updateTaskToCancelled = async (task: TaskInterface) => {
    taskContext?.toggleIsEditingTask();
    const { data, error } = await supabase
      .from("tasks")
      .update([
        {
          status: statusEnum.CANCELLED,
        },
      ])
      .eq("id", task?.id);

    taskContext?.toggleIsEditingTask();
  };

  const updateTaskToCompleted = async (task: TaskInterface) => {
    taskContext?.toggleIsEditingTask();
    const { data, error } = await supabase
      .from("tasks")
      .update([
        {
          status: statusEnum.COMPLETED,
        },
      ])
      .eq("id", task?.id);

    taskContext?.toggleIsEditingTask();
  };
  return (
    <>
      <SharedComponents
        showHeader={true}
        showSideNav={true}
        showAddTask={true}
        showAddNote={false}
        showFooter={false}
      />

      <div
        className={`mt-24 ${
          sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
        }  `}
      >
        <div
          className={`flex flex-col sm:flex-row justify-center align-middle items-center`}
        >
          <div className={`basis-auto flex flex-row my-1`}>
            <div
              onClick={() =>
                setTaskFilter((prevTaskFilter) => {
                  return { ...prevTaskFilter, time: timeEnum.TODAY };
                })
              }
              className={`basis-1/2 m-0 px-4 border-2 text-center ${
                taskFilter.time === "TODAY"
                  ? "border-violet-700 text-violet-700 bg-white hover:border-2"
                  : "border-violet-700 text-white bg-violet-700 hover:border-violet-700 hover:text-violet-700 hover:bg-white hover:border-2"
              } rounded-l-2xl`}
            >
              TODAY
            </div>
            <div
              onClick={() =>
                setTaskFilter((prevTaskFilter) => {
                  return { ...prevTaskFilter, time: timeEnum.ALL };
                })
              }
              className={`basis-1/2 m-0 px-4 border-2 text-center ${
                taskFilter.time === "ALL"
                  ? "border-violet-700 text-violet-700 bg-white hover:border-2"
                  : "border-violet-700 text-white bg-violet-700 hover:border-violet-700 hover:text-violet-700 hover:bg-white hover:border-2"
              } rounded-r-2xl`}
            >
              ALL
            </div>
          </div>
          <div className={`basis-auto flex flex-row my-1`}>
            <div
              onClick={() =>
                setTaskFilter((prevTaskFilter) => {
                  return { ...prevTaskFilter, status: statusEnum.PENDING };
                })
              }
              className={`basis-1/3 m-0 px-4 border-2 text-center ${
                taskFilter.status === "PENDING"
                  ? "border-violet-700 text-violet-700 bg-white hover:border-2"
                  : "border-violet-700 text-white bg-violet-700 hover:border-violet-700 hover:text-violet-700 hover:bg-white hover:border-2"
              }  rounded-l-2xl`}
            >
              PENDING
            </div>
            <div
              onClick={() =>
                setTaskFilter((prevTaskFilter) => {
                  return { ...prevTaskFilter, status: statusEnum.CANCELLED };
                })
              }
              className={`basis-1/3 m-0 px-4 border-2 text-center ${
                taskFilter.status === "CANCELLED"
                  ? "border-violet-700 text-violet-700 bg-white hover:border-2"
                  : "border-violet-700 text-white bg-violet-700 hover:border-violet-700 hover:text-violet-700 hover:bg-white hover:border-2"
              }`}
            >
              CANCELLED
            </div>
            <div
              onClick={() =>
                setTaskFilter((prevTaskFilter) => {
                  return { ...prevTaskFilter, status: statusEnum.COMPLETED };
                })
              }
              className={`basis-1/3 m-0 px-4 border-2 text-center ${
                taskFilter.status === "COMPLETED"
                  ? "border-violet-700 text-violet-700 bg-white hover:border-2"
                  : "border-violet-700 text-white bg-violet-700 hover:border-violet-700 hover:text-violet-700 hover:bg-white hover:border-2"
              }  rounded-r-2xl`}
            >
              COMPLETED
            </div>
          </div>
        </div>
        <ul>
          {tasksDatesList &&
            tasksDatesList.map((taskDate: string) => (
              <li key={taskDate}>
                <h2 className={`mx-2 text-left text-xl font-bold`}>
                  {taskDate}
                </h2>
                <ul>
                  {tasksList && tasksList?.get(taskDate)
                    ? tasksList?.get(taskDate)?.map((task: TaskInterface) => (
                        <li
                          key={task.id}
                          className={`my-3 mx-2 p-4 rounded-xl ${
                            task.is_important && task.is_urgent
                              ? "bg-violet-800"
                              : ""
                          } ${
                            task.is_important && !task.is_urgent
                              ? "bg-violet-600"
                              : ""
                          } ${
                            !task.is_important && task.is_urgent
                              ? "bg-violet-600"
                              : ""
                          } ${
                            !task.is_important && !task.is_urgent
                              ? "bg-violet-400"
                              : ""
                          } text-slate-100 border-zinc-200 border`}
                        >
                          <div className={`flex flex-row`}>
                            <div
                              className={`basis-3/4`}
                              onClick={() => {
                                getTaskToEdit(task);
                              }}
                            >
                              <h1 className={`text-2xl font-bold`}>
                                {task.title}
                              </h1>
                              <p className={`text-lg font-normal`}>
                                {task.description}
                              </p>
                            </div>
                            <div
                              className={`basis-1/4 flex flex-col justify-between`}
                            >
                              <div
                                className={`relative basis-auto flex flex-row justify-end`}
                              >
                                <FaInfoCircle
                                  className={`text-xl text-right`}
                                  onClick={() => {
                                    setSelectedTaskInfo(task);
                                    setIsInfoModalOpen(true);
                                  }}
                                />
                              </div>
                              <div
                                className={`relative basis-auto flex flex-row justify-center align-middle items-center`}
                              >
                                {taskFilter.status !== "PENDING" && (
                                  <div
                                    className={`basis-1/2 flex flex-row justify-center ${
                                      task.is_important && task.is_urgent
                                        ? "bg-violet-800 text-white border-2 border-white hover:bg-white hover:text-violet-800"
                                        : ""
                                    } ${
                                      task.is_important && !task.is_urgent
                                        ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                                        : ""
                                    } ${
                                      !task.is_important && task.is_urgent
                                        ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                                        : ""
                                    } ${
                                      !task.is_important && !task.is_urgent
                                        ? "bg-violet-400 text-white border-2 border-white hover:bg-white hover:text-violet-400"
                                        : ""
                                    } py-1 px-2 mx-1 rounded-xl`}
                                    onClick={() => {
                                      updateTaskToPending(task);
                                    }}
                                  >
                                    <FaClock />
                                  </div>
                                )}
                                {taskFilter.status !== "CANCELLED" && (
                                  <div
                                    className={`basis-1/2 flex flex-row justify-center ${
                                      task.is_important && task.is_urgent
                                        ? "bg-violet-800 text-white border-2 border-white hover:bg-white hover:text-violet-800"
                                        : ""
                                    } ${
                                      task.is_important && !task.is_urgent
                                        ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                                        : ""
                                    } ${
                                      !task.is_important && task.is_urgent
                                        ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                                        : ""
                                    } ${
                                      !task.is_important && !task.is_urgent
                                        ? "bg-violet-400 text-white border-2 border-white hover:bg-white hover:text-violet-400"
                                        : ""
                                    } py-1 px-2 mx-1 rounded-xl`}
                                    onClick={() => {
                                      updateTaskToCancelled(task);
                                    }}
                                  >
                                    <FaTimes />
                                  </div>
                                )}
                                {taskFilter.status !== "COMPLETED" && (
                                  <div
                                    className={`basis-1/2 flex flex-row justify-center ${
                                      task.is_important && task.is_urgent
                                        ? "bg-violet-800 text-white border-2 border-white hover:bg-white hover:text-violet-800"
                                        : ""
                                    } ${
                                      task.is_important && !task.is_urgent
                                        ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                                        : ""
                                    } ${
                                      !task.is_important && task.is_urgent
                                        ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                                        : ""
                                    } ${
                                      !task.is_important && !task.is_urgent
                                        ? "bg-violet-400 text-white border-2 border-white hover:bg-white hover:text-violet-400"
                                        : ""
                                    } py-1 px-2 mx-1 rounded-xl`}
                                    onClick={() => {
                                      updateTaskToCompleted(task);
                                    }}
                                  >
                                    <FaCheck />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    : "not ok"}
                </ul>
              </li>
            ))}
          {/* {tasksList?.map((task: TaskInterface) => (

            <li
              key={task.id}
              className={`my-3 mx-2 p-4 rounded-xl ${
                task.is_important && task.is_urgent ? "bg-violet-800" : ""
              } ${
                task.is_important && !task.is_urgent ? "bg-violet-600" : ""
              } ${
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
                <div className={`basis-1/4 flex flex-col justify-between`}>
                  <div
                    className={`relative basis-auto flex flex-row justify-end`}
                  >
                    <FaInfoCircle
                      className={`text-xl text-right`}
                      onClick={() => {
                        setSelectedTaskInfo(task);
                        setIsInfoModalOpen(true);
                      }}
                    />
                  </div>
                  <div
                    className={`relative basis-auto flex flex-row justify-center align-middle items-center`}
                  >
                    {taskFilter.status !== "PENDING" && (
                      <div
                        className={`basis-1/2 flex flex-row justify-center ${
                          task.is_important && task.is_urgent
                            ? "bg-violet-800 text-white border-2 border-white hover:bg-white hover:text-violet-800"
                            : ""
                        } ${
                          task.is_important && !task.is_urgent
                            ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                            : ""
                        } ${
                          !task.is_important && task.is_urgent
                            ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                            : ""
                        } ${
                          !task.is_important && !task.is_urgent
                            ? "bg-violet-400 text-white border-2 border-white hover:bg-white hover:text-violet-400"
                            : ""
                        } py-1 px-2 mx-1 rounded-xl`}
                        onClick={() => {
                          updateTaskToPending(task);
                        }}
                      >
                        <FaClock />
                      </div>
                    )}
                    {taskFilter.status !== "CANCELLED" && (
                      <div
                        className={`basis-1/2 flex flex-row justify-center ${
                          task.is_important && task.is_urgent
                            ? "bg-violet-800 text-white border-2 border-white hover:bg-white hover:text-violet-800"
                            : ""
                        } ${
                          task.is_important && !task.is_urgent
                            ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                            : ""
                        } ${
                          !task.is_important && task.is_urgent
                            ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                            : ""
                        } ${
                          !task.is_important && !task.is_urgent
                            ? "bg-violet-400 text-white border-2 border-white hover:bg-white hover:text-violet-400"
                            : ""
                        } py-1 px-2 mx-1 rounded-xl`}
                        onClick={() => {
                          updateTaskToCancelled(task);
                        }}
                      >
                        <FaTimes />
                      </div>
                    )}
                    {taskFilter.status !== "COMPLETED" && (
                      <div
                        className={`basis-1/2 flex flex-row justify-center ${
                          task.is_important && task.is_urgent
                            ? "bg-violet-800 text-white border-2 border-white hover:bg-white hover:text-violet-800"
                            : ""
                        } ${
                          task.is_important && !task.is_urgent
                            ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                            : ""
                        } ${
                          !task.is_important && task.is_urgent
                            ? "bg-violet-600 text-white border-2 border-white hover:bg-white hover:text-violet-600"
                            : ""
                        } ${
                          !task.is_important && !task.is_urgent
                            ? "bg-violet-400 text-white border-2 border-white hover:bg-white hover:text-violet-400"
                            : ""
                        } py-1 px-2 mx-1 rounded-xl`}
                        onClick={() => {
                          updateTaskToCompleted(task);
                        }}
                      >
                        <FaCheck />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))} */}
        </ul>
      </div>

      <Modal
        isOpen={isInfoModalOpen}
        onRequestClose={() => {
          setIsInfoModalOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-4`}>
          <div className={`basis-auto w-auto text-center`}>
            <span className={`text-xl font-bold`}>Task Details</span>
          </div>
          <div className={`basis-auto w-auto`}>
            <span className={`text-md font-bold`}>Task Title : </span>
            <span className={`text-md font-normal`}>
              {selectedTaskInfo?.title}
            </span>
          </div>
          <div className={`basis-auto w-auto`}>
            <span className={`text-md font-bold`}>Task Description : </span>
            <span className={`text-md font-normal`}>
              {selectedTaskInfo?.description}
            </span>
          </div>
          <div className={`basis-auto w-auto`}>
            <span className={`text-md font-bold`}>Important : </span>
            <span className={`text-md font-normal`}>
              {selectedTaskInfo?.is_important ? (
                <FaCheck className={`inline`} />
              ) : (
                <FaTimes className={`inline`} />
              )}
            </span>
          </div>
          <div className={`basis-auto w-auto`}>
            <span className={`text-md font-bold`}>Urgent : </span>
            <span className={`text-md font-normal`}>
              {selectedTaskInfo?.is_urgent ? (
                <FaCheck className={`inline`} />
              ) : (
                <FaTimes className={`inline`} />
              )}
            </span>
          </div>
          <div className={`basis-auto w-auto`}>
            <span className={`text-md font-bold`}>Created Date: </span>
            <span className={`text-md font-normal`}>
              {dayjs(selectedTaskInfo?.inserted_at).format(
                "DD MM YYYY HH:mm A"
              )}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Tasks;
