import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import axios from "axios";
import moment from "moment";
import RecentAttendance from "../../features/activity/recent";
import axiosInstance from "../../app/api/auth/axiosConfig";

const DashboardParent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.parent);
  const child = useSelector((state) => state.header.child);
  const [activeTab, setActiveTab] = useState("senin");
  const [data, setData] = useState({
    schedule: [],
    attendance: [],
  });

  const tabContent = {
    senin: "Tab content for Senin",
    selasa: "Tab content for Selasa",
    rabu: "Tab content for Rabu",
    kamis: "Tab content for Kamis",
    jumat: "Tab content for Jumat",
  };

  const filteredLessons = data.schedule.filter(
    (lesson) => lesson.day === activeTab
  );

  const formatTime = (time) => moment.utc(time).format("HH:mm");

  useEffect(() => {
    const fetchData = async () => {
      if (child && child.class && child.class.id) {
        try {
          const schedulePromise = axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule?class=${
              child.class.id
            }`
          );

          const attendancePromise = axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance-today?rfid=${
              child.rfid
            }`
          );

          const subjectAttendancePromise = axiosInstance.get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/subject-attendance-today?rfid=${child.rfid}`
          );

          // Wait for all promises to resolve
          const [
            scheduleResponse,
            attendanceResponse,
            subjectAttendanceResponse,
          ] = await Promise.all([
            schedulePromise,
            attendancePromise,
            subjectAttendancePromise,
          ]);

          // Combine attendance data
          const combinedAttendance = [
            ...(attendanceResponse.data.data || []),
            ...(subjectAttendanceResponse.data.data || []),
          ];

          setData((prevData) => ({
            ...prevData,
            schedule: scheduleResponse.data.data || [],
            attendance: combinedAttendance,
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
    dispatch(setPageTitle({ title: "Dashboard Wali Murid" }));
  }, [child, dispatch]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="relative parent-welcome-card bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-8 font-poppins flex flex-row">
          <div className="z-40">
            <h1 className="text-2xl font-bold">
              Assalammualaikum!{" "}
              <span className="block mt-2">Selamat datang, Ayah/Bunda...</span>
            </h1>
            <h2 className="text-xl font-medium mt-5">
              {child && child.name
                ? `${child.name} - ${child.class.name}`
                : "Loading data anak..."}
            </h2>
          </div>
          <div className="absolute -right-4 -top-0 lg:right-0 lg:-top-5">
            <img
              src="../assets/welcome-sign.png"
              alt="welcome"
              className="w-52"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-5">
        <div className="md:col-span-2 lg:col-span-2 col-span-1 bg-white dark:bg-base-100 rounded-md p-5">
          <div
            role="tablist"
            className="tabs tabs-lifted tab-xs lg:tabs-lg mb-4 overflow-x-auto whitespace-nowrap"
          >
            {Object.keys(tabContent).map((day) => (
              <button
                key={day}
                role="tab"
                className={`tab flex-shrink-0 [--tab-bg:#347928] dark:[--tab-bg:white] dark:[--tab-border-color:#fff] ${
                  activeTab === day
                    ? "tab-active text-white dark:!text-[#1a1a1a]"
                    : "text-gray-800 dark:text-gray-200"
                }`}
                onClick={() => setActiveTab(day)}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            ))}
          </div>
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="card p-4 mb-2 bg-gray-100 dark:bg-base-200 rounded shadow text-black dark:text-white flex flex-col"
              >
                <h3 className="font-bold">{lesson.subject.name}</h3>
                <p>Jam Mulai : {formatTime(lesson.start_time)}</p>
                <p>Jam Selesai : {formatTime(lesson.end_time)}</p>
              </div>
            ))
          ) : (
            <p>Tidak ada pelajaran untuk hari ini.</p>
          )}
        </div>

        <div className="lg:col-span-1 md:col-span-1 col-span-1">
          <RecentAttendance
            data={data.attendance}
            initialRowsPerPage={5}
            initialSortOrder="asc"
          />
        </div>
      </div>
    </>
  );
};

export default DashboardParent;
