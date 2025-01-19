import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({
  value,
  min = 0,
  max = 100,
  title = "",
  tooltip = "",
}) => {
  // Menggunakan Redux theme state
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
    return { width: 190, height: 150 };
  };

  const dimensions = getChartDimensions();

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(
      chartArea.left,
      0,
      chartArea.right,
      0
    );
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.5, "yellow");
    gradient.addColorStop(1, "green");
    return gradient;
  };

  const data = {
    datasets: [
      {
        data: [
          ((value - min) / (max - min)) * 100,
          100 - ((value - min) / (max - min)) * 100,
        ],
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;

          if (!chartArea) {
            return ["#ff0000", theme === "dark" ? "#2d2d2d" : "#f5f5f5"];
          }

          return [
            createGradient(canvasCtx, chartArea),
            theme === "dark" ? "#2d2d2d" : "#f5f5f5",
          ];
        },
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    animation: window.matchMedia("print").matches ? false : true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      gaugeText: {
        id: "gaugeText",
        beforeDraw(chart) {
          const {
            ctx,
            chartArea: { top, bottom, left, right, width },
          } = chart;

          ctx.save();

          const isDarkMode = theme === "dark";
          const textColor = isDarkMode ? "#fff" : "#333";
          const secondaryTextColor = isDarkMode ? "#aaa" : "#666";

          // Draw the value
          const valueText = value.toFixed(2);
          ctx.font = "bold 24px Arial";
          ctx.fillStyle = textColor;
          ctx.textAlign = "center";
          ctx.fillText(
            valueText,
            width / 2,
            bottom - (windowSize.width < 480 ? 30 : 10)
          );

          // Draw min value
          ctx.font = "12px Arial";
          ctx.fillStyle = secondaryTextColor;
          ctx.textAlign = "left";
          ctx.fillText(
            min.toFixed(2),
            left + 10,
            bottom - (windowSize.width < 480 ? 30 : 10)
          );

          // Draw max value
          ctx.textAlign = "right";
          ctx.fillText(
            max.toFixed(2),
            right - 10,
            bottom - (windowSize.width < 480 ? 30 : 10)
          );

          // Draw title if provided
          if (title) {
            ctx.font = "bold 14px Arial";
            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.fillText(
              title,
              width / 2,
              top + (windowSize.width < 480 ? 30 : 20)
            );
          }

          ctx.restore();
        },
      },
    },
  };

  // Force chart redraw when theme changes
  useEffect(() => {
    const chart = document
      .querySelector(".tooltip canvas")
      ?.getContext("2d")?.chart;
    if (chart) {
      chart.draw();
    }
  }, [theme]);

  return (
    <div
      className="tooltip"
      data-tip={tooltip}
      style={{ height: dimensions.height, width: dimensions.width }}
    >
      <Doughnut
        key={theme} // Force re-render when theme changes
        data={data}
        options={options}
        plugins={[options.plugins.gaugeText]}
      />
    </div>
  );
};

export default GaugeChart;
