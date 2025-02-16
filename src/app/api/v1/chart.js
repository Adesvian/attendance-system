import moment from "moment";
import axiosInstance from "../auth/axiosConfig";
import { formControlClasses } from "@mui/material";

export const fetchAttendanceChartData = async (
  chartData,
  setAttendancesData,
  setClasses
) => {
  const status = !!chartData;
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance`
    );
    const attendanceData = chartData ? chartData : response.data.data;

    const classesResult = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/classes`
    );
    const classData = classesResult.data.data;
    const classes = classData.map((classData) => classData.name);
    setClasses(classes);

    // Grouping data by date (day and year)
    const groupedData = attendanceData.reduce((acc, curr) => {
      const date = moment.unix(curr.date).format("YYYY-MM-DD");
      const className = curr.student.class.name;

      if (!acc[date]) {
        acc[date] = {};
      }

      if (!acc[date][className]) {
        acc[date][className] = {
          data: 0,
          ontime: 0,
          late: 0,
        };
      }

      if (curr.method === 1001) {
        acc[date][className].data += 1;
        acc[date][className].ontime += curr.status === 200 ? 1 : 0;
        acc[date][className].late += curr.status === 201 ? 1 : 0;
      }
      return acc;
    }, {});

    const formattedDataAttendances = Object.keys(groupedData).map((date) => {
      const formattedClasses = Object.keys(groupedData[date]).map(
        (className) => {
          const { data, ontime, late } = groupedData[date][className];
          return {
            name: className,
            data,
            ontime,
            late,
          };
        }
      );

      formattedClasses.sort((a, b) => {
        const classOrder = classes.map((c) => c.name);
        return classOrder.indexOf(a.name) - classOrder.indexOf(b.name);
      });

      return {
        tanggal: moment(date).format("DD-MM-YYYY"),
        data: formattedClasses,
      };
    });

    setAttendancesData(formattedDataAttendances);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error;
  }
};
