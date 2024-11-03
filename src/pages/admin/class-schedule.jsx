import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import TableDataManager from "../../components/table/table"; // Ensure the file name and path are correct
import { useNavigate } from "react-router-dom";
import {
  deleteClassSchedule,
  fetchSchedules,
} from "../../app/api/v1/admin-services";
import SearchAndButton from "../../components/input/header-search";

function ClassSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      <div data-testid="class-schedule-element">
        <SearchAndButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          buttonLabel="Tambah Jadwal Guru"
          onButtonClick={() => navigate("/data-jadwal/create-jadwal")}
        />

        <TableDataManager
          data={data}
          columns={columns}
          handleAct1={handleEdit}
          handleAct2={handleDelete}
          searchQuery={searchQuery}
        />
      </div>
    </>
  );
}

export default ClassSchedule;
