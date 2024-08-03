import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../redux/headerSlice";
import StatsCard from "../components/card/stats-card";
import BarChart from "../features/chart/BarChart";
import Recent from "../features/activity/recent";
import { FiUsers } from "react-icons/fi";
import { SiGoogleclassroom } from "react-icons/si";
import { BsClipboardCheck, BsClipboardX } from "react-icons/bs";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";

function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }));
  }, [dispatch]);

  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-5">
        <StatsCard Icon={FiUsers} Title="Siswa" Value="100" />
        <StatsCard Icon={FiUsers} Title="Guru" Value="100" />
        <StatsCard Icon={SiGoogleclassroom} Title="Kelas" Value="6" />
        <StatsCard Icon={BsClipboardCheck} Title="Precense" Value="100%" />
        <StatsCard Icon={BsClipboardX} Title="Absent" Value="5" />
        <StatsCard
          Icon={MdOutlinePendingActions}
          Title="Pending Approval"
          Value="5"
        />
        <StatsCard Icon={MdOutlineWatchLater} Title="On Time" Value="2" />
        <StatsCard Icon={MdOutlineWatchLater} Title="Late" Value="2" />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-5">
        <BarChart />
        <Recent />
      </div>
    </>
  );
}

export default Dashboard;
