import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const updateChartData = (period, setChart, data, classes) => {
  let labels = [];
  let datasets = [];

  const currentYear = moment().year();
  const currentMonth = moment().month();
  const currentDate = moment().date();
  const kelasUnik = classes;

  // Define labels based on the selected period
  switch (period) {
    case "Day":
      labels = [...kelasUnik];
      break;
    case "Month":
      labels = Array.from(
        { length: moment().daysInMonth() },
        (_, i) => `Day ${i + 1}`
      );
      break;
    case "Year":
      labels = Array.from({ length: 12 }, (_, i) =>
        moment().month(i).format("MMM")
      );
      break;
    default:
      labels = [];
  }

  const filteredData = data.filter(
    (item) => moment(item.tanggal, "DD-MM-YYYY").year() === currentYear
  );

  const aggregateData = (period) => {
    if (period === "Year") {
      return labels.map((_, monthIndex) => {
        return filteredData
          .filter(
            (item) => moment(item.tanggal, "DD-MM-YYYY").month() === monthIndex
          )
          .reduce(
            (sum, item) =>
              sum + item.data.reduce((monthSum, d) => monthSum + d.data, 0),
            0
          );
      });
    } else if (period === "Month") {
      const monthData = filteredData.filter(
        (item) => moment(item.tanggal, "DD-MM-YYYY").month() === currentMonth
      );

      return labels.map((_, dayIndex) => {
        return monthData
          .filter(
            (item) => moment(item.tanggal, "DD-MM-YYYY").date() === dayIndex + 1
          )
          .reduce(
            (sum, item) =>
              sum + item.data.reduce((daySum, d) => daySum + d.data, 0),
            0
          );
      });
    } else if (period === "Day") {
      const todayData = filteredData.filter(
        (item) =>
          moment(item.tanggal, "DD-MM-YYYY").date() === currentDate &&
          moment(item.tanggal, "DD-MM-YYYY").month() === currentMonth
      );

      // Inisialisasi array untuk menampung data ontime dan late untuk setiap kelas
      const dataPerKelas = kelasUnik.map(() => ({ ontime: 0, late: 0 }));

      todayData.forEach((item) => {
        item.data.forEach((d) => {
          const kelasIndex = kelasUnik.indexOf(d.name);
          if (kelasIndex !== -1) {
            dataPerKelas[kelasIndex].ontime += d.ontime; // Tambahkan data ontime
            dataPerKelas[kelasIndex].late += d.late; // Tambahkan data late
          }
        });
      });

      return dataPerKelas;
    } else {
      return [];
    }
  };

  const aggregatedData = aggregateData(period);

  if (period === "Year" || period === "Month") {
    const backgroundColors = labels.map(
      () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.5)`
    );

    datasets.push({
      label: "Total",
      data: aggregatedData,
      backgroundColor: backgroundColors,
    });
  } else {
    const ontimeData = aggregatedData.map((item) => item.ontime);
    const lateData = aggregatedData.map((item) => item.late);

    // Buat datasets untuk ontime
    datasets.push({
      label: "On time",
      data: ontimeData,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.5)`, // Warna untuk ontime
    });

    // Buat datasets untuk late
    datasets.push({
      label: "Late",
      data: lateData,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.5)`, // Warna untuk late
    });
  }

  setChart({
    labels,
    datasets,
  });
};
