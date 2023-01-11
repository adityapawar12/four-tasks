import { useState } from "react";
import styles from "./index.module.css";

import Modal from "react-modal";

import { useTaskType } from "../../context/TaskType";

import { FaPlus } from "react-icons/fa";

Modal.setAppElement("#root");
const AddTask = () => {
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState<boolean>(false);
  const taskTypeContext = useTaskType();

  const customStyles = {
    overlay: {
      background: "rgba(0, 0, 0, 0)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      padding: "10px",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      border: "0",
      borderRadius: "1.5rem",
      transform: "translate(-50%, -50%)",
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
        <h4 className=" text-lg font-semibold text-center py-1">
          Select Task Type
        </h4>

        <div className=" w-72 h-32 xs:w-80 xs:h-36 sm:w-96 sm:h-40 block box-content">
          <div
            onClick={() => {
              taskTypeContext?.setImpUrg();
              setIsAddTaskPopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
            }}
            className="w-1/2 h-full inline-block bg-violet-800 rounded-tl-3xl  text-white p-2 border-4 border-white"
          >
            <div className="flex flex-col justify-center items-center align-middle content-center h-full">
              <div className="basis-full flex text-md font-bold items-end">
                Important
              </div>
              <div className="basis-full flex text-md font-bold items-start">
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
            }}
            className="w-1/2 h-full inline-block bg-violet-600 rounded-tr-3xl  text-white p-2 border-4 border-white"
          >
            <div className="flex flex-col justify-center items-center align-middle content-center h-full">
              <div className="basis-full flex text-md font-bold items-end">
                Important
              </div>
              <div className="basis-full flex text-md font-bold items-start">
                Not Urgent
              </div>
            </div>
          </div>
        </div>

        <div className=" w-72 h-32 xs:w-80 xs:h-36 sm:w-96 sm:h-40 block box-content">
          <div
            onClick={() => {
              taskTypeContext?.setNotImpUrg();
              setIsAddTaskPopupOpen((prevAddTaskPopup) => {
                return !prevAddTaskPopup;
              });
            }}
            className="w-1/2 h-full inline-block bg-violet-600 rounded-bl-3xl  text-white p-2 border-4 border-white"
          >
            <div className="flex flex-col justify-center items-center align-middle content-center h-full">
              <div className="basis-full flex text-md font-bold items-end">
                Not Important
              </div>
              <div className="basis-full flex text-md font-bold items-start">
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
            }}
            className="w-1/2 h-full inline-block bg-violet-400  rounded-br-3xl  text-white p-2 border-4 border-white"
          >
            <div className="flex flex-col justify-center items-center align-middle content-center h-full">
              <div className="basis-full flex text-md font-bold items-end">
                Not Important
              </div>
              <div className="basis-full flex text-md font-bold items-start">
                Not Urgent
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <FaPlus
        onClick={openAddTaskPopup}
        className="bg-violet-700 text-white text-6xl p-3 rounded-full absolute bottom-5 right-5"
      />
    </>
  );
};

export default AddTask;
