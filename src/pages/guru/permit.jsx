import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import Button from "@mui/material/Button";
import TableDataManager from "../../components/table/table";
import Swal from "sweetalert2";
import CustomSelect from "../../components/input/Select";
import { MdOutlineAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const logRecords = [
  {
    name: "Tokino Sora",
    kelas: "Kelas 1",
    alasan: "Sakit",
    lampiran: "surat-izin-1.jpg",
    date: "21-08-2024",
    status: "Pending",
  },
  {
    name: "Azki",
    kelas: "Kelas 2",
    alasan: "Personal",
    lampiran: "surat-izin-2.png",
    date: "20-08-2024",
    status: "Accepted",
  },
  {
    name: "Sakura Miko",
    kelas: "Kelas 3",
    alasan: "Liburan",
    lampiran: "surat-izin-3.jpg",
    date: "19-08-2024",
    status: "Rejected",
  },
];

function Permit() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [filter, setFilter] = useState("All");
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
        // Implementasi logika accept di sini
        Swal.fire("Accepted!", `Izin ${row.name} telah diterima.`, "success");
        // Update status ke "Accepted" dalam data
        setData((prevData) =>
          prevData.map((item) =>
            item.id === row.id ? { ...item, status: "Accepted" } : item
          )
        );
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
        // Implementasi logika reject di sini
        Swal.fire("Ditolak!", `Izin ${row.name} telah ditolak.`, "success");
        // Update status ke "Rejected" dalam data
        setData((prevData) =>
          prevData.map((item) =>
            item.id === row.id ? { ...item, status: "Rejected" } : item
          )
        );
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
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/permits");
        const convertedData = response.data.map((item) => ({
          ...item,
          date: moment(item.date * 1000).format("YYYY-MM-DD"),
        }));
        setData(convertedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    setColumns([
      { field: "name", header: "Name" },
      { field: "class", header: "Kelas" },
      { field: "reason", header: "Alasan" },
      { field: "attachment", header: "Lampiran" },
      { field: "date", header: "Date" },
      { field: "status", header: "Status" },
      {
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
      },
    ]);
    dispatch(setPageTitle({ title: "Ketidakhadiran" }));
  }, []);

  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4 font-poppins">
        <div className="flex lg:justify-end">
          <Button
            variant="contained"
            className="dark:bg-indigo-700 lg:flex-none flex-auto whitespace-nowrap"
            startIcon={<MdOutlineAdd />}
            onClick={() => navigate("/permit/create-permit")}
          >
            Buat Surat Izin
          </Button>
        </div>
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
        />
      </div>
    </div>
  );
}

export default Permit;
