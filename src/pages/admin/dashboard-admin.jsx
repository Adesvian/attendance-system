import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import StatsCard from "../../components/card/statsCard";
import BarChart from "../../features/chart/BarChart";
import { FiUsers } from "react-icons/fi";
import { SiGoogleclassroom, SiBookstack, SiWhatsapp } from "react-icons/si";
import { BsClipboardCheck, BsClipboardX } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import { MdOutlineWatchLater } from "react-icons/md";
import RecentAttendance from "../../features/activity/recent";
import axios from "axios";

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [classScheduleCount, setClassScheduleCount] = useState(0);
  const [presenceRate, setPresenceRate] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }));

    const fetchData = async () => {
      try {
        const [
          students,
          subjects,
          teachers,
          classes,
          permits,
          attendance,
          classSchedule,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/students`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/subjects`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/teachers`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/classes`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/permitstoday`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/attendancetoday`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/classschedule`),
        ]);

        setStudentCount(students.data.length);
        setSubjectCount(subjects.data.length);
        setTeacherCount(teachers.data.length);
        setClassCount(classes.data.length);
        const attendanceRate =
          (attendance.data.filter((a) => a.method === 1001).length /
            students.data.length) *
          100;
        const formattedRate = parseFloat(attendanceRate.toFixed(2));
        setPresenceRate(formattedRate);
        setAbsentCount(
          permits.data.filter((a) => a.status === "Accepted").length
        );
        setOnTimeCount(
          attendance.data.filter((a) => a.status === 200 && a.method === 1001)
            .length
        );
        setLateCount(attendance.data.filter((a) => a.status === 201).length);
        setAttendance(attendance.data);
        setClassScheduleCount(classSchedule.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

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
            <FiUsers className="bg-purple-200 text-purple-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Teacher"
          Value={teacherCount}
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
          Value={classScheduleCount}
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
        <StatsCard
          Icon={
            <SiWhatsapp className="bg-green-200 text-green-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Whatsapp"
          Value="Inactive"
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

export default Dashboard;
