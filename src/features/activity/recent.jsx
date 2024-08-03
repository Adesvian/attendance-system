import React from "react";
import { BsClipboardCheck } from "react-icons/bs";
import moment from "moment";

// Data dummy untuk contoh
const recentAttendances = [
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "John Doe",
    className: "Kelas 1",
    status: "Late",
    time: 1722646357,
  },
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "Hanan Smith",
    className: "Kelas 2",
    status: "On Time",
    time: 1722646337,
  },
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "Bob Smith",
    className: "Kelas 3",
    status: "On Time",
    time: 1722646327,
  },
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "Bob Smith",
    className: "Kelas 3",
    status: "On Time",
    time: 1722646327,
  },
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "Bob Smith",
    className: "Kelas 3",
    status: "On Time",
    time: 1722646327,
  },
];

const getRelativeTime = (time) => {
  return moment.unix(time).fromNow();
};

function Recent() {
  return (
    <div className="bg-white h-[490px] overflow-y-auto dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-dark-text p-4">
      <div className="flex items-center justify-between p-2 mb-7">
        <div>
          <div className="text-2xl font-bold">Recent Presence</div>
          <p className="text-sm mt-2">Last attendance from today</p>
        </div>
        <div className="stat-figure flex-shrink-0 rounded-full p-4 bg-primary/50">
          <BsClipboardCheck className="w-7 h-7" />
        </div>
      </div>
      <div>
        {recentAttendances.map((attendance, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 mb-2 bg-gray-100 dark:bg-gray-800 rounded-md"
          >
            <div className="flex items-center gap-3 text-gray-900 dark:text-dark-text">
              <img
                src={attendance.profile}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className=" text-sm font-medium leading-snug pb-0.5">
                  {attendance.name}{" "}
                  <span className="text-gray-400">
                    dari kelas {attendance.className}
                  </span>
                </h2>
                <h3 className="text-gray-400 text-xs font-normal leading-4">
                  {attendance.status} | {getRelativeTime(attendance.time)}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recent;
