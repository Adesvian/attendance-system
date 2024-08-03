import React from "react";

function StatsCard({ Title, Value, Icon }) {
  return (
    <div className="bg-white dark:bg-base-100 rounded-md drop-shadow-lg  font-semibold">
      <div className="stat flex items-center justify-between">
        <div className="grid grid-cols-1 gap-2 content-between">
          <div className="text-xl dark:text-dark-text whitespace-nowrap">
            {Title}
          </div>
          <div className="text-3xl text-gray-800 dark:text-dark-text font-nunito">
            {Value}
          </div>
        </div>
        <div className="flex-shrink-0 ">{Icon}</div>
      </div>
    </div>
  );
}

export default StatsCard;
