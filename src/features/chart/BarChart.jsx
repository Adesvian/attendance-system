import React, { useEffect, useState } from "react";
import PeriodButtons from "./TimePeriod";
import { updateChartData } from "./utils";
import { BarChartTheme } from "./BarChartTheme";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { fetchAttendanceChartData } from "../../app/api/v1/chart";
import moment from "moment";

function BarChart({ chartData }) {
  const theme = useSelector((state) => state.header.theme);
  const options = BarChartTheme(theme);
  const [activeButton, setActiveButton] = useState("Day");
  const [chart, setChart] = useState({ labels: [], datasets: [] });
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchAttendanceChartData(chartData, setData, setClasses);
  }, [chartData]);

  useEffect(() => {
    updateChartData(activeButton, setChart, data, classes);
  }, [activeButton, data]);

  return (
    <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 p-4 col-span-2 border dark:border-[#2B3039] dark:border-[2px]">
      <div className="md:flex md:justify-between ">
        <div className="text-center text-xl md:text-2xl font-bold text-base-200 dark:text-dark-text lg:my-4">
          Total Attendance{" "}
          {activeButton === "Day"
            ? "Today"
            : activeButton === "Month"
            ? `for ${moment().format("MMMM")}`
            : activeButton === "Year"
            ? `for ${moment().year()}`
            : ""}
        </div>
        <PeriodButtons
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </div>
      <div className="h-[25rem] w-full max-w-full">
        <Bar options={options} data={chart} />
      </div>
    </div>
  );
}

export default BarChart;
