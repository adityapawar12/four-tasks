import SharedComponents from "../SharedComponents";

import { useEffect, useState } from "react";
import { useSideNav } from "../../context/SideNav";
import { supabase } from "../../supabaseClient";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { TaskInterface } from "../../models/Task";
Chart.register(CategoryScale);

import Task from "../Task";
import HomeTopCards from "../HomeTopCards";

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
          <HomeTopCards tasksCount={allTopCount.allTasksCount} text={`Tasks`} />
          <HomeTopCards
            tasksCount={allTopCount.completedTasksCount}
            text={`Completed`}
          />
        </div>
        <div
          className={`basis-1/2 sm:basis-full flex flex-row justify-center align-middle items-center`}
        >
          <HomeTopCards
            tasksCount={allTopCount.pendingTasksCount}
            text={`Pending`}
          />
          <HomeTopCards
            tasksCount={allTopCount.cancelledTasksCount}
            text={`Cancelled`}
          />
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
                <div key={value.id}>
                  <Task task={value} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
