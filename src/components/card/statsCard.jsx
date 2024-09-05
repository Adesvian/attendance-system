import React from "react";
import Tooltip from "@mui/material/Tooltip";

function StatsCard({ Title, Value, Icon }) {
  // Daftar judul yang valid untuk menampilkan tooltip
  const validTitles = [
    "Presence",
    "Absent",
    "On Time",
    "Late",
    "Pending Approval",
  ];

  // Cek apakah Title ada di dalam daftar validTitles
  const showTooltip = validTitles.includes(Title);

  const content = (
    <div className="bg-white dark:bg-base-100 rounded-md shadow-md font-semibold">
      <div className="stat flex items-center justify-between">
        <div className="grid grid-cols-1 gap-2 content-between">
          <div className="text-xl dark:text-dark-text whitespace-nowrap">
            {Title}
          </div>
          <div className="text-3xl text-gray-800 dark:text-dark-text font-nunito">
            {Value}
          </div>
        </div>
        <div className="flex-shrink-0">{Icon}</div>
      </div>
    </div>
  );

  return showTooltip ? (
    <Tooltip title={`Status ${Title} berdasarkan hari ini`} arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
}

export default StatsCard;
