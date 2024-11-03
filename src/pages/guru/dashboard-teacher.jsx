import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import StatsCard from "../../components/card/statsCard";
import BarChart from "../../features/chart/BarChart";
import { FiUsers } from "react-icons/fi";
import { SiGoogleclassroom, SiBookstack } from "react-icons/si";
import { BsClipboardCheck, BsClipboardX } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import { MdOutlineWatchLater, MdPendingActions } from "react-icons/md";
import RecentAttendance from "../../features/activity/recent";
import { fetchDataDashboard } from "../../app/api/v1/teacher-services";
import io from "socket.io-client";
import Notifications from "../../features/activity/notifications";

let socket;

function DashboardTeacher() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    student: 0,
    class: 0,
    subject: 0,
    classschedule: 0,
    presenceRate: 0,
    permit: 0,
    absent: 0,
    onTime: 0,
    late: 0,
    attendance: [],
    events: [],
    chartData: [],
  });

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }));
    fetchDataDashboard(setData, setLoading, setError, user);

    socket = io(`${import.meta.env.VITE_SOCKET_URL_BACKEND}`);

    const handleUpdateRecords = () => {
      fetchDataDashboard(setData, setLoading, setError, user);
    };

    socket.on("update-records", handleUpdateRecords);

    return () => {
      socket.off("update-records", handleUpdateRecords);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-5"
        data-testid="dashboard-element"
      >
        <StatsCard
          Icon={
            <FiUsers className="bg-indigo-200 text-indigo-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Student"
          Value={data.student}
        />
        <StatsCard
          Icon={
            <SiGoogleclassroom className="bg-gray-200 text-gray-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Class"
          Value={data.class}
        />
        <StatsCard
          Icon={
            <SiBookstack className="bg-emerald-200 text-emerald-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Subject"
          Value={data.subject}
        />
        <StatsCard
          Icon={
            <GrSchedules className="bg-fuchsia-200 text-fuchsia-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Schedules"
          Value={data.classschedule}
        />
        <StatsCard
          Icon={
            <BsClipboardCheck className="bg-indigo-200 text-indigo-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Presence"
          Value={`${data.presenceRate}%`}
        />
        <StatsCard
          Icon={
            <MdPendingActions className="bg-amber-200 text-amber-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Pending Approval"
          Value={data.permit}
        />
        <StatsCard
          Icon={
            <BsClipboardX className="bg-pink-200 text-pink-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Absent"
          Value={data.absent}
        />
        {user?.class && (
          <>
            <StatsCard
              Icon={
                <MdOutlineWatchLater className="bg-green-200 text-green-600 w-16 h-16 rounded-[22px] p-4" />
              }
              Title="On Time"
              Value={data.onTime}
            />
            <StatsCard
              Icon={
                <MdOutlineWatchLater className="bg-rose-200 text-rose-600 w-16 h-16 rounded-[22px] p-4" />
              }
              Title="Late"
              Value={data.late}
            />
          </>
        )}
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-6 md:gap-x-5 gap-y-4 mt-5 mb-5">
        <BarChart chartData={data.chartData} />
        <div className="carousel rounded-box w-full shadow-md ">
          <div className="carousel-item w-full" id="recent-attendance">
            <RecentAttendance
              data={data.attendance}
              initialRowsPerPage={5}
              initialSortOrder="asc"
            />
          </div>
          <div className="carousel-item w-full" id="notifications">
            <Notifications
              data={data.events}
              initialRowsPerPage={5}
              initialSortOrder="asc"
            />
          </div>
        </div>
      </div>
      <div className="relative bottom-14 right-5 flex justify-end">
        <a
          href="#recent-attendance"
          className="btn btn-xs dark:bg-white dark:text-black"
        >
          1
        </a>
        <a
          href="#notifications"
          className="btn btn-xs ml-2 dark:bg-white dark:text-black"
        >
          2
        </a>
      </div>
    </>
  );
}

export default DashboardTeacher;
