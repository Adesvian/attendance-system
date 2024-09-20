import axios from "axios";
import moment from "moment";
// 1725850237
// 1725849937
// 1725854437
export const fetchAttendanceChartData = async (
  chartData,
  setAttendancesData
) => {
  const status = chartData ? true : false;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance`
    );
    const attendanceData = chartData ? chartData : response.data.data;

    // Mengelompokkan data berdasarkan tanggal
    const groupedData = attendanceData.reduce((acc, curr) => {
      const date = moment.unix(curr.date).format("DD-MM-YYYY");
      const className = curr.student.class.name;

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push({
        name: className,
        data: status ? 1 : curr.method === 1001 ? 1 : 0,
      });

      return acc;
    }, {});

    // Memformat data ke dalam struktur yang diinginkan
    const formattedDataAttendances = Object.keys(groupedData).map((date) => {
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
    });

    setAttendancesData(formattedDataAttendances);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error;
  }
};
