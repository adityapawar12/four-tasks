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
import { FaThList, FaTh } from "react-icons/fa";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import FormikControls from "../formik/ReusableComponents/FormikControls";

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

  const [showTaskFilterPopup, setShowTaskFilterPopup] =
    useState<boolean>(false);
  const [taskFilterFormValues, setTaskFilterFormValues] =
    useState<TasksFilterType | null>(null);
  let taskFilterFormInitialValues: TasksFilterType = {
    fromdate: "",
    todate: "",
    statustext: "",
    searchtext: "",
  };
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
      value: "",
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
    if (statustext === "") {
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
        console.log("THE DATA WE NEED IS HERE ALL HAIL HYDRA >>> ", data);
        setTasksList(data);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

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
          sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
        }`}
      >
        <div
          className={`basis-1/2 mx-40 sm:basis-full flex flex-row justify-self-stretch align-middle items-start`}
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
                <FaThList />
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
                initialValues={taskFilterFormInitialValues}
                onSubmit={(values: TasksFilterType) => {
                  if (taskFilterFormValues !== null) {
                    getTasksListDB(values)
                      .then((data: any) => {
                        console.log(
                          "THE DATA WE NEED IS HERE ALL HAIL HYDRA >>> ",
                          data
                        );
                        setTasksList(data);
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
                    <div>
                      <Form>
                        <div className={`flex flex-col w-full text-black mb-3`}>
                          <div className={`basis-auto text-start`}>
                            <FormikControls
                              control={"input"}
                              name={"searchtext"}
                              type={"text"}
                              label={"Enter Email"}
                              showLabel={false}
                            />
                          </div>
                        </div>
                        <div className={`flex flex-col w-full text-black mb-3`}>
                          <div className={`basis-auto text-start`}>
                            <FormikControls
                              control={"select"}
                              name={"statustext"}
                              options={dropdownOptionsFilterForm}
                              label={"Enter statustext"}
                              showLabel={false}
                            />
                          </div>
                        </div>
                        <div className={`flex flex-col w-full text-black mb-3`}>
                          <div className={`basis-auto text-start`}>
                            <FormikControls
                              control={"date"}
                              name={"fromdate"}
                              label={"Enter fromdate"}
                              showLabel={false}
                            />
                          </div>
                        </div>
                        <div className={`flex flex-col w-full text-black mb-3`}>
                          <div className={`basis-auto text-start`}>
                            <FormikControls
                              control={"date"}
                              name={"todate"}
                              label={"Enter todate"}
                              showLabel={false}
                            />
                          </div>
                        </div>
                        <button type="submit" disabled={!formik.isValid}>
                          Filter
                        </button>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </Tooltip>
          </div>
        </div>
      </div>

      {tasksListView === TasksViewEnum.GRID && (
        <div
          className={`flex sm:flex-row flex-col mt-2 ${
            sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
          }`}
        >
          <div
            className={`basis-1/2 mx-40 sm:basis-full flex flex-row justify-start align-middle items-start`}
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
      {tasksListView === TasksViewEnum.LIST && (
        <div
          className={`flex sm:flex-row flex-col mt-2 ${
            sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
          }`}
        >
          <div className={`basis-full mx-40`}>
            <div className="mx-2">
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
    </>
  );
};

export default TasksList;
