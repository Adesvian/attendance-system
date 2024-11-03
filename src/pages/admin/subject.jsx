import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { Button } from "@mui/material";
import { MdOutlineAdd } from "react-icons/md";
import TableDataManager from "../../components/table/table";
import { useNavigate } from "react-router-dom";
import { deleteSubject, fetchSubjects } from "../../app/api/v1/admin-services";
import SearchAndButton from "../../components/input/header-search";
function Subject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (row) => {
    navigate(`/data-mapel/edit-mapel/${row.id}`);
  };

  // Definisikan fungsi handleDelete
  const handleDelete = (row) => {
    deleteSubject(row.id, setData);
  };

  useEffect(() => {
    fetchSubjects(setData);
    setColumns([
      { field: "no", header: "No" },
      { field: "name", header: "Name" },
      { field: "category", header: "Category" },
      { field: "action", header: "Action" },
    ]);
    dispatch(setPageTitle({ title: "Mata Pelajaran" }));
  }, []);

  return (
    <>
      <div data-testid="subject-element">
        <SearchAndButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          buttonLabel="Tambah Data Mapel"
          onButtonClick={() => navigate("/data-mapel/create-mapel")}
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

export default Subject;
