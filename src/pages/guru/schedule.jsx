import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import axios from "axios";
import moment from "moment";
import SingleButton from "../../components/button/Button";
import {
  enrollStudents,
  fetchSChedule,
  fetchStudentsEnrollment,
} from "../../app/api/v1/teacher-services";
import EnrollModal from "../../components/modal/EnrollModal";

function Schedule() {
  const dispatch = useDispatch();
  const teacher = useSelector((state) => state.auth.teacher);
  const [activeTab, setActiveTab] = useState("senin");
  const [scheduleData, setScheduleData] = useState({ schedule: [] });
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentsByClass, setSelectedStudentsByClass] = useState({});
  const [subjectId, setSubjectId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");

  useEffect(() => {
    const loadSchedule = async () => {
      await fetchSChedule(
        teacher,
        setScheduleData,
        setSelectedClassId,
        setSubjectId
      );
    };

    loadSchedule();
    dispatch(setPageTitle({ title: "Jadwal Mengajar" }));
  }, [dispatch, teacher.nid]);

  useEffect(() => {
    const loadStudents = async () => {
      if (selectedClassId) {
        await fetchStudentsEnrollment(
          selectedClassId,
          setStudents,
          scheduleData
        );
      }
    };

    loadStudents();
  }, [selectedClassId, scheduleData]);

  useEffect(() => {
    if (scheduleData.schedule.length > 0 && !selectedClassId) {
      const firstClassId = scheduleData.schedule[0].class_id;
      setSelectedClassId(firstClassId);
    }
  }, [scheduleData, selectedClassId]);

  const filteredLessons = scheduleData.schedule.filter(
    (lesson) => lesson.day === activeTab
  );

  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const className = lesson.class.name;
    acc[className] = acc[className] || [];
    acc[className].push(lesson);
    return acc;
  }, {});

  const sortedClassNames = Object.keys(groupedLessons).sort();

  const formatTime = (time) => moment.utc(time).format("HH:mm");

  const handleOpenModal = async () => {
    const enrollResponse = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/enroll/${subjectId}`
    );

    const enrolledStudents = enrollResponse.data.data.map(
      (student) => student.student_rfid
    );
    setSelectedStudentsByClass((prev) => ({
      ...prev,
      [selectedClassId]: enrolledStudents,
    }));
    document.getElementById("enroll").showModal();
  };

  const handleCloseModal = () => {
    setSearchTerm("");
    document.getElementById("enroll").close();
  };

  const handleCheckboxChange = (id) => {
    setSelectedStudentsByClass((prev) => ({
      ...prev,
      [selectedClassId]: prev[selectedClassId]?.includes(id)
        ? prev[selectedClassId].filter((studentId) => studentId !== id)
        : [...(prev[selectedClassId] || []), id],
    }));
  };

  const handleSelectAllChange = () => {
    setSelectedStudentsByClass((prev) => {
      const currentSelected = prev[selectedClassId] || [];
      const allStudentIds = students.map((student) => student.rfid);
      const isAllSelected = currentSelected.length === students.length;

      return {
        ...prev,
        [selectedClassId]: isAllSelected ? [] : allStudentIds,
      };
    });
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollStudents = async () => {
    await enrollStudents(
      subjectId,
      selectedStudentsByClass[selectedClassId] || [],
      handleCloseModal
    );
  };

  const uniqueClasses = [
    ...new Set(scheduleData.schedule.map((item) => item.class_id)),
  ].sort();

  return (
    <>
      {teacher.type === "Ekstra Teacher" && (
        <div className="grid justify-end">
          <SingleButton
            className="bg-[#347928] hover:bg-[#2d6424] text-white mb-2"
            onClick={handleOpenModal}
            btnTitle={"Enroll Siswa"}
            disabled={subjectId === null}
          />
          <EnrollModal
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedClassId={selectedClassId}
            setSelectedClassId={setSelectedClassId}
            uniqueClasses={uniqueClasses}
            filteredStudents={filteredStudents}
            selectedStudents={selectedStudentsByClass[selectedClassId] || []}
            handleSelectAllChange={handleSelectAllChange}
            handleCheckboxChange={handleCheckboxChange}
            handleCloseModal={handleCloseModal}
            handleEnrollStudents={handleEnrollStudents}
          />
        </div>
      )}

      <div
        role="tablist"
        className="tabs tabs-lifted lg:tabs-lg mb-4 overflow-x-auto whitespace-nowrap"
      >
        {["senin", "selasa", "rabu", "kamis", "jumat"].map((day) => (
          <button
            key={day}
            className={`tab [--tab-bg:#347928] flex-shrink-0 ${
              activeTab === day ? "tab-active text-white" : "text-gray-800"
            }`}
            onClick={() => setActiveTab(day)}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>

      {sortedClassNames.length > 0 ? (
        <div className="join join-vertical w-full">
          {sortedClassNames.map((className) => (
            <div
              key={className}
              className="collapse collapse-arrow join-item border"
            >
              <input type="radio" name="accordion" />
              <div className="collapse-title text-xl font-medium">
                {className}
              </div>
              <div className="collapse-content">
                {groupedLessons[className].map((lesson) => (
                  <div
                    key={lesson.id}
                    className="card p-4 bg-gray-100 rounded shadow mb-2"
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
