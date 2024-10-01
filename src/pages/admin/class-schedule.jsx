import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { Button } from "@mui/material";
import { MdOutlineAdd } from "react-icons/md";
import TableDataManager from "../../components/table/table"; // Ensure the file name and path are correct
import { useNavigate } from "react-router-dom";
import {
  deleteClassSchedule,
  fetchSchedules,
} from "../../app/api/v1/admin-services";

function ClassSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleEdit = (row) => {
    navigate(`/data-jadwal/edit-jadwal/${row.id}`);
  };

  // Define handleDelete function
  const handleDelete = (row) => {
    deleteClassSchedule(row.id, setData);
  };

  useEffect(() => {
    fetchSchedules(setData);
    setColumns([
      { field: "className", header: "Kelas" },
      { field: "subjectName", header: "Subject" },
      { field: "teacherName", header: "Nama Guru" },
      { field: "day", header: "Hari" },
      { field: "time", header: "Waktu" },
      { field: "action", header: "Action" },
    ]);
    dispatch(setPageTitle({ title: "Jadwal Ajar Guru" }));
  }, [dispatch]);

  return (
    <>
      <div className="flex lg:justify-end">
        <Button
          variant="contained"
          className="dark:bg-indigo-700 lg:flex-none flex-auto whitespace-nowrap"
          startIcon={<MdOutlineAdd />}
          onClick={() => navigate("/data-jadwal/create-jadwal")}
        >
          Tambah Jadwal Guru
        </Button>
      </div>

      <TableDataManager
        data={data}
        columns={columns}
        handleAct1={handleEdit}
        handleAct2={handleDelete}
      />
    </>
  );
}

export default ClassSchedule;
