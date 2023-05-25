import { useEffect, useState } from "react";
import {
  TaskInterface,
  TaskStatusEnum,
  TasksViewEnum,
} from "../../models/Task";
import { supabase } from "../../supabaseClient";
import SharedComponents from "../SharedComponents";
import Task from "../Task";
import { useSideNav } from "../../context/SideNav";
import { FaThList, FaTh, FaFilter } from "react-icons/fa";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import FormikControls from "../formik/ReusableComponents/FormikControls";
import { motion } from "framer-motion";
import { useTask } from "../../context/AddEditTask";

type TasksFilterType = {
  fromdate: string | null;
  todate: string | null;
  statustext: TaskStatusEnum | "" | null;
  searchtext: string | null;
};

const TasksList = () => {
  const [tasksList, setTasksList] = useState<Map<
    string,
    Array<TaskInterface>
  > | null>(null);
  const [tasksListView, setTasksListView] = useState<TasksViewEnum>(
    TasksViewEnum.GRID
  );
  const descriptionVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  const taskProvider = useTask();

  const [showTaskFilterPopup, setShowTaskFilterPopup] =
    useState<boolean>(false);
  let taskFilterFormInitialValues: TasksFilterType = {
    fromdate: "",
    todate: "",
    statustext: "",
    searchtext: "",
  };
  const [taskFilterFormValues, setTaskFilterFormValues] =
    useState<TasksFilterType | null>(taskFilterFormInitialValues);
  const taskFilterValidationSchema = Yup.object({
    fromdate: Yup.string().nullable(),
    todate: Yup.string().nullable(),
    statustext: Yup.string().nullable(),
    searchtext: Yup.string().nullable(),
  });

  const dropdownOptionsFilterForm = [
    { key: "Select Status", value: "" },
    {
      key: "All",
      value: "ALL",
    },
    {
      key: "Pending",
      value: "PENDING",
    },
    {
      key: "Completed",
      value: "COMPLETED",
    },
    {
      key: "Cancelled",
      value: "CANCELLED",
    },
  ];

  const sideNavContext = useSideNav();

  const getTasksListDB = async ({
    fromdate,
    todate,
    statustext,
    searchtext,
  }: TasksFilterType) => {
    if (fromdate === "") {
      fromdate = null;
    }
    if (todate === "") {
      todate = null;
    }
    if (statustext === "" || statustext === TaskStatusEnum.ALL) {
      statustext = null;
    }
    if (searchtext === "") {
      searchtext = null;
    }
    const { data, error } = await supabase.rpc("tp_get_tasks", {
      fromdate,
      todate,
      statustext,
      searchtext,
    });
    if (error) {
      console.error(error);
      return [];
    }
    return data;
  };

  useEffect(() => {
    getTasksListDB(taskFilterFormInitialValues)
      .then((data: any) => {
        setTasksList(data);
      })
      .catch((error) => {
        throw error;
      });
  }, [taskProvider?.isEditingTaskDone]);

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
        className={`flex sm:flex-row flex-col mt-24 ${
          sideNavContext?.sideNav.isOpen ? "sm:ml-72" : "sm:ml-20"
        }`}
      >
        <div
          className={`basis-1/2 ${
            sideNavContext?.sideNav.isOpen
              ? "mx-1 sm:mx-10"
              : "mx-1 sm:mx-20 md:mx-24 lg:mx-40"
          } sm:basis-full flex flex-row justify-self-stretch align-middle items-start`}
        >
          <div className={`basis-1/2 flex flex-row justify-start mx-2`}>
            <h1 className={`text-2xl font-semibold`}>Tasks</h1>
          </div>
          <div className={`basis-1/2 flex flex-row justify-end mx-2`}>
            <div
              className={`${
                tasksListView === TasksViewEnum.GRID
                  ? "bg-violet-700 text-white border-2 border-violet-700"
                  : "bg-white text-violet-400 border-2 border-violet-700"
              } flex flex-row p-2 rounded-l-lg transition-all duration-500`}
              onClick={() => setTasksListView(TasksViewEnum.GRID)}
            >
              <div className={`mx-2`}>
                <FaTh />
              </div>
            </div>
            <div
              className={`${
                tasksListView === TasksViewEnum.LIST
                  ? "bg-violet-700 text-white border-2 border-violet-700"
                  : "bg-white text-violet-400 border-2 border-violet-700"
              } flex flex-row p-2 rounded-r-lg transition-all duration-500`}
              onClick={() => setTasksListView(TasksViewEnum.LIST)}
            >
              <div className={`mx-2`}>
                <FaThList />
              </div>
            </div>
            <div
              className={`${
                showTaskFilterPopup === true
                  ? "bg-violet-700 text-white border-2 border-violet-700"
                  : "bg-white text-violet-400 border-2 border-violet-700"
              } flex flex-row p-2 rounded-lg ml-2 transition-all duration-500`}
              onClick={() =>
                setShowTaskFilterPopup(
                  (prevShowTaskFilterPopup) => !prevShowTaskFilterPopup
                )
              }
            >
              <div id="clickable" className={`mx-2`}>
                <FaFilter />
              </div>
            </div>
            <Tooltip
              anchorSelect="#clickable"
              place={"bottom"}
              isOpen={showTaskFilterPopup}
              clickable
              offset={20}
              style={{
                backgroundColor: "rgb(109 40 217)",
                color: "rgb(34, 34, 34)",
                opacity: "100",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <Formik
                initialValues={
                  taskFilterFormValues || taskFilterFormInitialValues
                }
                onSubmit={(values: TasksFilterType) => {
                  setTaskFilterFormValues(values);
                  if (values !== null) {
                    getTasksListDB(values)
                      .then((data: any) => {
                        setTasksList(data);
                        setShowTaskFilterPopup(false);
                      })
                      .catch((error) => {
                        throw error;
                      });
                  }
                }}
                validationSchema={taskFilterValidationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div className={`w-64`}>
                      <Form>
                        <div className={`flex flex-col w-full text-black mb-2`}>
                          <div className={`basis-auto text-start`}>
                            <label
                              htmlFor="searchtext"
                              className={`text-white`}
                            >
                              Search Text
                            </label>
                            <FormikControls
                              control={"input"}
                              name={"searchtext"}
                              type={"text"}
                              label={"Enter Email"}
                              showLabel={false}
                              className={`w-full py-1 px-2 rounded-sm`}
                            />
                          </div>
                        </div>
                        <div className={`flex flex-col w-full text-black mb-2`}>
                          <div className={`basis-auto text-start`}>
                            <label
                              htmlFor="searchtext"
                              className={`text-white`}
                            >
                              Status
                            </label>
                            <FormikControls
                              control={"select"}
                              name={"statustext"}
                              options={dropdownOptionsFilterForm}
                              label={"Enter statustext"}
                              showLabel={false}
                              className={`w-full py-1 px-2 rounded-sm`}
                            />
                          </div>
                        </div>
                        <div className={`flex flex-col w-full text-black mb-2`}>
                          <div className={`basis-auto text-start`}>
                            <label
                              htmlFor="searchtext"
                              className={`text-white`}
                            >
                              From
                            </label>
                            <FormikControls
                              control={"date"}
                              name={"fromdate"}
                              label={"Enter fromdate"}
                              showLabel={false}
                              className={`w-full py-1 px-2 rounded-sm`}
                            />
                          </div>
                        </div>
                        <div className={`flex flex-col w-full text-black mb-2`}>
                          <div className={`basis-auto text-start`}>
                            <label
                              htmlFor="searchtext"
                              className={`text-white`}
                            >
                              To
                            </label>
                            <FormikControls
                              control={"date"}
                              name={"todate"}
                              label={"Enter todate"}
                              showLabel={false}
                              className={`w-full py-1 px-2 rounded-sm`}
                            />
                          </div>
                        </div>
                        <div
                          className={`flex flex-row w-full justify-end text-black mb-2`}
                        >
                          <button
                            className={`basis-auto bg-white text-violet-700 py-1 px-2 mx-1 rounded-sm`}
                            type={`submit`}
                          >
                            Filter
                          </button>
                          <button
                            className={`basis-auto bg-white text-violet-700 py-1 px-2 ml-1 rounded-sm`}
                            type={`reset`}
                            onClick={() => {
                              setTaskFilterFormValues(
                                taskFilterFormInitialValues
                              );
                              if (taskFilterFormInitialValues !== null) {
                                getTasksListDB(taskFilterFormInitialValues)
                                  .then((data: any) => {
                                    setTasksList(data);
                                    setShowTaskFilterPopup(false);
                                  })
                                  .catch((error) => {
                                    throw error;
                                  });
                              }
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </Tooltip>
          </div>
        </div>
      </div>

      <motion.div
        className={`text-sm font-normal mt-2`}
        animate={tasksListView === TasksViewEnum.GRID ? "open" : "closed"}
        variants={descriptionVariants}
      >
        {tasksListView === TasksViewEnum.GRID && (
          <div
            className={`flex h-fit sm:flex-row flex-col mt-2 ${
              sideNavContext?.sideNav.isOpen ? "sm:ml-72" : "sm:ml-20"
            }`}
          >
            <div
              className={`basis-1/2 ${
                sideNavContext?.sideNav.isOpen
                  ? "mx-auto sm:mx-10"
                  : "mx-auto sm:mx-20 md:mx-24 lg:mx-40"
              } sm:basis-full flex flex-row justify-start align-middle items-start`}
            >
              <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3 lg:gap-4 mx-2">
                {tasksList &&
                  Array.from(tasksList!.entries()).map(([key, value]: any) => (
                    <div className={`mb-3`} key={value.id}>
                      <Task task={value} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className={`text-sm font-normal mt-2`}
        animate={tasksListView === TasksViewEnum.LIST ? "open" : "closed"}
        variants={descriptionVariants}
      >
        {tasksListView === TasksViewEnum.LIST && (
          <div
            className={`flex sm:flex-row flex-col mt-2 ${
              sideNavContext?.sideNav.isOpen ? "sm:ml-72" : "sm:ml-20"
            }`}
          >
            <div
              className={`basis-full ${
                sideNavContext?.sideNav.isOpen
                  ? "mx-auto sm:mx-10"
                  : "mx-auto sm:mx-20 md:mx-24 lg:mx-40"
              }`}
            >
              <div className="mx-2 h-auto">
                {tasksList &&
                  Array.from(tasksList!.entries()).map(([key, value]: any) => (
                    <div className={`mb-3`} key={value.id}>
                      <Task task={value} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default TasksList;
