import React, { useEffect, useState } from "react";
import PeriodButtons from "./TimePeriod";
import { updateChartData } from "./utils";
import { BarChartTheme } from "./BarChartTheme";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

function BarChart({ chartData }) {
  const [activeButton, setActiveButton] = useState("Day");
  const [data, setData] = useState({ labels: [], datasets: [] });
  const theme = useSelector((state) => state.header.theme);
  const options = BarChartTheme(theme);
  const [attendancesData, setAttendancesData] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance`
        );
        const attendanceData = chartData ? chartData : response.data;

        // Mengelompokkan data berdasarkan tanggal
        const groupedData = attendanceData.reduce((acc, curr) => {
          const date = moment.unix(curr.date).format("DD-MM-YYYY");
          const className = curr.class;

          if (!acc[date]) {
            acc[date] = [];
          }

          acc[date].push({
            name: className,
            data: curr.method === 1001 ? 1 : 0,
          });

          return acc;
        }, {});

        // Memformat data ke dalam struktur yang diinginkan
        const formattedDataAttendances = Object.keys(groupedData).map(
          (date) => {
            const formattedClasses = groupedData[date].reduce((acc, curr) => {
              const classData = acc.find((item) => item.name === curr.name);
              if (classData) {
                classData.data += curr.data;
              } else {
                acc.push(curr);
              }
              return acc;
            }, []);

            // Mengurutkan data berdasarkan kelas
            formattedClasses.sort((a, b) => {
              const classOrder = [
                "Kelas 1",
                "Kelas 2",
                "Kelas 3",
                "Kelas 4",
                "Kelas 5",
                "Kelas 6",
              ];
              return classOrder.indexOf(a.name) - classOrder.indexOf(b.name);
            });

            return { tanggal: date, data: formattedClasses };
          }
        );

        setAttendancesData(formattedDataAttendances);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [chartData]);

  useEffect(() => {
    updateChartData(activeButton, setData, attendancesData);
  }, [activeButton, attendancesData]);

  return (
    <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 p-4 col-span-2">
      <div className="md:flex md:justify-between">
        <div className="text-2xl font-bold text-base-200 dark:text-dark-text lg:my-4">
          Total Attendance {activeButton}
        </div>
        <PeriodButtons
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </div>
      <div className="h-[25rem] w-full max-w-full">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default BarChart;
