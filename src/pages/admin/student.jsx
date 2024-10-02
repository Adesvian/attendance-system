import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { useNavigate } from "react-router-dom";
import TableDataManager from "../../components/table/table";
import {
  deleteStudent,
  fetchStudentData,
} from "../../app/api/v1/admin-services";
import SearchAndButton from "../../components/input/header-search";

function Student() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleView = (row) => {
    navigate(`/data-siswa/view-siswa/${row.rfid}`);
  };

  const handleEdit = (row) => {
    navigate(`/data-siswa/edit-siswa/${row.rfid}`);
  };

  // Definisikan fungsi handleDelete
  const handleDelete = (row) => {
    deleteStudent(row, setData);
  };

  useEffect(() => {
    fetchStudentData(setData);
    setColumns([
      { field: "profile", header: "Gender" },
      { field: "rfid", header: "RFID" },
      { field: "name", header: "Name" },
      { field: "class", header: "Kelas" },
      { field: "ttl", header: "Tempat Tgl. Lahir" },
      { field: "parent_name", header: "Orang Tua" },
      { field: "action", header: "Action" },
    ]);
    dispatch(setPageTitle({ title: "Siswa" }));
  }, []);
  return (
    <>
      <SearchAndButton
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        buttonLabel="Tambah Data Siswa"
        onButtonClick={() => navigate("/data-siswa/create-siswa")}
      />

      <TableDataManager
        data={data}
        columns={columns}
        handleAct0={handleView}
        handleAct1={handleEdit}
        handleAct2={handleDelete}
        searchQuery={searchQuery}
      />
    </>
  );
}

export default Student;
