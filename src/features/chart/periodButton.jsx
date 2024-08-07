import React from "react";
import SingleButton from "../../components/button/singleButton";

function PeriodButtons({
  activeButton,
  setActiveButton,
  updateChartData,
  setData,
}) {
  const handleButtonClick = (period) => {
    setActiveButton(period);
    updateChartData(period, setData);
  };

  const getButtonBgClass = (period) => {
    return activeButton === period
      ? "bg-light-secondary text-white hover:bg-light-secondary hover:text-white"
      : "bg-white hover:bg-light-secondary hover:text-white";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-2 bg-gray-200/50 dark:bg-base-200 p-2 rounded-md ">
        {["Day", "Month", "Year"].map((period) => (
          <SingleButton
            key={period}
            btnTitle={period}
            btnBg={getButtonBgClass(period)}
            onClick={() => handleButtonClick(period)}
          />
        ))}
      </div>
    </div>
  );
}

export default PeriodButtons;
