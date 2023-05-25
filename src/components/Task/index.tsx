import { useState } from "react";
import { TaskInterface } from "../../models/Task";
import { FaCaretDown, FaCaretUp, FaEdit, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTask } from "../../context/AddEditTask";

const Task = (props: any) => {
  const taskData: TaskInterface = props.task;
  const [showActions, setShowActions] = useState<Boolean>(false);
  const [showDescription, setShowDescription] = useState<Boolean>(false);

  const taskProvider = useTask();

  const descriptionVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  const actionVariants = {
    open: { opacity: 1, height: "1rem" },
    closed: { opacity: 0, height: "1rem" },
  };

  return (
    <div
      className={`text-base font-medium w-full border-[1px] border-gray-200 shadow-none hover:shadow-md hover:shadow-slate-300 hover:border-gray-400 rounded-xl break-inside-avoid-column p-4`}
      onMouseEnter={() => {
        setTimeout(() => setShowActions(true), 50);
      }}
      onMouseLeave={() => {
        setTimeout(() => setShowActions(false), 100);
      }}
    >
      <div>
        {taskData.title.length > 100
          ? `${taskData.title.substring(0, 100)}...`
          : taskData.title}
      </div>
      <motion.div
        className={`text-sm font-normal mt-2`}
        animate={showDescription ? "open" : "closed"}
        variants={descriptionVariants}
      >
        {showDescription && (
          <div className={`w-auto break-words`}>{taskData.description}</div>
        )}
      </motion.div>
      <motion.div
        className={`text-sm font-normal`}
        animate={showActions ? "open" : "closed"}
        variants={actionVariants}
      >
        {showActions && (
          <div className={`flex flex-row justify-end`}>
            {!showDescription && (
              <button onClick={() => setShowDescription(true)}>
                <FaCaretDown className={`text-lg`} />
              </button>
            )}
            {showDescription && (
              <button onClick={() => setShowDescription(false)}>
                <FaCaretUp className={`text-lg`} />
              </button>
            )}
            <button onClick={() => taskProvider?.setEditTask(taskData)}>
              <FaPen className={`text-lg`} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Task;
