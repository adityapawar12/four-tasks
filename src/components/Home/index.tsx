import SharedComponents from "../SharedComponents";

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useSideNav } from "../../context/SideNav";
import { supabase } from "../../supabaseClient";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import dayjs from "dayjs";
Chart.register(CategoryScale);

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
  const [graphDates, setGraphDates] = useState<Array<string> | any>(undefined);
  const [graphAllTasksCountByDate, setGraphAllTasksCountByDate] =
    useState<Array<number> | null>(null);
  const [graphPendingTasksCountByDate, setGraphPendingTasksCountByDate] =
    useState<Array<number> | null>(null);
  const [graphCompletedTasksCountByDate, setGraphCompletedTasksCountByDate] =
    useState<Array<number> | null>(null);
  const [graphCancelledTasksCountByDate, setGraphCancelledTasksCountByDate] =
    useState<Array<number> | null>(null);

  const sideNavContext = useSideNav();

  const getAllTasksCountDB = async (): Promise<any> => {
    const allTasksCount = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true });
    const pendingTasksCount = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "PENDING");
    const completedTasksCount = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "COMPLETED");
    const cancelledTasksCount = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "CANCELLED");
    return {
      allTasksCount,
      pendingTasksCount,
      completedTasksCount,
      cancelledTasksCount,
    };
  };

  const getGraphDataDB = async (): Promise<any> => {
    const { data }: any = await supabase.from("tasks").select("inserted_at");

    // for (let index = 0; index < data.length; index++) {
    //   const element = data[index]
    //   const { data2 }: any = await supabase
    //     .from("tasks")
    //     .select("*")
    //     .eq("inserted_at", dayjs(element.inserted_at).format("YYYY-MM-DD"));
    // }
    return data;
  };

  useEffect(() => {
    getAllTasksCountDB().then((res: any) => {
      let countsObj: TaskCountType = {
        allTasksCount: res.allTasksCount.count,
        pendingTasksCount: res.pendingTasksCount.count,
        completedTasksCount: res.completedTasksCount.count,
        cancelledTasksCount: res.cancelledTasksCount.count,
      };
      setAllTopCount(countsObj);
    });
    // getGraphDataDB().then(async (res: any) => {
    //   for (let index = 0; index < res.length; index++) {
    //     const element = res[index];
    //     if (graphDates) {
    //       if (!graphDates.includes(element.inserted_at)) {
    //         await setGraphDates((prevGraphDates: any) => {
    //           return [...prevGraphDates, element.inserted_at];
    //         });
    //       }
    //     } else {
    //       await setGraphDates([element.inserted_at]);
    //     }
    //   }
    // });

    // console.log(graphDates);

    // if (graphDates && graphDates.length > 0) {
    //   for (let index = 0; index < graphDates.length; index++) {
    //     const element = graphDates[index];
    //     const { allTasksCount }: any = supabase
    //       .from("tasks")
    //       .select("*", { count: "exact" })
    //       .gte("inserted_at", dayjs(element).format("YYYY-MM-DD"))
    //       .lte(
    //         "inserted_at",
    //         dayjs(element).add(1, "day").format("YYYY-MM-DD")
    //       );
    //     console.log(allTasksCount.count);
    //     const { pendingTasksCount }: any = supabase
    //       .from("tasks")
    //       .select("*", { count: "exact" })
    //       .eq("status", "PENDING")
    //       .gte("inserted_at", dayjs(element).format("YYYY-MM-DD"))
    //       .lte(
    //         "inserted_at",
    //         dayjs(element).add(1, "day").format("YYYY-MM-DD")
    //       );
    //     console.log(pendingTasksCount.count);
    //     const { completedTasksCount }: any = supabase
    //       .from("tasks")
    //       .select("*", { count: "exact" })
    //       .eq("status", "COMPLETED")
    //       .gte("inserted_at", dayjs(element).format("YYYY-MM-DD"))
    //       .lte(
    //         "inserted_at",
    //         dayjs(element).add(1, "day").format("YYYY-MM-DD")
    //       );
    //     console.log(completedTasksCount.count);
    //     const { cancelledTasksCount }: any = supabase
    //       .from("tasks")
    //       .select("*", { count: "exact" })
    //       .eq("status", "CANCELLED")
    //       .gte("inserted_at", dayjs(element).format("YYYY-MM-DD"))
    //       .lte(
    //         "inserted_at",
    //         dayjs(element).add(1, "day").format("YYYY-MM-DD")
    //       );

    //     console.log(cancelledTasksCount.count);
    //     console.log(allTasksCount);
    //     setGraphAllTasksCountByDate((prevCount: any) => {
    //       return [...prevCount, allTasksCount.count];
    //     });
    //     setGraphPendingTasksCountByDate((prevCount: any) => {
    //       return [...prevCount, pendingTasksCount.count];
    //     });
    //     setGraphCancelledTasksCountByDate((prevCount: any) => {
    //       return [...prevCount, completedTasksCount.count];
    //     });
    //     setGraphCompletedTasksCountByDate((prevCount: any) => {
    //       return [...prevCount, cancelledTasksCount.count];
    //     });
    //   }
    // }
  }, []);

  const data = {
    labels: graphDates,
    datasets: [
      {
        label: "All",
        data: graphAllTasksCountByDate,
      },
      {
        label: "Pending",
        data: graphPendingTasksCountByDate,
      },
      {
        label: "Completed",
        data: graphCompletedTasksCountByDate,
      },
      {
        label: "Cancelled",
        data: graphCancelledTasksCountByDate,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Line Chart",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 6,
        stepSize: 1,
      },
    },
  };

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
          className={`basis-1/2 sm:basis-full flex flex-row justify-center align-middle items-center`}
        >
          <div
            className={`basis-1/2 bg-violet-600 rounded-2xl m-2 text-white p-5 px-0 flex flex-col justify-center align-middle items-center`}
          >
            <div className={`text-md font-semibold`}>No. of</div>
            <div className={`text-md font-semibold`}>All Tasks</div>
            <div className={`text-4xl font-bold `}>
              {allTopCount.allTasksCount}
            </div>
          </div>
          <div
            className={`basis-1/2 bg-violet-600 rounded-2xl m-2 text-white p-5 px-0 flex flex-col justify-center align-middle items-center`}
          >
            <div className={`text-md font-semibold`}>No. of</div>
            <div className={`text-md font-semibold`}>Completed Tasks</div>
            <div className={`text-4xl font-bold `}>
              {allTopCount.completedTasksCount}
            </div>
          </div>
        </div>
        <div
          className={`basis-1/2 sm:basis-full flex flex-row justify-center align-middle items-center`}
        >
          <div
            className={`basis-1/2 bg-violet-600 rounded-2xl m-2 text-white p-5 px-0 flex flex-col justify-center align-middle items-center`}
          >
            <div className={`text-md font-semibold`}>No. of</div>
            <div className={`text-md font-semibold`}>Pending Tasks</div>
            <div className={`text-4xl font-bold `}>
              {allTopCount.pendingTasksCount}
            </div>
          </div>
          <div
            className={`basis-1/2 bg-violet-600 rounded-2xl m-2 text-white p-5 px-0 flex flex-col justify-center align-middle items-center`}
          >
            <div className={`text-md font-semibold`}>No. of</div>
            <div className={`text-md font-semibold`}>Cancelled Tasks</div>
            <div className={`text-4xl font-bold `}>
              {allTopCount.cancelledTasksCount}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex sm:flex-row flex-col h-screen w-auto mt-4 ${
          sideNavContext?.sideNav.isOpen ? "sm:ml-80" : "sm:ml-20"
        }`}
      >
        <div
          className={`basis-1/2 h-full sm:basis-full flex flex-row justify-center align-middle items-center`}
        >
          <Line data={data} />
        </div>
      </div>
    </>
  );
};

export default Home;
