import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import StatsCard from "../../components/card/stats-card";
import BarChart from "../../features/chart/BarChart";
import { FiUsers } from "react-icons/fi";
import { SiGoogleclassroom } from "react-icons/si";
import { BsClipboardCheck, BsClipboardX } from "react-icons/bs";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";
import RecentAttendance from "../../features/activity/recent";

const recentAttendances = [
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "John Doe",
    className: "Kelas 1",
    status: "Late",
    method: "Check-in",
    time: 1722446357,
  },
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "Hanan Smith",
    className: "Kelas 2",
    status: "On Time",
    method: "Check-in",
    time: 1722646337,
  },
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "Bob Smith",
    className: "Kelas 3",
    status: "On Time",
    method: "Check-in",
    time: 1722646327,
  },
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "Bob Smith",
    className: "Kelas 3",
    status: "On Time",
    method: "Check-in",
    time: 1722646327,
  },
  {
    profile:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    name: "Bob Smith",
    className: "Kelas 3",
    method: "Check-out",
    time: 1722646327,
  },
];

function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }));
  }, [dispatch]);

  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-5">
        <StatsCard
          Icon={
            <FiUsers className="bg-indigo-200 text-indigo-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Student"
          Value="100"
        />
        <StatsCard
          Icon={
            <FiUsers className="bg-purple-200 text-purple-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Teacher"
          Value="100"
        />
        <StatsCard
          Icon={
            <SiGoogleclassroom className="bg-gray-200 text-gray-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Class"
          Value="6"
        />
        <StatsCard
          Icon={
            <BsClipboardCheck className="bg-teal-200 text-teal-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Precense"
          Value="100%"
        />
        <StatsCard
          Icon={
            <BsClipboardX className="bg-pink-200 text-pink-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Absent"
          Value="5"
        />
        <StatsCard
          Icon={
            <MdOutlinePendingActions className="bg-amber-200 text-amber-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Pending Approval"
          Value="5"
        />
        <StatsCard
          Icon={
            <MdOutlineWatchLater className="bg-green-200 text-green-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="On Time"
          Value="2"
        />
        <StatsCard
          Icon={
            <MdOutlineWatchLater className="bg-rose-200 text-rose-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Late"
          Value="2"
        />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-5 mb-5">
        <BarChart />
        <RecentAttendance
          data={recentAttendances}
          initialRowsPerPage={5}
          initialSortOrder="asc"
        />
      </div>
    </>
  );
}

export default Dashboard;
