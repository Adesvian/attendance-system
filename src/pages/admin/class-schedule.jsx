import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { Button } from "@mui/material";
import { MdOutlineAdd } from "react-icons/md";
import TableDataManager from "../../components/table/table"; // Ensure the file name and path are correct
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

function ClassSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleEdit = (row) => {
    console.log("Edit clicked for: ", row);
    // Implement edit logic here
  };

  // Define handleDelete function
  const handleDelete = (row) => {
    console.log("Delete clicked for: ", row);
    // Implement delete logic here
  };

  const fetchData = async () => {
    try {
      const [
        scheduleResponse,
        classesResponse,
        subjectsResponse,
        teachersResponse,
      ] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/classschedule`),
        axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/classes`),
        axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/subjects`),
        axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/teachers`),
      ]);

      const scheduleData = scheduleResponse.data;
      const classesData = classesResponse.data;
      const subjectsData = subjectsResponse.data;
      const teachersData = teachersResponse.data;

      // Create mappings for classes, subjects, and teachers
      const classMap = {};
      classesData.forEach((item) => {
        classMap[item.id] = item.name; // Assuming your classes data has 'id' and 'name'
      });

      const subjectMap = {};
      subjectsData.forEach((item) => {
        subjectMap[item.id] = item.name; // Assuming your subjects data has 'id' and 'name'
      });

      const teacherMap = {};
      teachersData.forEach((item) => {
        teacherMap[item.id] = item.name; // Assuming your teachers data has 'id' and 'name'
      });

      // Map the schedule data to replace IDs with names
      const transformedData = scheduleData.map((item) => ({
        className: classMap[item.class_id] || item.class_id,
        subjectName: subjectMap[item.subject_id] || item.subject_id,
        teacherName: teacherMap[item.teacher_id] || item.teacher_id,
        day: item.day,
        time: `${moment(item.start_time).utc().format("HH:mm")} - ${moment(
          item.end_time
        )
          .utc()
          .format("HH:mm")}`,
      }));

      console.log(transformedData);

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setColumns([
      { field: "className", header: "Kelas" },
      { field: "subjectName", header: "Subject" },
      { field: "teacherName", header: "Nama Guru" },
      { field: "day", header: "Hari" },
      { field: "time", header: "Waktu" },
      { field: "action", header: "Action" },
    ]);
    dispatch(setPageTitle({ title: "Guru" }));
  }, [dispatch]);

  return (
    <>
      <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
        <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4">
          <div className="flex lg:justify-end">
            <Button
              variant="contained"
              className="dark:bg-indigo-700 lg:flex-none flex-auto whitespace-nowrap"
              startIcon={<MdOutlineAdd />}
              onClick={() => navigate("/teacher/create-teacher")}
            >
              Tambah Data Guru
            </Button>
          </div>

          <TableDataManager
            data={data}
            columns={columns}
            handleAct1={handleEdit}
            handleAct2={handleDelete}
          />
        </div>
      </div>
    </>
  );
}

export default ClassSchedule;
