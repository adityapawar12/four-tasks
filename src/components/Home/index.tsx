import SharedComponents from "../SharedComponents";

import { useEffect, useState } from "react";
import { useSideNav } from "../../context/SideNav";
import { supabase } from "../../supabaseClient";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { TaskInterface } from "../../models/Task";
Chart.register(CategoryScale);

import styles from "./styles.module.css";

type TaskCountType = {
  allTasksCount: number;
  pendingTasksCount: number;
  completedTasksCount: number;
  cancelledTasksCount: number;
};

const Home = () => {
  const [allTopCount, setAllTopCount] = useState<TaskCountType>({
    allTasksCount: 0,
    pendingTasksCount: 0,
    completedTasksCount: 0,
    cancelledTasksCount: 0,
  });
  const [tasksList, setTasksList] = useState<Map<
    string,
    Array<TaskInterface>
  > | null>(null);

  const sideNavContext = useSideNav();

  const getTopCardsCountsDB = async () => {
    try {
      const { data, error } = await supabase.rpc("hp_top_cards_counts");
      if (error) {
        throw error;
      }
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const getRecentPendingTasksDB = async () => {
    try {
      const { data, error } = await supabase.rpc("hp_recent_pending_tasks");
      if (error) {
        throw error;
      }
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    getTopCardsCountsDB()
      .then((data: any) => {
        setAllTopCount({
          allTasksCount: data[0].alltaskscount,
          pendingTasksCount: data[0].pendingtaskscount,
          completedTasksCount: data[0].completedtaskscount,
          cancelledTasksCount: data[0].cancelledtaskscount,
        });
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  useEffect(() => {
    getRecentPendingTasksDB()
      .then((data: any) => {
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
        className={`flex sm:flex-row flex-col mt-24 overflow-auto ${
          sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
        }`}
      >
        <div
          className={`basis-1/2 sm:basis-full flex flex-row justify-center align-middle items-center`}
        >
          <div
            className={`basis-1/2 bg-violet-600 ${styles.topCards} rounded-2xl m-2 text-white py-2 px-6 flex flex-ro justify-start items-start`}
          >
            <div className={`text-2xl font-semibold p-1`}>
              {allTopCount.allTasksCount}
            </div>
            <div className={`text-xs font-semibold mt-1`}>Tasks</div>
          </div>
          <div
            className={`basis-1/2 bg-violet-600 ${styles.topCards} rounded-2xl m-2 text-white py-2 px-6 flex flex-ro justify-start items-start`}
          >
            <div className={`text-2xl font-semibold p-1`}>
              {allTopCount.completedTasksCount}
            </div>
            <div className={`text-xs font-semibold mt-1`}>Completed</div>
          </div>
        </div>
        <div
          className={`basis-1/2 sm:basis-full flex flex-row justify-center align-middle items-center`}
        >
          <div
            className={`basis-1/2 bg-violet-600 ${styles.topCards} rounded-2xl m-2 text-white py-2 px-6 flex flex-ro justify-start items-start`}
          >
            <div className={`text-2xl font-semibold p-1`}>
              {allTopCount.pendingTasksCount}
            </div>
            <div className={`text-xs font-semibold mt-1`}>Pending</div>
          </div>
          <div
            className={`basis-1/2 bg-violet-600 ${styles.topCards} rounded-2xl m-2 text-white py-2 px-6 flex flex-ro justify-start items-start`}
          >
            <div className={`text-2xl font-semibold p-1`}>
              {allTopCount.cancelledTasksCount}
            </div>
            <div className={`text-xs font-semibold mt-1`}>Cancelled</div>
          </div>
        </div>
      </div>

      <div
        className={`flex sm:flex-row flex-col mt-2 ${
          sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
        }`}
      >
        <div
          className={`basis-full flex flex-row justify-start align-middle items-start`}
        >
          <h3 className={`text-lg sm:text-xl font-semibold m-2`}>
            Recent Pending Tasks
          </h3>
        </div>
      </div>
      <div
        className={`flex sm:flex-row flex-col mt-2 ${
          sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
        }`}
      >
        <div
          className={`basis-1/2 sm:basis-full flex flex-row justify-start align-middle items-start`}
        >
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3 lg:gap-4 mx-2">
            {tasksList &&
              Array.from(tasksList!.entries()).map(([key, value]: any) => (
                <div
                  key={key.id}
                  className={`text-base font-medium border-[1px] border-gray-200 shadow-none hover:shadow-md hover:shadow-slate-300 hover:border-gray-400 rounded-xl break-inside-avoid-column p-4`}
                >
                  {value.title.length > 100
                    ? `${value.title.substring(0, 100)}...`
                    : value.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
