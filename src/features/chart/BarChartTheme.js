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
