import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";

function StatsCard({ Title, Value, Icon }) {
  const user = useSelector((state) => state.auth.teacher);

  // Daftar judul yang valid untuk menampilkan tooltip
  const validTitles = [
    "Presence",
    "Absent",
    "On Time",
    "Late",
    "Pending Approval",
  ];

  const utils = ["Student", "Class", "Subject", "Schedules"];

  // Cek apakah Title ada di dalam daftar validTitles atau utils
  const showTooltip =
    validTitles.includes(Title) || (user && utils.includes(Title));

  // Tooltip content untuk judul dari utils jika user login
  const utilsTooltipContent = {
    Student: "Jumlah siswa dari kelas yang anda ampu",
    Class: "Jumlah kelas yang di pegang saat ini",
    Subject: "Jumlah subject yang di ajarkan saat ini",
    Schedules: "Jumlah jadwal ajar yang anda miliki",
  };

  const getTooltipTitle = () => {
    if (validTitles.includes(Title)) {
      return `Status ${Title} berdasarkan hari ini`;
    } else if (user && utils.includes(Title)) {
      return utilsTooltipContent[Title];
    }
    return "";
  };

  const content = (
    <div className="bg-white dark:bg-base-100 rounded-md shadow-md font-semibold">
      <div className="stat flex items-center justify-between border">
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
    <Tooltip title={getTooltipTitle()} arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
}

export default StatsCard;
