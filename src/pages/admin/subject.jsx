import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { Button } from "@mui/material";
import { MdOutlineAdd } from "react-icons/md";
import TableDataManager from "../../components/table/table"; // Pastikan nama file dan path sudah benar
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Subject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleEdit = (row) => {
    console.log("Edit clicked for: ", row);
    // Implementasi logika edit di sini
  };

  // Definisikan fungsi handleDelete
  const handleDelete = (row) => {
    console.log("Delete clicked for: ", row);
    // Implementasi logika hapus di sini
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/subjects`
      );

      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    setColumns([
      { field: "id", header: "ID" },
      { field: "name", header: "Name" },
      { field: "category", header: "Category" },
      { field: "action", header: "Action" },
    ]);
    dispatch(setPageTitle({ title: "Guru" }));
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

export default Subject;
