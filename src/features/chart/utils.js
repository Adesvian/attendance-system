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

const dataSiswa = [
  {
    tanggal: "01-08-2022",
    data: [
      { name: "Kelas 1", data: 1000 },
      { name: "Kelas 2", data: 2000 },
      { name: "Kelas 3", data: 3000 },
      { name: "Kelas 4", data: 4000 },
      { name: "Kelas 5", data: 5000 },
      { name: "Kelas 6", data: 6000 },
    ],
  },
  {
    tanggal: "01-08-2024",
    data: [
      { name: "Kelas 1", data: 10 },
      { name: "Kelas 2", data: 20 },
      { name: "Kelas 3", data: 30 },
      { name: "Kelas 4", data: 40 },
      { name: "Kelas 5", data: 50 },
      { name: "Kelas 6", data: 60 },
    ],
  },
  {
    tanggal: "03-08-2024",
    data: [
      { name: "Kelas 1", data: 100 },
      { name: "Kelas 2", data: 200 },
      { name: "Kelas 3", data: 300 },
      { name: "Kelas 4", data: 400 },
      { name: "Kelas 5", data: 500 },
      { name: "Kelas 6", data: 600 },
    ],
  },
  // Tambahkan objek tanggal dan data lainnya di sini
];

export const updateChartData = (period, setData) => {
  let labels = [];
  let datasets = [];

  const currentYear = moment().year();
  const currentMonth = moment().month();
  const currentDate = moment().date();
  const kelasUnik = [
    ...new Set(dataSiswa.flatMap((item) => item.data.map((d) => d.name))),
  ];

  switch (period) {
    case "Day":
      labels = Array.from({ length: 1 }, (_, i) => "Today");
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

  const filteredData = dataSiswa.filter(
    (item) => moment(item.tanggal, "DD-MM-YYYY").year() === currentYear
  );

  const aggregateData = (period) => {
    if (period === "Year") {
      return labels.map((_, monthIndex) => {
        return filteredData
          .filter(
            (item) => moment(item.tanggal, "DD-MM-YYYY").month() === monthIndex
          )
          .reduce((sum, item) => {
            return (
              sum + item.data.reduce((monthSum, d) => monthSum + d.data, 0)
            );
          }, 0);
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
          .reduce((sum, item) => {
            return sum + item.data.reduce((daySum, d) => daySum + d.data, 0);
          }, 0);
      });
    } else if (period === "Day") {
      return labels.map(() => {
        return kelasUnik.map((kelas) => {
          return filteredData
            .filter(
              (item) =>
                moment(item.tanggal, "DD-MM-YYYY").date() === currentDate
            )
            .reduce((sum, item) => {
              const dataItem = item.data.find((d) => d.name === kelas);
              return sum + (dataItem ? dataItem.data : 0);
            }, 0);
        });
      });
    } else {
      return [];
    }
  };

  const aggregatedData = aggregateData(period);

  if (period === "Year") {
    datasets.push({
      label: "Total",
      data: aggregatedData,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
    });
  } else if (period === "Month") {
    const colors = labels.map(
      () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.5)`
    );

    datasets.push({
      label: "Total",
      data: aggregatedData,
      backgroundColor: colors,
    });
  } else {
    kelasUnik.forEach((kelas, index) => {
      const dataKelas = aggregatedData.map((timeData) => timeData[index]);

      datasets.push({
        label: kelas,
        data: dataKelas,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      });
    });
  }

  setData({
    labels,
    datasets,
  });
};

export const BarChartTheme = (theme) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: `${theme === "dark" ? "white" : "black"}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: `${theme === "dark" ? "white" : "black"}`,
          // autoSkip: false,
        },
        grid: {
          color: `${
            theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
          }`,
        },
      },
      y: {
        ticks: {
          color: `${theme === "dark" ? "white" : "black"}`,
        },
        grid: {
          color: `${
            theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
          }`,
        },
      },
    },
  };
};
