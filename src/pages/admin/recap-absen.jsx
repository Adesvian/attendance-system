import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import DatePickerComponent from "../../components/input/DatePickerMonth";
import ClassSelectorComponent from "../../components/input/Selector";
import ExportButtonsComponent from "../../features/export/ExportButton";
import TableComponent from "../../components/table/TableAttendance";
import moment from "moment";

const sampleRecords = [
  {
    name: "user 1",
    date: 1723050000,
    class: "Kelas 1",
    method: "check-in",
    status: 200,
  },
  {
    name: "user 2",
    date: 1723050000,
    class: "Kelas 1",
    method: "check-in",
    status: 201,
  },
  {
    name: "user 3",
    date: 1723050000,
    class: "Kelas 1",
    method: "check-in",
    status: 201,
  },
  {
    name: "user 4",
    date: 1723050000,
    class: "Kelas 1",
    method: "check-in",
    status: 200,
  },
  {
    name: "user 5",
    date: 1723050000,
    class: "Kelas 1",
    method: "check-in",
    status: 200,
  },
];

const holidays = [
  // { date: "2024-08-17", description: "Independence Day" },
  // { date: "2024-08-19", description: "Holiday Event" },
];
const RecapAbsensi = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [cleared, setCleared] = useState(false);
  const [data, setData] = useState([]);
  const dt = useRef(null);
  const dispatch = useDispatch();
  const localTheme = useSelector((state) => state.header.theme);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const fetchData = () => {
    if (selectedDate && selectedClass) {
      const selectedMonth = moment(selectedDate).month();
      const selectedYear = moment(selectedDate).year();
      const daysInMonth = moment(selectedDate).daysInMonth();
      const today = moment().startOf("day");

      const processedRecords = sampleRecords.map((record) => ({
        ...record,
        date: moment.unix(record.date).format("YYYY-MM-DD"),
      }));

      const holidayDates = holidays.map((holiday) =>
        moment(holiday.date, "YYYY-MM-DD")
      );

      const filteredData = processedRecords.filter((record) => {
        const recordDate = moment(record.date, "YYYY-MM-DD");
        return (
          recordDate.month() === selectedMonth &&
          recordDate.year() === selectedYear &&
          record.class === selectedClass
        );
      });

      const methodMap = {
        "check-in": "H",
        "-": "-",
        izin: "I",
        sakit: "S",
        alfa: "A",
        libur: "L", // For Saturday and Sunday
      };

      const formattedData = filteredData.reduce((acc, record) => {
        const student = acc.find((s) => s.name === record.name);
        const recordDate = moment(record.date, "YYYY-MM-DD").startOf("day");
        const dayIndex = recordDate.date() - 1;
        let method = methodMap[record.method] || "-";

        if (student) {
          student.attendance[dayIndex] = method;
        } else {
          const attendance = Array(daysInMonth).fill("-"); // Default to "-" for future dates

          attendance.forEach((_, index) => {
            const currentDate = moment(selectedDate)
              .date(index + 1)
              .startOf("day");
            const dayOfWeek = currentDate.day();
            const isHoliday = holidayDates.some((holidayDate) =>
              holidayDate.isSame(currentDate, "day")
            );

            if (isHoliday) {
              attendance[index] = methodMap["libur"];
            } else if (dayOfWeek === 0 || dayOfWeek === 6) {
              attendance[index] = methodMap["libur"];
            }
          });

          attendance[dayIndex] = method;
          acc.push({
            name: record.name,
            attendance,
            hadir: 0,
            absen: 0,
            izin: 0,
            sakit: 0,
            percentage: 0, // Add percentage field
          });
        }
        return acc;
      }, []);

      formattedData.forEach((student) => {
        student.attendance = student.attendance.map((status, index) => {
          const currentDate = moment(selectedDate)
            .date(index + 1)
            .startOf("day");
          const dayOfWeek = currentDate.day();
          const isHoliday = holidayDates.some((holidayDate) =>
            holidayDate.isSame(currentDate, "day")
          );

          if (isHoliday && status === "-") {
            return methodMap["libur"];
          } else if ((dayOfWeek === 0 || dayOfWeek === 6) && status === "-") {
            return methodMap["libur"];
          } else if (currentDate.isBefore(today) && status === "-") {
            return methodMap["alfa"];
          }
          return status;
        });

        student.hadir = student.attendance.filter(
          (status) => status === "H"
        ).length;
        student.absen = student.attendance.filter(
          (status) => status === "A"
        ).length;
        student.izin = student.attendance.filter(
          (status) => status === "I"
        ).length;
        student.sakit = student.attendance.filter(
          (status) => status === "S"
        ).length;

        const totalDays = student.attendance.length;
        const holidaysCount = holidayDates.filter(
          (holidayDate) =>
            holidayDate.month() === selectedMonth &&
            holidayDate.year() === selectedYear
        ).length;
        const weekendsCount = student.attendance.filter((_, index) => {
          const currentDate = moment(selectedDate)
            .date(index + 1)
            .startOf("day");
          return currentDate.day() === 0 || currentDate.day() === 6;
        }).length;

        const effectiveDays = totalDays - holidaysCount - weekendsCount;
        student.percentage = ((student.hadir / effectiveDays) * 100).toFixed(1);
      });

      setData(formattedData);
    } else {
      setData([]);
    }
  };

  const generateColumns = () => {
    const daysInMonth = selectedDate ? moment(selectedDate).daysInMonth() : 0;
    const cols = [
      { field: "name", header: "Nama" },
      ...Array.from({ length: daysInMonth }, (_, i) => ({
        field: `day${i + 1}`,
        header: `${i + 1}`, // Kolom hari dengan angka
      })),
      { field: "hadir", header: "Hadir" },
      { field: "absen", header: "Absen" },
      { field: "izin", header: "Izin" },
      { field: "sakit", header: "Sakit" },
      { field: "percentage", header: "Kehadiran (%)" }, // Add percentage column
    ];
    return cols;
  };

  const columns = generateColumns();

  const exportColumns = columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportCSV = async () => {
    try {
      // Impor papaparse dan file-saver secara dinamis
      const { unparse } = await import("papaparse");
      const { saveAs } = await import("file-saver");

      // Dapatkan jumlah hari dalam bulan yang dipilih
      const daysInMonth = moment(selectedDate).daysInMonth();

      // Buat header kolom untuk file CSV
      const headers = [
        "Nama",
        ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`), // Tanggal
        "Hadir",
        "Absen",
        "Izin",
        "Sakit",
        "Kehadiran (%)",
      ];

      // Buat data baris untuk file CSV
      const rows = data.map((row) => [
        row.name,
        ...row.attendance,
        row.hadir,
        row.absen,
        row.izin,
        row.sakit,
        row.percentage,
      ]);

      // Tambahkan header ke baris data
      const csv = unparse([headers, ...rows]);

      // Buat file CSV dan simpan
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(
        blob,
        `rekap-absensi-${moment(selectedDate).format(
          "YYYY-MMMM"
        )}-${selectedClass}.csv`
      );
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const exportPdf = async () => {
    try {
      // Import jsPDF and jsPDF-AutoTable modules
      const { default: jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      // Menggunakan ukuran kertas 'a3'
      const doc = new jsPDF("landscape", "pt", "a3");

      const tableData = data.map((row) => {
        const rowData = { name: row.name };
        row.attendance.forEach((att, i) => {
          rowData[`day${i + 1}`] = att;
        });
        rowData.hadir = row.hadir;
        rowData.absen = row.absen;
        rowData.izin = row.izin;
        rowData.sakit = row.sakit;
        rowData.percentage = row.percentage;
        return rowData;
      });

      // Menambahkan header dengan nama bulan dan kelas
      const title = `Rekap Absensi - ${moment(selectedDate).format(
        "MMMM YYYY"
      )} - ${selectedClass}`;
      doc.text(title, 40, 40);

      doc.setFontSize(11);
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width || pageSize.getWidth();
      const text = doc.splitTextToSize(
        `Download Time : ${moment().format(
          "DD-MM-YYYY HH:mm:ss"
        )}\nUser Download : ${
          JSON.parse(localStorage.getItem("token")).name
        }\n`,
        pageWidth - 35
      );
      doc.text(text, 40, 60);

      doc.autoTable({
        head: [exportColumns.map((col) => col.title)],
        body: tableData.map((row) =>
          exportColumns.map((col) => row[col.dataKey])
        ),
        startY: 85,
        margin: { left: 40, right: 40 },
      });

      doc.save(
        `rekap-absensi-${moment(selectedDate).format(
          "YYYY-MMMM"
        )}-${selectedClass}.pdf`
      );
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  const exportExcel = async () => {
    try {
      // Import xlsx module
      const xlsx = await import("xlsx");

      // Get the number of days in the selected month
      const daysInMonth = moment(selectedDate).daysInMonth();

      // Create headers for the columns
      const headers = [
        "Nama",
        ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`), // Dates
        "Hadir",
        "Absen",
        "Izin",
        "Sakit",
        "Kehadiran (%)",
      ];

      // Generate day names for the second row based on the selected month and year
      const dayNames = [
        "Nama",
        ...Array.from({ length: daysInMonth }, (_, i) =>
          moment()
            .year(moment(selectedDate).year())
            .month(moment(selectedDate).month())
            .date(i + 1)
            .format("ddd")
        ), // Weekday names
        "", // Placeholder for Hadir
        "", // Placeholder for Absen
        "", // Placeholder for Izin
        "", // Placeholder for Sakit
      ];

      // Prepare data rows
      const rows = data.map((row) => [
        row.name, // Nama
        ...row.attendance, // Days
        row.hadir,
        row.absen,
        row.izin,
        row.sakit,
        row.percentage,
      ]);

      // Create worksheet
      const ws = xlsx.utils.aoa_to_sheet([headers, dayNames, ...rows]);

      // Set header row styles and merges
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Merge Nama header
        { s: { r: 0, c: daysInMonth + 1 }, e: { r: 1, c: daysInMonth + 1 } }, // Merge Hadir header
        { s: { r: 0, c: daysInMonth + 2 }, e: { r: 1, c: daysInMonth + 2 } }, // Merge Absen header
        { s: { r: 0, c: daysInMonth + 3 }, e: { r: 1, c: daysInMonth + 3 } }, // Merge Izin header
        { s: { r: 0, c: daysInMonth + 4 }, e: { r: 1, c: daysInMonth + 4 } }, // Merge Sakit header
        { s: { r: 0, c: daysInMonth + 5 }, e: { r: 1, c: daysInMonth + 5 } }, // Merge Percentage header
      ];

      // Adjust column widths (optional)
      ws["!cols"] = [
        { width: 20 }, // Nama
        ...Array.from({ length: daysInMonth }, () => ({ width: 5 })), // Days
        { width: 10 }, // Hadir
        { width: 10 }, // Absen
        { width: 10 }, // Izin
        { width: 10 }, // Sakit
        { width: 15 }, // Percentage
      ];

      // Create workbook
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      // Save the Excel file
      saveAsExcelFile(
        excelBuffer,
        `rekap-absensi-${moment(selectedDate).format(
          "YYYY-MMMM"
        )}-${selectedClass}`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const saveAsExcelFile = async (buffer, fileName) => {
    try {
      // Import file-saver module
      const { default: FileSaver } = await import("file-saver");

      const EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], { type: EXCEL_TYPE });

      FileSaver.saveAs(data, `${fileName}_export${EXCEL_EXTENSION}`);
    } catch (error) {
      console.error("Error saving Excel file:", error);
    }
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Rekapitulasi Absensi" }));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedClass]);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [cleared]);

  const getStatusClass = (status) => {
    switch (status) {
      case "H":
        return "text-emerald-500";
      case "A":
        return "text-rose-500";
      case "I":
        return "text-indigo-500";
      case "L":
        return "text-rose-100 bg-rose-700";
      default:
        return "";
    }
  };

  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-6 mt-5 ">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4 col-span-2">
        <div className="flex gap-x-4 mb-4 font-poppins">
          <DatePickerComponent
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            setCleared={setCleared}
            localTheme={localTheme}
          />
          <ClassSelectorComponent
            selectedClass={selectedClass}
            handleClassChange={handleClassChange}
          />
        </div>
        <ExportButtonsComponent
          exportCSV={exportCSV}
          exportExcel={exportExcel}
          exportPdf={exportPdf}
        />
        <TableComponent
          ref={dt}
          data={data}
          columns={columns}
          getStatusClass={getStatusClass}
          type="recap"
        />
      </div>
    </div>
  );
};

export default RecapAbsensi;
