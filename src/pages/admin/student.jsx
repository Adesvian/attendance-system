import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import TableDataManager from "../../components/table/table";
import { MdOutlineAdd } from "react-icons/md";
import moment from "moment";
import {
  deleteStudent,
  fetchStudentData,
} from "../../app/api/v1/admin-services";

function Student() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

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
      { field: "profile", header: "Profile" },
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
      <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
        <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4">
          <div className="flex lg:justify-end">
            <Button
              variant="contained"
              className="dark:bg-indigo-700 lg:flex-none flex-auto whitespace-nowrap"
              startIcon={<MdOutlineAdd />}
              onClick={() => navigate("/data-siswa/create-siswa")}
            >
              Tambah Data Siswa
            </Button>
          </div>

          <TableDataManager
            data={data}
            columns={columns}
            handleAct0={handleView}
            handleAct1={handleEdit}
            handleAct2={handleDelete}
          />
        </div>
      </div>
    </>
  );
}

export default Student;
