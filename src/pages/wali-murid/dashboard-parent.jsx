import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import moment from "moment";
import RecentAttendance from "../../features/activity/recent";
import Notifications from "../../features/activity/notifications";
import {
  fetchDataDashboard,
  isCheckout,
} from "../../app/api/v1/parent-services";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";

const DashboardParent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.parent);
  const child = useSelector((state) => state.header.child);
  const [activeTab, setActiveTab] = useState("senin");
  const [data, setData] = useState({
    schedule: [],
    attendance: [],
    events: [],
  });
  const [countChild, setCountChild] = useState(0);
  const [showAlerts, setShowAlerts] = useState([]);

  const handleClose = (index) => {
    const newShowAlerts = [...showAlerts];
    newShowAlerts[index] = false;
    setShowAlerts(newShowAlerts);
  };

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
      await fetchDataDashboard(child, setData);
      await isCheckout(user.nid, setCountChild);
    };

    fetchData();
    dispatch(setPageTitle({ title: "Dashboard Wali Murid" }));
  }, [child, dispatch]);

  useEffect(() => {
    if (countChild.length > 0) {
      setShowAlerts(new Array(countChild.length).fill(true));
    }
  }, [countChild]);
  return (
    <>
      <div
        className="grid grid-cols-1 gap-6 mt-5"
        data-testid="dashboard-element"
      >
        <div
          className={`relative mb-10 ${
            showAlerts.indexOf(true) === -1 ? "hidden" : ""
          }`}
        >
          {showAlerts.map((showAlert, index) => (
            <Fade key={index} in={showAlert} timeout={500}>
              <Alert
                severity="warning"
                onClose={() => handleClose(index)}
                className="transition-all duration-500 ease-in-out absolute w-full"
                style={{
                  zIndex: showAlerts.length - index,
                }}
              >
                <strong>{countChild[index].name}</strong>, belum melakukan
                proses checkout dengan RFID untuk hari ini. Mohon pastikan siswa
                melakukan tapping untuk mencatat kehadiran.
              </Alert>
            </Fade>
          ))}
        </div>

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
              src="./assets/welcome-sign.png"
              alt="welcome"
              className="w-52"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-5">
        <div className="md:col-span-2 lg:col-span-2 col-span-1 bg-white dark:bg-base-100 rounded-md">
          <div
            role="tablist"
            className="tabs tabs-lifted tab-xs lg:tabs-lg mb-4 overflow-x-auto whitespace-nowrap "
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
          <div className="max-h-[28rem] overflow-scroll">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="card p-4 mb-2 bg-gray-100 dark:bg-base-200 rounded shadow text-black dark:text-white flex flex-col "
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
        </div>

        <div className="lg:col-span-1 md:col-span-1 col-span-1">
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
};

export default DashboardParent;
