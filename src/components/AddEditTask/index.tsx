import { useState } from "react";

import { useTaskType } from "../../context/TaskType";
import TextError from "../TextError";
import { supabase } from "../../supabaseClient";

import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import styles from "./index.module.css";

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
};

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

  const taskTypeContext = useTaskType();

  let addTaskInitialValues: TaskInterface = {
    title: ``,
    description: ``,
    user_id: 0,
    is_important: false,
    is_urgent: false,
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
      },
    ]);
  };

  const editTaskDB = async (task: TaskInterface | null) => {
    // const { data, error } = await supabase
    //   .from("tasks")
    //   .update({ other_column: "otherValue" })
    //   .eq("some_column", "someValue");
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
      padding: `0px 10px`,
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

  const openEditTaskPopup = () => {
    setIsEditTaskFormOpen((prevAddTaskPopup) => {
      return !prevAddTaskPopup;
    });
  };

  const openEditTaskTypePopup = () => {
    setIsEditTaskTypePopupOpen((prevAddTaskPopup) => {
      return !prevAddTaskPopup;
    });
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
        <h4 className={`text-lg font-semibold text-center py-1`}>
          Select Task Type
        </h4>

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
          console.log(addTaskFormValues);
          addTaskDB(addTaskFormValues);
        }}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-1`}>
          <div className={`basis-auto w-auto`}>
            <div>
              <Formik
                initialValues={addTaskInitialValues}
                onSubmit={() => console.log("submit")}
                onChange={(values: any) => {
                  setAddTaskFormValues(values);
                }}
                validationSchema={addTaskValidationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div>
                      <Form>
                        <div className={`flex flex-col mb-3 w-full`}>
                          <div className={`basis-auto text-start px-2`}>
                            <Field
                              id={`title`}
                              name={`title`}
                              type={`text`}
                              className={`p-1 w-full outline-none my-1 text-lg`}
                              placeholder={`Add Title`}
                              onKeyUp={() =>
                                setAddTaskFormValues(formik.values)
                              }
                            />
                          </div>
                        </div>

                        <div className={`flex flex-col mb-3`}>
                          <div className={`basis-auto text-start px-2`}>
                            <Field
                              type={`text`}
                              id={`description`}
                              name={`description`}
                              className={`p-1 w-full outline-none resize-none my-1 text-md`}
                              placeholder={`Add Description`}
                              onKeyUp={() =>
                                setAddTaskFormValues(formik.values)
                              }
                              as={`textarea`}
                              cols={20}
                              rows={3}
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
          console.log(editTaskFormValues);
          editTaskDB(editTaskFormValues);
        }}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-1`}>
          <div className={`basis-auto w-auto`}>
            <div>
              <Formik
                initialValues={editTaskInitialValues}
                onSubmit={() => console.log("submit")}
                onChange={(values: any) => {
                  setEditTaskFormValues(values);
                }}
                validationSchema={editTaskValidationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div>
                      <Form>
                        <div className={`flex flex-col mb-3 w-full`}>
                          <div className={`basis-auto text-start px-2`}>
                            <Field
                              id={`title`}
                              name={`title`}
                              type={`text`}
                              className={`p-1 w-full outline-none my-1 text-lg`}
                              placeholder={`Add Title`}
                              onKeyUp={() =>
                                setEditTaskFormValues(formik.values)
                              }
                            />
                          </div>
                        </div>

                        <div className={`flex flex-col mb-3`}>
                          <div className={`basis-auto text-start px-2`}>
                            <Field
                              type={`text`}
                              id={`description`}
                              name={`description`}
                              className={`p-1 w-full outline-none resize-none my-1 text-md`}
                              placeholder={`Add Description`}
                              onKeyUp={() =>
                                setEditTaskFormValues(formik.values)
                              }
                              as={`textarea`}
                              cols={20}
                              rows={3}
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
          className={`bg-white hover:bg-violet-700 text-violet-700 hover:text-white shadow-2xl shadow-slate-700 text-6xl p-3 rounded-2xl absolute bottom-4 right-4`}
        />
      ) : null}
    </>
  );
};

export default AddEditTask;
