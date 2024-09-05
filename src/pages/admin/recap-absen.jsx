import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import DatePickerComponent from "../../components/input/DatePickerMonth";
import ExportButtonsComponent from "../../features/export/Export";
import TableComponent from "../../components/table/TableAttendance";
import moment from "moment";
import CustomSelect from "../../components/input/Select";
import axios from "axios";
import { decodeJWT } from "../../app/auth";

const holidays = [
  // { date: "06-09-2024", description: "Independence Day" },
  // { date: "09-09-2024", description: "Holiday Event" },
];
const RecapAbsensi = () => {
  const user = useSelector((state) => state.auth.teacher);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [cleared, setCleared] = useState(false);
  const [data, setData] = useState([]);
  const dt = useRef(null);
  const dispatch = useDispatch();

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const fetchData = async () => {
    if (selectedDate && selectedClass) {
      try {
        const studentsResponse = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/students?class=${encodeURIComponent(selectedClass)}`
        );
        const students = studentsResponse.data;

        const attendanceResponse = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/attendance?class=${encodeURIComponent(selectedClass)}&method=1001`
        );
        const attendanceRecords = attendanceResponse.data;

        const selectedMonth = moment(selectedDate).month();
        const selectedYear = moment(selectedDate).year();
        const daysInMonth = moment(selectedDate).daysInMonth();
        const today = moment().startOf("day");

        const processedRecords = attendanceRecords.map((record) => ({
          ...record,
          date: moment.unix(record.date).format("YYYY-MM-DD"),
        }));

        const holidayDates = holidays.map((holiday) =>
          moment(holiday.date, "DD-MM-YYYY")
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
          1001: "H",
          "-": "-",
          izin: "I",
          sakit: "S",
          alfa: "A",
          libur: "L",
        };

        const formattedData = students.map((student) => {
          const attendance = Array(daysInMonth).fill("-");

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

          // Temukan semua catatan kehadiran untuk siswa ini
          const studentAttendanceRecords = filteredData.filter(
            (record) => record.student_name === student.name
          );

          // Tandai setiap record kehadiran
          studentAttendanceRecords.forEach((record) => {
            const recordDate = moment(record.date, "YYYY-MM-DD").startOf("day");
            const dayIndex = recordDate.date() - 1;
            let method = methodMap[record.method] || "-";
            attendance[dayIndex] = method;
          });

          return {
            name: student.name,
            attendance,
            hadir: 0,
            absen: 0,
            izin: 0,
            sakit: 0,
            percentage: 0,
          };
        });

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
          student.percentage = ((student.hadir / effectiveDays) * 100).toFixed(
            1
          );
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setData([]);
      }
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
        )}\nUser Download : ${decodeJWT(user).name}\n`,
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
  }, []);

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
    <>
      <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-6 mt-5">
        <div
          className={`bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white  col-span-2 ${
            data && data.length > 0 ? "max-h-[80vh] overflow-auto" : ""
          }`}
        >
          <div className="sticky top-0 bg-white rounded-md dark:bg-base-100 pl-4 pt-4 pr-4 pb-0.5">
            <div className="flex gap-x-3 mb-4 font-poppins">
              <DatePickerComponent
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                setCleared={setCleared}
              />
              <CustomSelect
                value={selectedClass}
                size="medium"
                onChange={handleClassChange}
                options={[
                  { value: "", label: "Pilih Kelas" },
                  { value: "Kelas 1", label: "Kelas 1" },
                  { value: "Kelas 2", label: "Kelas 2" },
                  { value: "Kelas 3", label: "Kelas 3" },
                  { value: "Kelas 4", label: "Kelas 4" },
                  { value: "Kelas 5", label: "Kelas 5" },
                  { value: "Kelas 6", label: "Kelas 6" },
                ]}
              />
            </div>
            <ExportButtonsComponent
              exportCSV={exportCSV}
              exportExcel={exportExcel}
              exportPdf={exportPdf}
            />
          </div>

          <div className="px-4 pb-5 bg-white dark:bg-base-100">
            <TableComponent
              ref={dt}
              data={data}
              columns={columns}
              getStatusClass={getStatusClass}
              type="recap"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecapAbsensi;
