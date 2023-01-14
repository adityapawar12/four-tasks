import { useState } from "react";

import { useTaskType } from "../../context/TaskType";

import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";

import styles from "./index.module.css";

Modal.setAppElement("#root");
const AddTask = () => {
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState<boolean>(false);
  const [isAddTaskInputFieldOpen, setIsAddTaskInputFieldOpen] =
    useState<boolean>(false);
  const taskTypeContext = useTaskType();

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
      width: `35rem`,
      marginRight: `-50%`,
      padding: `0px 10px`,
      boxShadow: `0 1px 2px 0 rgba(60,64,67,0.302),0 2px 6px 2px rgba(60,64,67,0.149)`,
      border: `0`,
      borderRadius: `1.5rem`,
      transform: `translate(-50%, -50%)`,
    },
  };

  const openAddTaskPopup = () => {
    setIsAddTaskPopupOpen((prevAddTaskPopup) => {
      return !prevAddTaskPopup;
    });
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
        style={customStylesInput}
      >
        <div className={`flex flex-col p-3`}>
          <input
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
          ></textarea>
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
