import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import DatePickerComponent from "../../components/input/DatePickerMonth";
import ClassSelectorComponent from "../../components/input/Selector";
import ExportButtonsComponent from "../../features/recap/ExportButton";
import TableComponent from "../../features/recap/Table";
import moment from "moment";

const RecapAbsensi = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [cleared, setCleared] = useState(false);
  const [data, setData] = useState([]);
  const dt = useRef(null);
  const dispatch = useDispatch();
  const localTheme = useSelector((state) => state.header.theme);

  const sampleRecords = [
    {
      name: "Hana Hermawan Gantari",
      date: "2022-01-01",
      class: "Kelas 1",
      status: "check-in",
    },
    {
      name: "Student 2",
      date: "2022-01-01",
      class: "Kelas 1",
      status: "check-in",
    },
    {
      name: "Student 3",
      date: "2022-01-01",
      class: "Kelas 1",
      status: "check-in",
    },
    {
      name: "Student 4",
      date: "2022-01-02",
      class: "Kelas 1",
      status: "check-in",
    },
    {
      name: "Student 4",
      date: "2022-01-16",
      class: "Kelas 1",
      status: "check-in",
    },
    {
      name: "Student 4",
      date: "2022-01-15",
      class: "Kelas 1",
      status: "check-in",
    },
    {
      name: "Student 4",
      date: "2022-01-12",
      class: "Kelas 1",
      status: "izin",
    },
    {
      name: "Student 4",
      date: "2022-01-17",
      class: "Kelas 1",
      status: "sakit",
    },
    {
      name: "Student 1",
      date: "2022-01-03",
      class: "Kelas 1",
      status: "check-in",
    },
    {
      name: "Student 2",
      date: "2022-01-04",
      class: "Kelas 2",
      status: "check-in",
    },
    {
      name: "Student 3",
      date: "2022-01-02",
      class: "Kelas 3",
      status: "check-in",
    },
    {
      name: "Student 4",
      date: "2022-01-02",
      class: "Kelas 4",
      status: "check-in",
    },
    {
      name: "Student 3",
      date: "2022-01-08",
      class: "Kelas 3",
      status: "izin",
    },
    {
      name: "Student 3",
      date: "2022-01-09",
      class: "Kelas 3",
      status: "izin",
    },
    {
      name: "Student 3",
      date: "2022-01-10",
      class: "Kelas 3",
      status: "izin",
    },
    {
      name: "Student 4",
      date: "2022-01-08",
      class: "Kelas 4",
      status: "izin",
    },
    {
      name: "Student 4",
      date: "2022-01-09",
      class: "Kelas 4",
      status: "Sakit",
    },
  ];

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const fetchData = () => {
    // Fetch data logic here
    if (selectedDate && selectedClass) {
      const selectedMonth = moment(selectedDate).month();
      const selectedYear = moment(selectedDate).year();
      const daysInMonth = moment(selectedDate).daysInMonth();

      const filteredData = sampleRecords.filter((record) => {
        const recordDate = moment(record.date, "YYYY-MM-DD");
        return (
          recordDate.month() === selectedMonth &&
          recordDate.year() === selectedYear &&
          record.class === selectedClass
        );
      });

      // Map status to corresponding abbreviations
      const statusMap = {
        "check-in": "P",
        "-": "A",
        izin: "I",
        sakit: "S",
      };

      // Format data for table
      const formattedData = filteredData.reduce((acc, record) => {
        const student = acc.find((s) => s.name === record.name);
        const dayIndex = moment(record.date).date() - 1;
        const status = statusMap[record.status] || "-";

        if (student) {
          student.attendance[dayIndex] = status;
          student[record.status]++;
        } else {
          const attendance = Array(daysInMonth).fill("A"); // Default to "A" for absent
          attendance[dayIndex] = status;
          acc.push({
            name: record.name,
            attendance,
            hadir: status === "P" ? 1 : 0,
            absen: status === "A" ? 1 : 0,
            izin: status === "I" ? 1 : 0,
            sakit: status === "S" ? 1 : 0,
          });
        }
        return acc;
      }, []);

      // Aggregate counts for each student
      const aggregatedData = formattedData.map((row) => {
        const counts = {
          hadir: 0,
          absen: 0,
          izin: 0,
          sakit: 0,
        };
        row.attendance.forEach((status) => {
          if (status === "P") counts.hadir++;
          else if (status === "A") counts.absen++;
          else if (status === "I") counts.izin++;
          else if (status === "S") counts.sakit++;
        });

        return { ...row, ...counts };
      });

      setData(aggregatedData);
    } else {
      setData([]);
    }
  };

  const generateColumns = () => {
    // Generate columns logic here
    const daysInMonth = selectedDate ? moment(selectedDate).daysInMonth() : 0;
    const cols = [
      { field: "name", header: "Nama" }, // Kolom nama
      ...Array.from({ length: daysInMonth }, (_, i) => ({
        field: `day${i + 1}`,
        header: `${i + 1}`, // Kolom hari dengan angka
      })),
      { field: "hadir", header: "Hadir" },
      { field: "absen", header: "Absen" },
      { field: "izin", header: "Izin" },
      { field: "sakit", header: "Sakit" },
    ];
    return cols;
  };

  const columns = generateColumns();

  const exportColumns = columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportPdf = () => {
    // Export to PDF logic here
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        // Menggunakan ukuran kertas 'a3'
        const doc = new jsPDF.default("landscape", "pt", "a3");

        const tableData = data.map((row) => {
          const rowData = { name: row.name };
          row.attendance.forEach((att, i) => {
            rowData[`day${i + 1}`] = att;
          });
          rowData.hadir = row.hadir;
          rowData.absen = row.absen;
          rowData.izin = row.izin;
          rowData.sakit = row.sakit;
          return rowData;
        });

        // Menambahkan header dengan nama bulan dan kelas
        const title = `Rekap Absensi - ${moment(selectedDate).format(
          "MMMM YYYY"
        )} - ${selectedClass}`;
        doc.text(title, 40, 40);

        doc.autoTable({
          head: [exportColumns.map((col) => col.title)],
          body: tableData.map((row) =>
            exportColumns.map((col) => row[col.dataKey])
          ),
          startY: 60,
          margin: { left: 40, right: 40 },
        });

        doc.save(
          `rekap-absensi-${moment(selectedDate).format(
            "YYYY-MMMM"
          )}-${selectedClass}.pdf`
        );
      });
    });
  };

  const exportExcel = () => {
    // Export to Excel logic here
    import("xlsx").then((xlsx) => {
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
      ];

      // Adjust column widths (optional)
      ws["!cols"] = [
        { width: 20 }, // Nama
        ...Array.from({ length: daysInMonth }, () => ({ width: 5 })), // Days
        { width: 10 }, // Hadir
        { width: 10 }, // Absen
        { width: 10 }, // Izin
        { width: 10 }, // Sakit
      ];

      // Create workbook
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(
        excelBuffer,
        `rekap-absensi-${moment(selectedDate).format(
          "YYYY-MMMM"
        )}-${selectedClass}`
      );
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(data, `${fileName}_export_${EXCEL_EXTENSION}`);
      }
    });
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
      case "P":
        return "text-emerald-500";
      case "A":
        return "text-rose-500";
      case "I":
        return "text-indigo-500";
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
          dt={dt}
          exportExcel={exportExcel}
          exportPdf={exportPdf}
        />
        <TableComponent
          dt={dt}
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
