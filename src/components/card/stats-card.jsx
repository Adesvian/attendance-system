import React from "react";
import { FaUser } from "react-icons/fa6";

function statsCard() {
  return (
    <div className="bg-white dark:bg-base-100 rounded-md drop-shadow-lg text-gray-800 dark:text-dark-text p-2">
      <div className="stat flex items-center justify-between">
        <div>
          <div className="text-gray-400">Total Page Views</div>
          <div className="stat-value text-3xl font-bold">89,400</div>
        </div>
        <div className="stat-figure flex-shrink-0">
          <FaUser className="w-16 h-16 opacity-25 text-gray-600" />
        </div>
      </div>
    </div>
  );
}

export default statsCard;
