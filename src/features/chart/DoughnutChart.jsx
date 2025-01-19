import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useSelector } from "react-redux";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend, Title);

function DoughnutChart({ data }) {
  // Mengambil tema dari Redux store
  const theme = useSelector((state) => state.header.theme);

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getChartDimensions = () => {
    if (windowSize.width < 480) return { width: 200, height: 200 };
    if (windowSize.width < 768) return { width: 250, height: 250 };
    return { width: 300, height: 300 };
  };

  const dimensions = getChartDimensions();

  const chartData = {
    labels: ["Absen", "Tersisa"],
    datasets: [
      {
        label: "Progress",
        data: [data.completed, data.remaining],
        backgroundColor: ["#47c46a", theme === "dark" ? "#2d2d2d" : "#f5f5f5"],
        borderWidth: 1,
        borderColor: theme === "dark" ? "#444" : "#ddd",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: window.matchMedia("print").matches ? false : true,
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let total = 0;
            tooltipItem.chart.data.datasets[0].data.forEach((value) => {
              total += value;
            });
            let percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
            return [
              `${tooltipItem.label}: ${percentage}%`,
              `Hari: ${tooltipItem.raw}`,
            ];
          },
        },
        titleColor: theme === "dark" ? "#fff" : "#000",
        bodyColor: theme === "dark" ? "#fff" : "#000",
        borderColor: theme === "dark" ? "#444" : "#ddd",
      },
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: windowSize.width < 768 ? 12 : 40,
          padding: windowSize.width < 768 ? 10 : 20,
          font: {
            size: windowSize.width < 768 ? 12 : 14,
          },
          color: theme === "dark" ? "#fff" : "#000",
        },
      },
      doughnutLabel: {
        id: "doughnutLabel",
        beforeDraw(chart) {
          const { ctx, data } = chart;
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

          const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((data.datasets[0].data[0] / total) * 100).toFixed(
            0
          );

          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Responsive font sizes
          const percentageFontSize = windowSize.width < 768 ? 16 : 24;
          const labelFontSize = windowSize.width < 768 ? 12 : 16;

          // Set text color based on theme
          const textColor = theme === "dark" ? "#fff" : "#000";

          // Draw percentage
          ctx.font = `bold ${percentageFontSize}px Arial`;
          ctx.fillStyle = textColor;
          ctx.fillText(`${percentage}%`, centerX, centerY - 10);

          // Draw label
          ctx.font = `${labelFontSize}px Arial`;
          ctx.fillStyle = textColor;
          ctx.fillText(
            `${data.datasets[0].data[0]}/${total}`,
            centerX,
            centerY + 10
          );

          ctx.restore();
        },
      },
    },
  };

  // Force chart redraw when theme changes
  useEffect(() => {
    const chartCanvas = document
      .querySelector("canvas")
      ?.getContext("2d")?.chart;
    if (chartCanvas) {
      chartCanvas.draw();
    }
  }, [theme]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="p-4 rounded-lg ">
        <h2 className="text-center text-lg font-semibold mb-2 dark:text-white print:dark:text-black">
          Student Details Information
        </h2>
        <div style={{ height: dimensions.height, width: "100%" }}>
          <Doughnut
            key={theme} // Force re-render when theme changes
            data={chartData}
            options={options}
            plugins={[options.plugins.doughnutLabel]}
          />
        </div>
      </div>
    </div>
  );
}

export default DoughnutChart;
