import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import TableComponent from "../../features/recap/Table";
import { setPageTitle } from "../../redux/headerSlice";
import SingleButton from "../../components/button/singleButton";
import { MdFileDownload } from "react-icons/md";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import moment from "moment";

function LogKehadiran() {
  const dispatch = useDispatch();
  const dt = useRef(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const logRecords = [
    {
      profile:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      name: "John Doe",
      className: "Kelas 1",
      status: "Late",
      method: "Check-in",
      time: 1722446357,
    },
    {
      profile:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      name: "Hanan Smith",
      className: "Kelas 2",
      status: "On Time",
      method: "Check-in",
      time: 1722646337,
    },
    {
      profile:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      name: "Bob Smith",
      className: "Kelas 3",
      status: "On Time",
      method: "Check-in",
      time: 1722646327,
    },
    {
      profile:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      name: "Hanan Smith",
      className: "Kelas 2",
      status: "On Time",
      method: "Check-in",
      time: 1722646337,
    },
    {
      profile:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      name: "Bob Smith",
      className: "Kelas 3",
      status: "On Time",
      method: "Check-in",
      time: 1722646327,
    },
  ];
  const exportPdf = async () => {
    if (dt.current) {
      try {
        const canvas = await html2canvas(dt.current);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

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
            btnBg="bg-blue-500 rounded-full text-white "
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
