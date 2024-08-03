import React from "react";

function statsCard({ Title, Value, Icon }) {
  return (
    <div className="bg-teal-500 dark:bg-base-100 rounded-md drop-shadow-lg text-dark-text dark:text-dark-text font-bold">
      <div className="stat flex items-center justify-between">
        <div class="grid grid-cols-1 gap-2 content-between">
          <div className="text-xl font-bold whitespace-nowrap">{Title}</div>
          <div className="text-3xl">{Value}</div>
        </div>
        <div
          className={`stat-figure flex-shrink-0 rounded-full p-4 bg-white/70 dark:bg-white `}
        >
          <Icon className="w-7 h-7 text-gray-800/40" />
        </div>
      </div>
    </div>
  );
}

export default statsCard;
