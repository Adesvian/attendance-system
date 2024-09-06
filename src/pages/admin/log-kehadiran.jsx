import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../components/table/TableAttendance";
import { setPageTitle } from "../../redux/headerSlice";
import SingleButton from "../../components/button/Button";
import { MdFileDownload } from "react-icons/md";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import moment from "moment";
import axios from "axios";
import { decodeJWT } from "../../app/auth";

function LogKehadiran() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const dt = useRef(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const exportPdf = async () => {
    const data = dt.current;
    if (data) {
      try {
        var pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text("Logs Records #" + moment().format("DD-MM-YYYY"), 14, 22);
        pdf.setFontSize(11);
        pdf.setTextColor(100);

        var pageSize = pdf.internal.pageSize;
        var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        var text = pdf.splitTextToSize(
          "Download Time : " +
            moment().format("DD-MM-YYYY HH:mm:ss") +
            "\n" +
            "User Download : " +
            (user ? user.name : "admin") +
            "\n",
          pageWidth - 35,
          {}
        );
        pdf.text(text, 14, 30);

        let i = 1;
        const tableElement = data.cloneNode(true); // Clone the table to avoid modifying the original

        // Update the header to replace 'Profile' with 'ID'
        const headerCells = tableElement.querySelectorAll("th");
        headerCells.forEach((cell) => {
          if (cell.innerText === "Profile") {
            cell.innerText = "ID";
          }
        });

        // Update the table rows to replace profile with id
        const tableRows = tableElement.querySelectorAll("tbody tr");
        tableRows.forEach((row) => {
          const profileCell = row.querySelector("td");
          if (profileCell) {
            profileCell.innerText = i++;
          }
        });

        autotable(pdf, { html: tableElement, startY: 40 });

        pdf.save(`Logs-Records-${moment().format("DD-MM-YYYY")}.pdf`);
      } catch (error) {
        console.error("Error generating PDF: ", error);
      }
    } else {
      console.error("Table ref is not available.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Late":
        return "text-red-600";
      case "On Time":
        return "text-green-600";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attendance data
        const attendanceResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance`
        );

        // Fetch student data
        const studentsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/students`
        );
        const studentsMap = {};
        studentsResponse.data.forEach((student) => {
          studentsMap[student.name] = student.gender; // Adjust the property names based on your API response
        });

        const updatedData = attendanceResponse.data.map((record) => ({
          ...record,
          profile: `assets/icon/${
            studentsMap[record.student_name] === "Perempuan" ? "girl" : "boy"
          }-icon.png`,
          status: record.status === 200 ? "On Time" : "Late",
          method: record.method === 1001 ? "Check-In" : "Check-Out",
          gender: studentsMap[record.gender], // Assuming name is the field in your attendance record
          time: moment.unix(record.date).local().format("DD-MM-YYYY HH:mm"),
          unixTime: record.date, // Keep the raw unix time for sorting
        }));
        const sortedData = updatedData.sort((a, b) => b.unixTime - a.unixTime);
        setData(sortedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    setColumns([
      { field: "profile", header: "Profile" },
      { field: "student_name", header: "Name" },
      { field: "class", header: "Kelas" },
      { field: "method", header: "Method" },
      { field: "status", header: "Status" },
      { field: "time", header: "Time" },
    ]);
    dispatch(setPageTitle({ title: "Log Kehadiran" }));
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-6 mt-5">
        <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4 col-span-2">
          <div className="flex justify-end lg:relative lg:right-[23rem] lg:top-[3rem] -mt-11">
            <SingleButton
              btnTitle={<MdFileDownload />}
              className="btn border-none bg-blue-500 rounded-full text-white "
              onClick={exportPdf}
            />
          </div>
          <TableComponent
            ref={dt}
            data={data}
            columns={columns}
            getStatusClass={getStatusClass}
            type="standard"
          />
        </div>
      </div>
    </>
  );
}

export default LogKehadiran;
