import React from "react";
import SingleButton from "../../components/button/Button";

function PeriodButtons({ activeButton, setActiveButton }) {
  const handleButtonClick = (period) => {
    setActiveButton(period);
  };

  const getButtonBgClass = (period) => {
    return activeButton === period
      ? "shadow-md bg-white text-black hover:bg-white hover:text-black"
      : "hover:bg-white hover:text-black hover:shadow-md dark:text-dark-text hover:dark:text-black";
  };

  return (
    <div className="my-2 flex justify-center lg:justify-end">
      <div className="flex space-x-2 mb-2 w-fit bg-gray-100 dark:bg-base-200 p-2 text-center justify-center lg:justify-end">
        {["Day", "Month", "Year"].map((period) => (
          <SingleButton
            key={period}
            btnTitle={period}
            className={`lg:px-4 px-4 lg:py-1.5 py-2 rounded-sm font-semibold lg:text-base text-xs ${getButtonBgClass(
              period
            )}`}
            onClick={() => handleButtonClick(period)}
          />
        ))}
      </div>
    </div>
  );
}

export default PeriodButtons;
