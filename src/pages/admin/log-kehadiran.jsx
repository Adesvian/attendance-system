import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import TableComponent from "../../components/table/TableAttendance";
import { setPageTitle } from "../../redux/headerSlice";
import SingleButton from "../../components/button/Button";
import { MdFileDownload } from "react-icons/md";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import moment from "moment";

function LogKehadiran() {
  const dispatch = useDispatch();
  const dt = useRef(null);

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const logRecords = [
    {
      profile: "https://img.daisyui.com/images/profile/demo/2@94.webp",
      name: "John Doe",
      className: "Kelas 1",
      status: "Late",
      method: "Check-in",
      time: 1722446357,
    },
    {
      profile: "https://img.daisyui.com/images/profile/demo/3@94.webp",
      name: "Hanan Smith",
      className: "Kelas 2",
      status: "On Time",
      method: "Check-in",
      time: 1722646337,
    },
    {
      profile: "https://img.daisyui.com/images/profile/demo/4@94.webp",
      name: "Bob Smith",
      className: "Kelas 3",
      status: "On Time",
      method: "Check-in",
      time: 1722646327,
    },
    {
      profile: "https://img.daisyui.com/images/profile/demo/5@94.webp",
      name: "Hanan Smith",
      className: "Kelas 2",
      status: "On Time",
      method: "Check-in",
      time: 1722646337,
    },
    {
      profile: "https://img.daisyui.com/images/profile/demo/5@94.webp",
      name: "Bob Smith",
      className: "Kelas 3",
      status: "On Time",
      method: "Check-in",
      time: 1722646327,
    },
  ];
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
            JSON.parse(localStorage.getItem("token")).name +
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

        pdf.save("table.pdf");
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
    setData(
      logRecords.map((record) => ({
        ...record,
        time: moment.unix(record.time).local().format("DD-MM-YYYY HH:mm"),
      }))
    );
    setColumns([
      { field: "profile", header: "Profile" },
      { field: "name", header: "Name" },
      { field: "className", header: "Kelas" },
      { field: "status", header: "Status" },
      { field: "method", header: "Method" },
      { field: "time", header: "Time" },
    ]);
    dispatch(setPageTitle({ title: "Log Kehadiran" }));
  }, [dispatch]);

  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4 col-span-2">
        <div className="flex justify-end lg:absolute lg:right-[25rem]">
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
  );
}

export default LogKehadiran;
