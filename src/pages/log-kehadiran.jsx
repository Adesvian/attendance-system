import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../components/table/TableAttendance";
import ExportButtonsComponent from "../features/export/Export";
import { setPageTitle } from "../redux/headerSlice";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import moment from "moment";
import axios from "axios";

function LogKehadiran() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const dt = useRef(null);
  const dts = useRef(null);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columns2, setColumns2] = useState([]);

  const exportPdf = async (fn) => {
    const data = fn.current;
    console.log(data);
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

  const exportCSV = async (fn) => {
    const data = fn.current;
    if (data) {
      try {
        const { unparse } = await import("papaparse");
        const { saveAs } = await import("file-saver");

        let rows = [];
        let headers = [];

        // Get table header
        const headerCells = data.querySelectorAll("th");
        headerCells.forEach((cell) => {
          let headerText = cell.innerText;
          // Replace 'Profile' with 'ID'
          if (headerText === "Profile") {
            headerText = "ID";
          }
          headers.push(headerText);
        });

        // Add headers to rows
        rows.push(headers);

        // Get table body rows
        let i = 1;
        const tableRows = data.querySelectorAll("tbody tr");
        tableRows.forEach((row) => {
          const rowData = [];
          row.querySelectorAll("td").forEach((cell, index) => {
            let cellText = cell.innerText;
            // Replace profile data with incremented ID
            if (index === 0) {
              cellText = i++;
            }
            rowData.push(cellText);
          });
          rows.push(rowData);
        });

        // Convert rows to CSV format using PapaParse
        const csv = unparse(rows);

        // Create a blob and save as CSV file
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `Logs-Records-${moment().format("DD-MM-YYYY")}.csv`);
      } catch (error) {
        console.error("Error exporting CSV: ", error);
      }
    } else {
      console.error("Table ref is not available.");
    }
  };

  const exportExcel = async (fn) => {
    const data = fn.current;
    if (data) {
      try {
        // Import libraries dynamically
        const { utils, writeFile } = await import("xlsx");

        let rows = [];
        let headers = [];

        // Get table header
        const headerCells = data.querySelectorAll("th");
        headerCells.forEach((cell) => {
          let headerText = cell.innerText;
          // Replace 'Profile' with 'ID'
          if (headerText === "Profile") {
            headerText = "ID";
          }
          headers.push(headerText);
        });

        // Add headers to rows
        rows.push(headers);

        // Get table body rows
        let i = 1;
        const tableRows = data.querySelectorAll("tbody tr");
        tableRows.forEach((row) => {
          const rowData = [];
          row.querySelectorAll("td").forEach((cell, index) => {
            let cellText = cell.innerText;
            // Replace profile data with incremented ID
            if (index === 0) {
              cellText = i++;
            }
            rowData.push(cellText);
          });
          rows.push(rowData);
        });

        // Create a new worksheet
        const worksheet = utils.aoa_to_sheet(rows);

        // Create a new workbook and append the worksheet
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Logs Records");

        // Write the workbook to an Excel file
        writeFile(
          workbook,
          `Logs-Records-${moment().format("DD-MM-YYYY")}.xlsx`
        );
      } catch (error) {
        console.error("Error exporting Excel: ", error);
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
      case "Checked Out":
        return "text-gray-400";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let attendance = null;

        attendance = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance?class=${
            user != null && user.class != null ? user.class.id : ""
          }`
        );

        const updatedData = attendance.data.data.map((record) => ({
          ...record,
          profile: `assets/icon/${
            record.student.gender === "Perempuan" ? "girl" : "boy"
          }-icon.png`,
          student_name: record.student.name,
          class: record.student.class.name,
          status:
            record.method === 1002 && record.status === 200
              ? "Checked Out"
              : record.status === 200
              ? "On Time"
              : "Late",

          method: record.method === 1001 ? "Check-In" : "Check-Out",
          time: moment.unix(record.date).local().format("DD-MM-YYYY HH:mm:ss"),
          unixTime: record.date,
        }));
        const sortedData = updatedData.sort((a, b) => b.unixTime - a.unixTime);
        setData(sortedData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDataSubject = async () => {
      try {
        let subattendance, classes;

        if (user != null) {
          classes = await axios.get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/class-schedule?teacherid=${user.nid}`
          );
          const uniquesClass = [
            ...new Set(classes.data.data.map((item) => item.class_id)),
          ];
          const classParams = uniquesClass.join(",");
          const uniqueSubject = [
            ...new Set(classes.data.data.map((item) => item.subject_id)),
          ];
          const subjectParams = uniqueSubject.join(",");

          subattendance = await axios.get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/subject-attendance?class=${
              user != null && user.class != null
                ? classParams
                : user.class == null
                ? classParams
                : ""
            }&subject=${
              user != null && user.class != null
                ? subjectParams
                : user.class == null
                ? subjectParams
                : ""
            }`
          );
        } else {
          classes = await axios.get(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule`
          );
          subattendance = await axios.get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/subject-attendance?class=${
              user != null && user.class != null ? classParams : ""
            }&subject=${
              user != null && user.class != null ? subjectParams : ""
            }`
          );
        }

        const classSubjectMap = classes.data.data.map((item) => ({
          class_id: item.class_id,
          subject_id: item.subject_id,
        }));

        const recrods = subattendance.data.data.filter((attendance) => {
          return classSubjectMap.some(
            (taught) =>
              taught.class_id === attendance.class_id &&
              taught.subject_id === attendance.subject_id
          );
        });

        const updatedData = recrods.map((record) => ({
          ...record,
          profile: `assets/icon/${
            record.student.gender === "Perempuan" ? "girl" : "boy"
          }-icon.png`,
          student_name: record.student.name,
          class: record.student.class.name,
          subject: record.subject.name,
          time: moment.unix(record.date).local().format("DD-MM-YYYY HH:mm:ss"),
          unixTime: record.date,
        }));
        const sortedData = updatedData.sort((a, b) => b.unixTime - a.unixTime);
        setData2(sortedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    fetchDataSubject();
    setColumns([
      { field: "profile", header: "Profile" },
      { field: "student_name", header: "Nama" },
      { field: "class", header: "Kelas" },
      { field: "method", header: "Metode" },
      { field: "status", header: "Status" },
      { field: "time", header: "Waktu" },
    ]);
    setColumns2([
      { field: "profile", header: "Profile" },
      { field: "student_name", header: "Nama" },
      { field: "class", header: "Kelas" },
      { field: "subject", header: "Mata Pelajaran" },
      { field: "time", header: "Waktu" },
    ]);

    dispatch(setPageTitle({ title: "Log Kehadiran" }));
  }, []);
  return (
    <div role="tablist" className="tabs tabs-lifted tabs-lg">
      {/* If user is null, show Attendance and Subject tabs */}
      {user == null || user.class != null ? (
        <>
          <input
            type="radio"
            name="tab_logs"
            role="tab"
            className="tab [--tab-bg:white] [--tab-border-color:white] dark:[--tab-bg:#1D232A] dark:[--tab-border-color:#1D232A] !text-[#a9a9a9]"
            aria-label="Attendance"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-white dark:bg-base-100 rounded-box p-6"
          >
            <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 lg:-mt-10">
              <div className="flex justify-end gap-x-1 lg:relative lg:right-[23rem] lg:top-[3rem]">
                <ExportButtonsComponent
                  exportCSV={() => exportCSV(dt)}
                  exportExcel={() => exportExcel(dt)}
                  exportPdf={() => exportPdf(dt)}
                />
              </div>
              <TableComponent
                ref={dt}
                data={data}
                columns={columns}
                getStatusClass={getStatusClass}
                type="logs-table"
              />
            </div>
          </div>

          <input
            type="radio"
            name="tab_logs"
            className="tab [--tab-bg:white] [--tab-border-color:white] dark:[--tab-bg:#1D232A] dark:[--tab-border-color:#1D232A] !text-[#a9a9a9]"
            role="tab"
            aria-label="Subject"
          />
          <div
            role="tabpanel"
            className="tab-content bg-white dark:bg-base-100 rounded-box p-6"
          >
            <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 lg:-mt-10">
              <div className="flex justify-end gap-x-1 lg:relative lg:right-[23rem] lg:top-[3rem]">
                <ExportButtonsComponent
                  exportCSV={() => exportCSV(dts)}
                  exportExcel={() => exportExcel(dts)}
                  exportPdf={() => exportPdf(dts)}
                />
              </div>
              <TableComponent
                ref={dts}
                data={data2}
                columns={columns2}
                getStatusClass={getStatusClass}
                type="logs-table"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* If user has no class, show Subject tab only */}
          <input
            type="radio"
            name="tab_logs"
            className="tab [--tab-bg:white] [--tab-border-color:white] dark:[--tab-bg:#1D232A] dark:[--tab-border-color:#1D232A] !text-[#a9a9a9]"
            role="tab"
            aria-label="Subject"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-white dark:bg-base-100 rounded-box p-6"
          >
            <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 lg:-mt-10">
              <div className="flex justify-end gap-x-1 lg:relative lg:right-[23rem] lg:top-[3rem]">
                <ExportButtonsComponent
                  exportCSV={() => exportCSV(dts)}
                  exportExcel={() => exportExcel(dts)}
                  exportPdf={() => exportPdf(dts)}
                />
              </div>
              <TableComponent
                ref={dts}
                data={data2}
                columns={columns2}
                getStatusClass={getStatusClass}
                type="logs-table"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LogKehadiran;
