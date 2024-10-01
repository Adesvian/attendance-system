import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { Button } from "@mui/material";
import { MdOutlineAdd } from "react-icons/md";
import TableDataManager from "../../components/table/table"; // Pastikan nama file dan path sudah benar
import { useNavigate } from "react-router-dom";
import { fetchTeachers, deleteTeacher } from "../../app/api/v1/admin-services";

function Guru() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

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
      { field: "profile", header: "Profile" },
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
        handleAct0={handleView}
        handleAct1={handleEdit}
        handleAct2={handleDelete}
      />
    </>
  );
}

export default Guru;
