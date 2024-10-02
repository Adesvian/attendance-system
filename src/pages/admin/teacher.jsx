import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import TableDataManager from "../../components/table/table";
import { useNavigate } from "react-router-dom";
import { fetchTeachers, deleteTeacher } from "../../app/api/v1/admin-services";
import SearchAndButton from "../../components/input/header-search";

function Guru() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleView = (row) => {
    navigate(`/teacher/view-teacher/${row.nid}`);
  };

  const handleEdit = (row) => {
    navigate(`/teacher/edit-teacher/${row.nid}`);
  };

  const handleDelete = (row) => {
    deleteTeacher(row.nid, setData);
  };

  useEffect(() => {
    fetchTeachers(setData);
    setColumns([
      { field: "profile", header: "Gender" },
      { field: "nid", header: "NIK" },
      { field: "name", header: "Name" },
      { field: "ttl", header: "Tempat Tgl. Lahir" },
      { field: "type", header: "Type Guru" },
      { field: "address", header: "Alamat" },
      { field: "action", header: "Action" },
    ]);
    dispatch(setPageTitle({ title: "Guru" }));
  }, []);

  return (
    <>
      <SearchAndButton
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        buttonLabel="Tambah Data Guru"
        onButtonClick={() => navigate("/teacher/create-teacher")}
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

export default Guru;
