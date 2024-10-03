import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../redux/headerSlice";
import Button from "@mui/material/Button";
import TableDataManager from "../components/table/table";
import Swal from "sweetalert2";
import CustomSelect from "../components/input/Select";
import { MdOutlineAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { fetchPermitDataParent } from "../app/api/v1/parent-services";
import { fetchPermitDataTeacher } from "../app/api/v1/teacher-services";
import SearchAndButton from "../components/input/header-search";

function Permit() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const parent_user = useSelector((state) => state.auth.parent);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleAccept = (row) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: `Menerima izin tidak hadir untuk ${row.name}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, terima!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/permits-udpate-status/${
              row.id
            }`,
            {
              status: 200,
            }
          )
          .then(() => {
            Swal.fire(
              "Accepted!",
              `Izin ${row.name} telah diterima.`,
              "success"
            );
            setData((prevData) =>
              prevData.map((item) =>
                item.id === row.id ? { ...item, status: "Accepted" } : item
              )
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              "Terjadi kesalahan saat memperbarui status izin.",
              "error"
            );
            console.error("Error updating permit status:", error);
          });
      }
    });
  };

  const handleReject = (row) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: `Menolak izin tidak hadir untuk ${row.name}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, tolak!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/permits-udpate-status/${
              row.id
            }`,
            {
              status: 400,
            }
          )
          .then(() => {
            Swal.fire("Ditolak!", `Izin ${row.name} telah ditolak.`, "success");
            setData((prevData) =>
              prevData.map((item) =>
                item.id === row.id ? { ...item, status: "Rejected" } : item
              )
            );
          })
          .catch((error) => {
            Swal.fire("Error", "Terjadi kesalahan saat menolak izin.", "error");
            console.error("Error rejecting permit:", error);
          });
      }
    });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredData = data.filter((item) => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  useEffect(() => {
    dispatch(setPageTitle({ title: "Ketidakhadiran" }));

    const fetchData = async () => {
      try {
        let fetchedData;
        if (parent_user) {
          fetchedData = await fetchPermitDataParent(parent_user);
        } else {
          fetchedData = await fetchPermitDataTeacher(user);
        }
        setData(fetchedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const newColumns = [
      { field: "name", header: "Nama" },
      { field: "class", header: "Kelas" },
      { field: "reason", header: "Alasan" },
      { field: "attachment", header: "Lampiran" },
      { field: "date", header: "Tanggal" },
      { field: "status", header: "Status" },
    ];

    if (!parent_user && user.class != null) {
      newColumns.push({
        field: "action",
        header: "Action",
        render: (row) =>
          row.status === "Pending" && (
            <div className="flex gap-2">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAccept(row)}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleReject(row)}
              >
                Reject
              </Button>
            </div>
          ),
      });
    }

    setColumns(newColumns);
  }, [dispatch, parent_user, user]);
  return (
    <div className="p-2 font-poppins">
      <SearchAndButton
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        buttonLabel="Buat Surat Izin"
        onButtonClick={() => navigate("/permit/create-permit")}
      />
      <span className="text-sm">Filter by Status :</span>
      <CustomSelect
        value={filter}
        onChange={handleFilterChange}
        options={[
          { value: "All", label: "All" },
          { value: "Pending", label: "Pending" },
          { value: "Accepted", label: "Accepted" },
          { value: "Rejected", label: "Rejected" },
        ]}
      />

      <TableDataManager
        data={filteredData}
        columns={columns}
        isUserTable={false}
        handleAct1={handleAccept}
        handleAct2={handleReject}
        searchQuery={searchQuery}
      />
    </div>
  );
}

export default Permit;
