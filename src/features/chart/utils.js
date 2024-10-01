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

export const updateChartData = (period, setChart, data) => {
  let labels = [];
  let datasets = [];

  const currentYear = moment().year();
  const currentMonth = moment().month();
  const currentDate = moment().date();
  const kelasUnik = [
    "Kelas 1",
    "Kelas 2",
    "Kelas 3",
    "Kelas 4",
    "Kelas 5",
    "Kelas 6",
  ];

  // Define labels based on the selected period
  switch (period) {
    case "Day":
      labels = ["Today"];
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
      return kelasUnik.map((kelas) => {
        const todayData = filteredData.filter(
          (item) =>
            moment(item.tanggal, "DD-MM-YYYY").date() === currentDate &&
            moment(item.tanggal, "DD-MM-YYYY").month() === currentMonth
        );

        return todayData.reduce((sum, item) => {
          const dataItem = item.data.find((d) => d.name === kelas);
          return sum + (dataItem ? dataItem.data : 0);
        }, 0);
      });
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
    datasets = kelasUnik.map((kelas, index) => {
      const dataKelas = aggregatedData[index];

      return {
        label: kelas,
        data: [dataKelas],
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      };
    });
  }

  setChart({
    labels,
    datasets,
  });
};
