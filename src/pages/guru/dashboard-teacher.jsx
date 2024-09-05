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
import axios from "axios";

function DashboardTeacher() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const [studentCount, setStudentCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [classscheduleCount, setClassscheduleCount] = useState(0);
  const [presenceRate, setPresenceRate] = useState(0);
  const [permitCount, setPermitCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [attendance, setAttendance] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch student data
      const students = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/students?class=${encodeURIComponent(user.class)}`
      );

      // Fetch class data only for the current teacher
      const classes = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/classschedule?teacherid=${encodeURIComponent(user.id)}`
      );

      // Fetch permit data for today
      const permits = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/permits?class=${encodeURIComponent(user.class)}`
      );

      // Fetch attendance data for today
      const attendance = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/attendancetoday?class=${encodeURIComponent(user.class)}`
      );

      // Get unique classes and subjects based on teacher login
      const uniqueClasses = [
        ...new Set(classes.data.map((item) => item.class_id)),
      ];
      const uniqueSubjects = [
        ...new Set(classes.data.map((item) => item.subject_id)),
      ];

      setStudentCount(students.data.length);
      setClassCount(uniqueClasses.length);
      setSubjectCount(uniqueSubjects.length);
      setClassscheduleCount(classes.data.length);
      setPermitCount(permits.data.length);
      const attendanceRate =
        (attendance.data.filter((a) => a.method === 1001).length /
          students.data.length) *
        100;
      const formattedRate = parseFloat(attendanceRate.toFixed(2));
      setPresenceRate(formattedRate);

      // Mendapatkan tanggal hari ini dalam epoch Unix time (mulai dari tengah malam hari ini)
      const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
      const todayEnd = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);

      const approvedToday = permits.data.filter(
        (permit) =>
          permit.status === "Approve" &&
          permit.date >= todayStart &&
          permit.date <= todayEnd
      );

      setAbsentCount(
        permits.data.filter(
          (permit) =>
            permit.status === "Approve" &&
            permit.date >= todayStart &&
            permit.date <= todayEnd
        ).length
      );
      setOnTimeCount(
        attendance.data.filter((a) => a.status === 200 && a.method === 1001)
          .length
      );
      setLateCount(attendance.data.filter((a) => a.status === 201).length);
      setAttendance(attendance.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }));
    fetchData();
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-5">
        <StatsCard
          Icon={
            <FiUsers className="bg-indigo-200 text-indigo-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Student"
          Value={studentCount}
        />
        <StatsCard
          Icon={
            <SiGoogleclassroom className="bg-gray-200 text-gray-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Class"
          Value={classCount}
        />
        <StatsCard
          Icon={
            <SiBookstack className="bg-emerald-200 text-emerald-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Subject"
          Value={subjectCount}
        />
        <StatsCard
          Icon={
            <GrSchedules className="bg-fuchsia-200 text-fuchsia-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Schedules"
          Value={classscheduleCount}
        />
        <StatsCard
          Icon={
            <BsClipboardCheck className="bg-indigo-200 text-indigo-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Presence"
          Value={`${presenceRate}%`}
        />
        <StatsCard
          Icon={
            <MdPendingActions className="bg-amber-200 text-amber-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Pending Approval"
          Value={permitCount}
        />
        <StatsCard
          Icon={
            <BsClipboardX className="bg-pink-200 text-pink-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Absent"
          Value={absentCount}
        />
        <StatsCard
          Icon={
            <MdOutlineWatchLater className="bg-green-200 text-green-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="On Time"
          Value={onTimeCount}
        />
        <StatsCard
          Icon={
            <MdOutlineWatchLater className="bg-rose-200 text-rose-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Late"
          Value={lateCount}
        />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-6 md:gap-x-5 gap-y-4 mt-5 mb-5">
        <BarChart />
        <RecentAttendance
          data={attendance}
          initialRowsPerPage={5}
          initialSortOrder="asc"
        />
      </div>
    </>
  );
}

export default DashboardTeacher;
