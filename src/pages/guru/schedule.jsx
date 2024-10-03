import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import axios from "axios";
import moment from "moment";

function Schedule() {
  const dispatch = useDispatch();
  const teacher = useSelector((state) => state.auth.teacher);
  const [activeTab, setActiveTab] = useState("senin");
  const [scheduleData, setScheduleData] = useState({
    schedule: [],
  });

  const tabContent = {
    senin: "Tab content for Senin",
    selasa: "Tab content for Selasa",
    rabu: "Tab content for Rabu",
    kamis: "Tab content for Kamis",
    jumat: "Tab content for Jumat",
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule/teacher/${
            teacher.nid
          }`
        );
        setScheduleData({ schedule: response.data.data || [] });
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
    dispatch(setPageTitle({ title: "Jadwal Mengajar" }));
  }, [dispatch, teacher.nid]);

  const filteredLessons = scheduleData.schedule.filter(
    (lesson) => lesson.day === activeTab
  );

  // Group lessons by class name
  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const className = lesson.class.name;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(lesson);
    return acc;
  }, {});

  // Sort class names
  const sortedClassNames = Object.keys(groupedLessons).sort((a, b) =>
    a.localeCompare(b)
  );

  const formatTime = (time) => moment.utc(time).format("HH:mm");

  return (
    <>
      <div
        role="tablist"
        className="tabs tabs-lifted lg:tabs-lg mb-4 overflow-x-auto whitespace-nowrap"
      >
        {Object.keys(tabContent).map((day) => (
          <button
            key={day}
            role="tab"
            className={`tab [--tab-bg:#347928] dark:[--tab-bg:white] dark:[--tab-border-color:#fff] flex-shrink-0 ${
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

      {sortedClassNames.length > 0 ? (
        <div className="join join-vertical w-full">
          {sortedClassNames.map((className, index) => (
            <div
              key={className}
              className="collapse collapse-arrow join-item border-gray-200 dark:border-gray-700 border"
            >
              <input
                type="radio"
                name="accordion"
                defaultChecked={index === 0}
              />
              <div className="collapse-title text-xl font-medium">
                {className} {/* Display class name */}
              </div>
              <div className="collapse-content">
                {groupedLessons[className].map((lesson) => (
                  <div
                    key={lesson.id}
                    className="card p-4 bg-gray-100 dark:bg-base-300 rounded shadow text-black dark:text-dark-text flex flex-col mb-2"
                  >
                    <h3 className="font-bold">{lesson.subject.name}</h3>
                    <p>Jam Mulai: {formatTime(lesson.start_time)}</p>
                    <p>Jam Selesai: {formatTime(lesson.end_time)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Tidak ada pelajaran untuk hari ini.</p>
      )}
    </>
  );
}

export default Schedule;
