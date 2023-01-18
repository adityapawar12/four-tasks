import { useState } from "react";

import { useTaskType } from "../../context/TaskType";
import TextError from "../TextError";
import { supabase } from "../../supabaseClient";

import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import styles from "./index.module.css";

export type TaskInterface = {
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
const AddTask = () => {
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState<boolean>(false);
  const [isAddTaskInputFieldOpen, setIsAddTaskInputFieldOpen] =
    useState<boolean>(false);
  const [taskFormValues, setTaskFormValues] = useState<TaskInterface | null>(
    null
  );

  const taskTypeContext = useTaskType();

  let initialValues: TaskInterface = {
    title: ``,
    description: ``,
    user_id: 0,
    is_important: false,
    is_urgent: false,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required(`Title is required!`),
    description: Yup.string(),
  });

  const addTaskDB = async (task: TaskInterface | null) => {
    console.log(task);
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
        title: task?.title,
        description: task?.description,
        user_id: task?.user_id,
        is_urgent: taskTypeContext?.taskType?.urgent,
        is_important: taskTypeContext?.taskType?.important,
      },
    ]);
  };

  const onSubmit = async (values: TaskInterface, onSubmitProps: any) => {
    console.log(values);
    values.user_id = await JSON.parse(
      localStorage.getItem("userLoginInfo") || ""
    ).id;
    addTaskDB(values);
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
    setIsAddTaskPopupOpen((prevAddTaskPopup) => {
      return !prevAddTaskPopup;
    });
  };

  const updateTaskFormValues = (values: TaskInterface) => {
    console.log(values);
    setTaskFormValues(values);
  };

  return (
    <>
      <Modal
        isOpen={isAddTaskPopupOpen}
        onRequestClose={() => {
          setIsAddTaskPopupOpen(false);
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
              setIsAddTaskPopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
              setIsAddTaskInputFieldOpen(true);
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
              setIsAddTaskPopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
              setIsAddTaskInputFieldOpen(true);
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
              setIsAddTaskPopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
              setIsAddTaskInputFieldOpen(true);
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
              setIsAddTaskPopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
              setIsAddTaskInputFieldOpen(true);
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
        isOpen={isAddTaskInputFieldOpen}
        onRequestClose={() => {
          setIsAddTaskInputFieldOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        onAfterClose={() => {
          console.log(taskFormValues);
          addTaskDB(taskFormValues);
        }}
        style={customStylesInput}
      >
        <div className={`flex flex-col p-1`}>
          {/* <input
            type={`text`}
            className={`p-1 basis-full outline-none my-1 text-lg`}
            placeholder={`Add Title`}
          />
          <textarea
            name={`description`}
            className={`p-1 basis-full outline-none resize-none my-1 text-md`}
            placeholder={`Add Description`}
            cols={20}
            rows={3}
          ></textarea> */}

          <div className={`basis-auto w-auto`}>
            <div>
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                onChange={(values: any) => {
                  console.log(values);
                  // updateTaskFormValues(values);
                }}
                validationSchema={validationSchema}
                enableReinitialize
              >
                {(formik) => {
                  return (
                    <div>
                      <Form>
                        <div className={`flex flex-col mb-3 w-full`}>
                          {/* <div className={`basis-auto text-start px-2`}>
                            <label htmlFor={`email`}>Email</label>
                          </div> */}
                          <div className={`basis-auto text-start px-2`}>
                            <Field
                              id={`title`}
                              name={`title`}
                              type={`text`}
                              className={`p-1 w-full outline-none my-1 text-lg`}
                              placeholder={`Add Title`}
                            />
                          </div>
                          <div className={`basis-auto text-start`}>
                            <ErrorMessage
                              name={`title`}
                              component={TextError}
                            />
                          </div>
                        </div>

                        <div className={`flex flex-col mb-3`}>
                          {/* <div className={`basis-auto text-start px-2`}>
                            <label htmlFor={`password`}>Password</label>
                          </div> */}
                          <div className={`basis-auto text-start px-2`}>
                            <Field
                              type={`text`}
                              id={`description`}
                              name={`description`}
                              className={`p-1 w-full outline-none resize-none my-1 text-md`}
                              placeholder={`Add Description`}
                              as={`textarea`}
                              cols={20}
                              rows={3}
                            />
                          </div>
                          <div className={`basis-auto text-start`}>
                            <ErrorMessage
                              name={`password`}
                              component={TextError}
                            />
                          </div>
                        </div>

                        <div className={`flex flex-row justify-center my-2`}>
                          <button
                            className={`bg-cyan-500 text-white p-2 rounded-sm`}
                            type={`submit`}
                            disabled={
                              !formik.dirty &&
                              !formik.isValid &&
                              formik.isSubmitting
                            }
                          >
                            Submit
                          </button>
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

      <FaPlus
        onClick={openAddTaskPopup}
        className={`bg-violet-700 text-white text-6xl p-3 rounded-2xl absolute bottom-4 right-4`}
      />
    </>
  );
};

export default AddTask;
