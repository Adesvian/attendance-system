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
        // Fetch class data only for the current teacher
        const { data: classes } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/class-schedule?teacherid=${encodeURIComponent(user.nid)}`
        );

        const uniqueClass = [
          ...new Set(classes.data.map((item) => item.class_id)),
        ];
        const classParams = uniqueClass.join(",");

        if (classParams.length === 0) {
          setData([]);
          return;
        }
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/permits?class=${encodeURIComponent(
            user.class != null ? user.class.id : classParams
          )}`
        );

        const convertedData = await Promise.all(
          response.data.data.map(async (item) => {
            const studentResponse = await axios.get(
              `${import.meta.env.VITE_BASE_URL_BACKEND}/students/${
                item.student_rfid
              }`
            );
            const student = studentResponse.data;

            return {
              ...item,
              name: student.data.name,
              class: "Kelas " + item.class_id,
              status:
                item.status === 300
                  ? "Pending"
                  : item.status === 200
                  ? "Accepted"
                  : "Rejected",
              date: moment(item.date * 1000).format("YYYY-MM-DD"),
            };
          })
        );

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
