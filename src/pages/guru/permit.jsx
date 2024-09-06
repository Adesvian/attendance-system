import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import Button from "@mui/material/Button";
import TableDataManager from "../../components/table/table";
import Swal from "sweetalert2";
import CustomSelect from "../../components/input/Select";
import { MdOutlineAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

function Permit() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const handleAccept = (row) => {
    const dateToEpoch = (dateString) => {
      const date = new Date(dateString);
      return Math.floor(date.getTime() / 1000);
    };
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
            `${import.meta.env.VITE_BASE_URL_BACKEND}/permitsudpateStatus/${
              row.id
            }`,
            {
              ...row,
              date: dateToEpoch(row.date),
              status: "Accepted",
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
    const dateToEpoch = (dateString) => {
      const date = new Date(dateString);
      return Math.floor(date.getTime() / 1000);
    };
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
            `${import.meta.env.VITE_BASE_URL_BACKEND}/permitsudpateStatus/${
              row.id
            }`,
            {
              ...row,
              date: dateToEpoch(row.date),
              status: "Rejected",
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
    const fetchData = async () => {
      try {
        // Fetch class data only for the current teacher
        const { data: classesData } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/classschedule?teacherid=${encodeURIComponent(user.nid)}`
        );

        const { data: allClassesData } = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/classes`
        );

        // Get unique class names based on teacher login
        const classString = [
          ...new Set(classesData.map((item) => item.class_id)),
        ]
          .map((id) => allClassesData.find((c) => c.id === id)?.name)
          .filter(Boolean) // Filter out undefined values
          .join(",");

        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/permits?class=${encodeURIComponent(
            user.class != "" ? user.class : classString
          )}`
        );
        const convertedData = response.data
          .map((item) => ({
            ...item,
            date: moment(item.date * 1000).format("YYYY-MM-DD"),
          }))
          .sort((a, b) => b.id - a.id);

        setData(convertedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const newColumns = [
      { field: "name", header: "Name" },
      { field: "class", header: "Kelas" },
      { field: "reason", header: "Alasan" },
      { field: "attachment", header: "Lampiran" },
      { field: "date", header: "Date" },
      { field: "status", header: "Status" },
    ];

    // Hanya tambahkan kolom action jika user.class tidak kosong
    if (user.class != "") {
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
