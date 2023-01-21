import { ChangeEvent, useState, useEffect, useRef } from "react";

import { useTaskType } from "../../context/TaskType";
import TextError from "../TextError";
import { supabase } from "../../supabaseClient";

import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import { Formik, Form, Field, FormikFormProps } from "formik";
import * as Yup from "yup";

import styles from "./index.module.css";
import { useTask } from "../../context/AddEditTask";

export type TaskInterface = {
  id?: number;
  title: string;
  description: string;
  user_id: number;
  seq_no?: number;
  is_archived?: boolean;
  is_pinned?: boolean;
  pinned_id?: number;
  label_ids?: any;
  is_important: boolean;
  is_urgent: boolean;
  status: TaskStatusInterface;
  inserted_at?: Date;
  updated_at?: Date;
};

enum TaskStatusInterface {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

Modal.setAppElement("#root");
const AddEditTask = () => {
  const [isAddTaskTypePopupOpen, setIsAddTaskTypePopupOpen] =
    useState<boolean>(false);
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState<boolean>(false);
  const [addTaskFormValues, setAddTaskFormValues] =
    useState<TaskInterface | null>(null);

  const [isEditTaskTypePopupOpen, setIsEditTaskTypePopupOpen] =
    useState<boolean>(false);
  const [isEditTaskFormOpen, setIsEditTaskFormOpen] = useState<boolean>(false);
  const [editTaskFormValues, setEditTaskFormValues] =
    useState<TaskInterface | null>(null);

  const [descriptionHeight, setDescriptionHeight] = useState<string | number>(
    "auto"
  );
  const [descriptionOverflow, setDescriptionOverflow] =
    useState<string>("hidden");

  const taskTypeContext = useTaskType();
  const taskContext = useTask();
  const formikRef = useRef();

  let addTaskInitialValues: TaskInterface = {
    title: ``,
    description: ``,
    user_id: 0,
    is_important: false,
    is_urgent: false,
    status: TaskStatusInterface.PENDING,
  };

  const addTaskValidationSchema = Yup.object({
    title: Yup.string(),
    description: Yup.string(),
  });

  let editTaskInitialValues: TaskInterface = {
    id: 0,
    title: ``,
    description: ``,
    user_id: 0,
    is_important: false,
    is_urgent: false,
    status: TaskStatusInterface.PENDING,
  };

  const editTaskValidationSchema = Yup.object({
    title: Yup.string(),
    description: Yup.string(),
  });

  const addTaskDB = async (task: TaskInterface | null) => {
    if (!task) {
      return;
    }

    if (!task.user_id) {
      task.user_id = await JSON.parse(
        localStorage.getItem("userLoginInfo") || ""
      ).id;
    }
    const { data, error } = await supabase.from("tasks").insert([
      {
        title: task?.title || "",
        description: task?.description || "",
        user_id: task?.user_id,
        is_urgent: taskTypeContext?.taskType?.urgent,
        is_important: taskTypeContext?.taskType?.important,
        status: task?.status,
      },
    ]);

    taskContext?.toggleIsTaskAdded();
  };

  const editTaskDB = async (task: TaskInterface | null) => {
    const { data, error } = await supabase
      .from("tasks")
      .update([
        {
          title: task?.title || "",
          description: task?.description || "",
          user_id: task?.user_id,
          is_urgent: taskTypeContext?.taskType?.urgent,
          is_important: taskTypeContext?.taskType?.important,
        },
      ])
      .eq("id", editTaskFormValues?.id);

    taskContext?.setEditTask(null);
    taskContext?.toggleIsEditingTask();
  };

  const customStyles = {
    overlay: {
      background: `rgba(0, 0, 0, 0)`,
    },
    content: {
      top: `50%`,
      left: `50%`,
      right: `auto`,
      bottom: `auto`,
      marginRight: `-50%`,
      padding: `10px`,
      boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
      border: `0`,
      borderRadius: `1.5rem`,
      transform: `translate(-50%, -50%)`,
    },
  };

  const customStylesInput = {
    overlay: {
      background: `rgba(255, 255, 255, 0.2)`,
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

  const openAddTaskPopup = () => {
    setIsAddTaskTypePopupOpen((prevAddTaskPopup) => {
      return !prevAddTaskPopup;
    });
  };

  useEffect(() => {
    if (descriptionHeight > window.innerHeight * 0.75) {
      setDescriptionOverflow("auto");
    } else {
      setDescriptionOverflow("hidden");
    }
  }, [descriptionHeight]);

  useEffect(() => {
    if (taskContext?.task) {
      setIsEditTaskFormOpen(true);
      setEditTaskFormValues(taskContext.task);
    } else {
      setIsEditTaskFormOpen(false);
    }
  }, [taskContext]);
  const onDescriptionChange = (event: ChangeEvent) => {
    setDescriptionHeight(event.target.scrollHeight);
  };

  return (
    <>
      <Modal
        isOpen={isAddTaskTypePopupOpen}
        onRequestClose={() => {
          setIsAddTaskTypePopupOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        style={customStyles}
      >
        <div
          className={`w-72 h-32 xs:w-80 xs:h-36 sm:w-96 sm:h-40 block box-content`}
        >
          <div
            onClick={() => {
              taskTypeContext?.setImpUrg();
              setIsAddTaskTypePopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
              setIsAddTaskFormOpen(true);
            }}
            className={`w-1/2 h-full inline-block bg-violet-800 rounded-tl-2xl  text-white p-2 border-4 border-white`}
          >
            <div
              className={`flex flex-col justify-center items-center align-middle content-center h-full`}
            >
              <div className={`basis-full flex text-md font-bold items-end`}>
                Important
              </div>
              <div className={`basis-full flex text-md font-bold items-start`}>
                Urgent
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              taskTypeContext?.setImpNotUrg();
              setIsAddTaskTypePopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
              setIsAddTaskFormOpen(true);
            }}
            className={`w-1/2 h-full inline-block bg-violet-600 rounded-tr-2xl  text-white p-2 border-4 border-white`}
          >
            <div
              className={`flex flex-col justify-center items-center align-middle content-center h-full`}
            >
              <div className={`basis-full flex text-md font-bold items-end`}>
                Important
              </div>
              <div className={`basis-full flex text-md font-bold items-start`}>
                Not Urgent
              </div>
            </div>
          </div>
        </div>

        <div
          className={`w-72 h-32 xs:w-80 xs:h-36 sm:w-96 sm:h-40 block box-content`}
        >
          <div
            onClick={() => {
              taskTypeContext?.setNotImpUrg();
              setIsAddTaskTypePopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
              setIsAddTaskFormOpen(true);
            }}
            className={`w-1/2 h-full inline-block bg-violet-600 rounded-bl-2xl  text-white p-2 border-4 border-white`}
          >
            <div
              className={`flex flex-col justify-center items-center align-middle content-center h-full`}
            >
              <div className={`basis-full flex text-md font-bold items-end`}>
                Not Important
              </div>
              <div className={`basis-full flex text-md font-bold items-start`}>
                Urgent
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              taskTypeContext?.setNotImpNotUrg();
              setIsAddTaskTypePopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
              setIsAddTaskFormOpen(true);
            }}
            className={`w-1/2 h-full inline-block bg-violet-400  rounded-br-2xl  text-white p-2 border-4 border-white`}
          >
            <div
              className={`flex flex-col justify-center items-center align-middle content-center h-full`}
            >
              <div className={`basis-full flex text-md font-bold items-end`}>
                Not Important
              </div>
              <div className={`basis-full flex text-md font-bold items-start`}>
                Not Urgent
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAddTaskFormOpen}
        onRequestClose={() => {
          setIsAddTaskFormOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        onAfterClose={() => {
          addTaskDB(addTaskFormValues);
        }}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-4`}>
          <div className={`basis-auto w-auto`}>
            <div>
              <Formik
                initialValues={addTaskInitialValues}
                onSubmit={() => alert("submit")}
                onChange={(values: TaskInterface) => {
                  setAddTaskFormValues(values);
                }}
                validationSchema={addTaskValidationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div>
                      <Form>
                        <div className={`flex flex-col w-full`}>
                          <div className={`basis-auto text-start`}>
                            <Field
                              id={`title`}
                              name={`title`}
                              type={`text`}
                              className={`w-full py-1 outline-none m-0 text-2xl`}
                              placeholder={`Add Title`}
                              onKeyUp={() =>
                                setAddTaskFormValues(formik.values)
                              }
                            />
                          </div>
                        </div>

                        <div className={`flex flex-col w-full`}>
                          <div className={`basis-auto text-start`}>
                            <Field
                              type={`text`}
                              id={`description`}
                              name={`description`}
                              className={`w-full py-1 outline-none m-0 text-md resize-none max-h-60 overflow-hidden text-lg`}
                              style={{
                                height: descriptionHeight,
                                overflow: descriptionOverflow,
                              }}
                              placeholder={`Add Description`}
                              onKeyUp={(event: ChangeEvent) => {
                                setAddTaskFormValues(formik.values);
                                onDescriptionChange(event);
                              }}
                              as={`textarea`}
                              cols={20}
                              rows={5}
                            />
                          </div>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditTaskFormOpen}
        onRequestClose={() => {
          setIsEditTaskFormOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        onAfterClose={() => {
          editTaskDB(editTaskFormValues);
        }}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-4`}>
          <div className={`basis-auto w-auto`}>
            <div>
              <Formik
                initialValues={editTaskFormValues || editTaskInitialValues}
                onSubmit={() => alert("submit")}
                onChange={(values: TaskInterface) => {
                  setEditTaskFormValues(values);
                }}
                validationSchema={editTaskValidationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div>
                      <Form>
                        <div className={`flex flex-col w-full`}>
                          <div className={`basis-auto text-start`}>
                            <Field
                              id={`title`}
                              name={`title`}
                              type={`text`}
                              className={`w-full py-1 outline-none m-0 text-2xl`}
                              placeholder={`Add Title`}
                              onKeyUp={() =>
                                setEditTaskFormValues(formik.values)
                              }
                            />
                          </div>
                        </div>

                        <div className={`flex flex-col w-full`}>
                          <div className={`basis-auto text-start`}>
                            <Field
                              type={`text`}
                              id={`description`}
                              name={`description`}
                              className={`w-full py-1 outline-none m-0 text-md resize-none max-h-60 overflow-hidden text-lg`}
                              style={{
                                height: descriptionHeight,
                                overflow: descriptionOverflow,
                              }}
                              placeholder={`Add Description`}
                              onKeyUp={(event: ChangeEvent) => {
                                setEditTaskFormValues(formik.values);
                                onDescriptionChange(event);
                              }}
                              as={`textarea`}
                              cols={20}
                              rows={5}
                            />
                          </div>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </Modal>

      {!isAddTaskFormOpen &&
      !isAddTaskTypePopupOpen &&
      !isEditTaskFormOpen &&
      !isEditTaskTypePopupOpen ? (
        <FaPlus
          onClick={openAddTaskPopup}
          className={`bg-white hover:bg-violet-700 z-50  text-violet-700 hover:text-white shadow-2xl shadow-slate-700 text-6xl p-3 rounded-2xl fixed bottom-0 mb-4 right-4`}
        />
      ) : null}
    </>
  );
};

export default AddEditTask;
