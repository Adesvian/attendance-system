import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import StatsCard from "../../components/card/statsCard";
import BarChart from "../../features/chart/BarChart";
import { FiUsers } from "react-icons/fi";
import { SiGoogleclassroom } from "react-icons/si";
import { BsClipboardCheck, BsClipboardX } from "react-icons/bs";
import { MdOutlinePendingActions, MdOutlineWatchLater } from "react-icons/md";
import RecentAttendance from "../../features/activity/recent";
import axios from "axios";

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
  const Token = useSelector((state) => state.auth);

  // State untuk menyimpan nilai
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [presenceRate, setPresenceRate] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }));

    const fetchData = async () => {
      try {
        const [students, teachers, classes, attendance] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/students`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/teachers`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/classes`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/attendance`),
        ]);

        console.log(attendance.data.filter((a) => a.method === 1001));
        // Set nilai berdasarkan data yang diambil
        setStudentCount(students.data.length); // Misalkan data siswa adalah array
        setTeacherCount(teachers.data.length); // Misalkan data guru adalah array
        setClassCount(classes.data.length); // Misalkan data kelas adalah array
        setPresenceRate(
          attendance.data.filter((a) => a.method === 1001).length /
            attendance.data.length +
            12 * 100
        ); // Persentase kehadiran
        setAbsentCount(
          attendance.data.filter((a) => a.status === "Absent").length
        ); // Menghitung jumlah yang tidak hadir
        setPendingCount(
          attendance.data.filter((a) => a.status === "Pending").length
        ); // Menghitung jumlah yang menunggu
        setOnTimeCount(
          attendance.data.filter((a) => a.status === "On Time").length
        ); // Menghitung jumlah yang tepat waktu
        setLateCount(attendance.data.filter((a) => a.status === "Late").length); // Menghitung jumlah yang terlambat
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
          Value={studentCount} // Menggunakan state
        />
        <StatsCard
          Icon={
            <FiUsers className="bg-purple-200 text-purple-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Teacher"
          Value={teacherCount} // Menggunakan state
        />
        <StatsCard
          Icon={
            <SiGoogleclassroom className="bg-gray-200 text-gray-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Class"
          Value={classCount} // Menggunakan state
        />
        <StatsCard
          Icon={
            <BsClipboardCheck className="bg-teal-200 text-teal-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Presence"
          Value={`${presenceRate}%`} // Menggunakan state
        />
        <StatsCard
          Icon={
            <BsClipboardX className="bg-pink-200 text-pink-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Absent"
          Value={absentCount} // Menggunakan state
        />
        <StatsCard
          Icon={
            <MdOutlinePendingActions className="bg-amber-200 text-amber-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Pending Approval"
          Value={pendingCount} // Menggunakan state
        />
        <StatsCard
          Icon={
            <MdOutlineWatchLater className="bg-green-200 text-green-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="On Time"
          Value={onTimeCount} // Menggunakan state
        />
        <StatsCard
          Icon={
            <MdOutlineWatchLater className="bg-rose-200 text-rose-600 w-16 h-16 rounded-[22px] p-4" />
          }
          Title="Late"
          Value={lateCount} // Menggunakan state
        />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-6 md:gap-x-5 gap-y-4 mt-5 mb-5">
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
