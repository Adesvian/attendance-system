import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLogs,
  logger,
  saveAsExcelFile,
} from "../../app/api/v1/admin-services";
import { setPageTitle } from "../../redux/headerSlice";
import TableDataManager from "../../components/table/table";
import ExportButtonsComponent from "../../features/export/Export";
import Swal from "sweetalert2";
import SearchAndButton from "../../components/input/header-search";

function Logs() {
  const dispatch = useDispatch();
  const location = window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    .replace(/-/g, " ");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedData, setDisplayedData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCSVExport = async () => {
    try {
      const { unparse } = await import("papaparse");
      const { saveAs } = await import("file-saver");

      const csv = unparse(displayedData);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(
        blob,
        `Logs Sistem-${new Date().getFullYear()}-${new Date().toLocaleString(
          "en-US",
          { month: "long" }
        )}.csv`
      );
      await logger({
        activity: `Export ${location} file into CSV `,
      });
      fetchLogs(setData);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Woopsie!",
        text: `Terjadi kesalahan saat mengunduh file.`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleExcelExport = async () => {
    try {
      const xlsx = await import("xlsx");

      const worksheet = xlsx.utils.json_to_sheet(displayedData);

      const wb = { Sheets: { data: worksheet }, SheetNames: ["data"] };

      const excelBuffer = xlsx.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(
        excelBuffer,
        `Logs Sistem-${new Date().getFullYear()}-${new Date().toLocaleString(
          "en-US",
          { month: "long" }
        )}.xlsx`
      );
      await logger({
        activity: `Export ${location} file into Excel`,
      });
      fetchLogs(setData);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Woopsie!",
        text: `Terjadi kesalahan saat mengunduh file.`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handlePDFExport = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      const doc = new jsPDF("landscape", "pt", "a4");

      const title = `Log Sistem | ${new Date().getFullYear()} ${new Date().toLocaleString(
        "en-US",
        { month: "long" }
      )}`;
      doc.text(title, 40, 40);

      doc.setFontSize(11);
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width || pageSize.getWidth();
      const metadata = doc.splitTextToSize(
        `Download Time : ${new Date().toLocaleString(
          "en-US"
        )}\nUser Download : admin`,
        pageWidth - 35
      );
      doc.text(metadata, 40, 60);

      const tableHeader = columns.map((col) => col.header);
      const tableData = displayedData.map((row) =>
        columns.map((col) => row[col.field] || "")
      );

      const columnStyles = columns.map((col) => {
        if (col.field === "activity") {
          return { halign: "left" };
        } else {
          return { halign: "center" };
        }
      });

      doc.autoTable({
        head: [tableHeader],
        body: tableData,
        startY: 100,
        styles: {
          fontSize: 10,
          halign: "center",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
        },
        columnStyles: columnStyles.reduce((acc, style, index) => {
          acc[index] = style;
          return acc;
        }, {}),
      });

      doc.save(`Logs Sistem.pdf`);
      await logger({
        activity: `Export ${location} file into PDF`,
      });
      fetchLogs(setData);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Woopsie!",
        text: `Terjadi kesalahan saat mengunduh file.`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    fetchLogs(setData);
    setColumns([
      { field: "id", header: "ID" },
      { field: "user", header: "User" },
      { field: "activity", header: "Activity" },
      { field: "date_time", header: "Date" },
    ]);
    dispatch(setPageTitle({ title: "Log Sistem" }));
  }, []);

  return (
    <>
      <div data-testid="teacher-element">
        <SearchAndButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Menggunakan Stack dengan direction row dan justifyContent flex-end untuk posisi ke kanan */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ marginTop: 2, justifyContent: "flex-end" }}
        >
          {/* Dropdown Rows per page */}
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(e.target.value)}
              label="Rows per page"
            >
              <MenuItem value={data.length}>All</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          {/* Export Buttons */}
          <ExportButtonsComponent
            exportCSV={handleCSVExport}
            exportExcel={handleExcelExport}
            exportPdf={handlePDFExport}
          />
        </Stack>

        {/* Table Data */}
        <TableDataManager
          data={data}
          columns={columns}
          searchQuery={searchQuery}
          rowsPerPage={rowsPerPage} // Menggunakan state rowsPerPage yang sudah ada
          setDisplayedData={setDisplayedData}
        />
      </div>
    </>
  );
}

export default Logs;
