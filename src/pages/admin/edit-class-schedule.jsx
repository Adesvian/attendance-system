import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import SingleButton from "../../components/button/Button";
import {
  submitScheduleData,
  updateSchedule,
} from "../../app/api/v1/admin-services";
import moment from "moment";
import axiosInstance from "../../app/api/auth/axiosConfig";

function EditClassSchedule() {
  const { id } = useParams(); // Ambil id dari URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    teacher_nid: "",
    class_id: "",
    subject_id: "",
    day: "senin",
    start_time: "",
    end_time: "",
  });
  const [scheduleDataOriginal, setScheduleDataOriginal] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await updateSchedule(
      scheduleData,
      id,
      setLoading,
      scheduleDataOriginal
    );
    if (success) {
      navigate("/data-jadwal");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherResponse, classResponse, subjectResponse] =
          await Promise.all([
            axiosInstance.get(
              `${import.meta.env.VITE_BASE_URL_BACKEND}/teachers`
            ),
            axiosInstance.get(
              `${import.meta.env.VITE_BASE_URL_BACKEND}/classes`
            ),
            axiosInstance.get(
              `${import.meta.env.VITE_BASE_URL_BACKEND}/subjects`
            ),
          ]);

        setTeachers(teacherResponse.data.data);
        setClasses(classResponse.data.data);
        setSubjects(subjectResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    dispatch(setPageTitle({ title: "Edit Jadwal Kelas" }));
  }, [dispatch]);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule/${id}`
        );

        const data = response.data.data;
        setScheduleData({
          teacher_nid: data.teacher_nid || "",
          class_id: data.class_id || "",
          subject_id: data.subject_id || "",
          day: data.day || "senin",
          start_time: moment(data.start_time).utc().format("HH:mm"), // Format to HH:mm
          end_time: moment(data.end_time).utc().format("HH:mm"), // Format to HH:mm
        });

        // Simpan data asli untuk perbandingan saat submit
        setScheduleDataOriginal({
          teacher_nid: data.teacher_nid || "",
          class_id: data.class_id || "",
          subject_id: data.subject_id || "",
          day: data.day || "senin",
          start_time: moment(data.start_time).utc().format("HH:mm"),
          end_time: moment(data.end_time).utc().format("HH:mm"),
        });
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    if (id) {
      fetchSubjectData();
    }
  }, [id]);

  const groupedSubjects = subjects.reduce((acc, subject) => {
    const categoryName = subject.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(subject);
    return acc;
  }, {});

  return (
    <div className="p-2 font-poppins" data-testid="edit-class-schedule-element">
      <form onSubmit={handleSubmit}>
        <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          {/* Teacher Selection */}
          <div className="sm:col-span-3">
            <label
              htmlFor="teacher_nid"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Guru:
            </label>
            <div className="mt-2">
              <select
                name="teacher_nid"
                id="teacher_nid"
                onChange={handleChange}
                value={scheduleData.teacher_nid}
                className="border p-3 rounded-md w-full"
                required
              >
                <option value="">Pilih Guru</option>
                {teachers.map((teacher) => (
                  <option key={teacher.nid} value={teacher.nid}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="sm:col-span-3">
            <label
              htmlFor="subject_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nama Mata Pelajaran:
            </label>
            <div className="mt-2">
              <select
                name="subject_id"
                id="subject_id"
                onChange={handleChange}
                value={scheduleData.subject_id}
                className="border p-3 rounded-md w-full"
                required
              >
                <option value="">Pilih Mata Pelajaran</option>
                {Object.entries(groupedSubjects).map(
                  ([categoryName, subjects]) => (
                    <optgroup key={categoryName} label={categoryName}>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </optgroup>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="mt-5 grid grid-cols-1">
          <label
            htmlFor="class_id"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Kelas:
          </label>
          <select
            name="class_id"
            id="class_id"
            onChange={handleChange}
            value={scheduleData.class_id}
            className="border p-3 rounded-md w-full mt-2"
            required
          >
            <option value="">Pilih Kelas</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selection */}
        <div className="mt-5 grid grid-cols-1">
          <label
            htmlFor="day"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Hari:
          </label>
          <select
            name="day"
            id="day"
            onChange={handleChange}
            value={scheduleData.day}
            className="border p-3 rounded-md w-full mt-2"
            required
          >
            <option value="senin">Senin</option>
            <option value="selasa">Selasa</option>
            <option value="rabu">Rabu</option>
            <option value="kamis">Kamis</option>
            <option value="jumat">Jumat</option>
          </select>
        </div>

        {/* Time Inputs */}
        <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="start_time"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Jam Mulai:
            </label>
            <input
              type="time"
              name="start_time"
              id="start_time"
              onChange={handleChange}
              value={scheduleData.start_time}
              className="border p-3 rounded-md w-full mt-2"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="end_time"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Jam Selesai:
            </label>
            <input
              type="time"
              name="end_time"
              id="end_time"
              onChange={handleChange}
              value={scheduleData.end_time}
              className="border p-3 rounded-md w-full mt-2"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-5">
          <SingleButton
            btnTitle={loading ? "Loading..." : "Edit"}
            type="submit"
            className={`px-7 py-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            } bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none flex items-center justify-center`}
            disabled={loading}
          >
            {loading && (
              <span className="loading loading-spinner text-primary mr-2"></span>
            )}
          </SingleButton>
        </div>
      </form>
    </div>
  );
}

export default EditClassSchedule;
