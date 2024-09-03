import React, { useEffect, useState } from "react";
import PeriodButtons from "./TimePeriod";
import { updateChartData, BarChartTheme } from "./utils";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

function BarChart() {
  const [activeButton, setActiveButton] = useState("Day");
  const [data, setData] = useState({ labels: [], datasets: [] });
  const theme = useSelector((state) => state.header.theme);

  const options = BarChartTheme(theme);

  useEffect(() => {
    updateChartData("Day", setData);
  }, []);

  return (
    <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 p-4 col-span-2">
      <div className="md:flex md:justify-between">
        <div className="text-2xl font-bold text-base-200 dark:text-dark-text lg:my-4">
          Total Attendance {activeButton}
        </div>
        <PeriodButtons
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          updateChartData={updateChartData}
          setData={setData}
        />
      </div>
      {/* Kontainer chart dengan width penuh dan max width tidak melebihi pembungkus */}
      <div className="h-[25rem] w-full max-w-full">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default BarChart;
