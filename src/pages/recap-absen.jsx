import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../redux/headerSlice";
import DatePickerComponent from "../components/input/DatePickerMonth";
import ExportButtonsComponent from "../features/export/Export";
import TableComponent from "../components/table/TableAttendance";
import moment from "moment";
import CustomSelect from "../components/input/Select";
import {
  exportCSV,
  exportExcel,
  exportPdf,
  fetchDataAttendanceRecords,
  fetchDataClassOption,
} from "../app/api/v1/admin-services";
import { fetchDataSubjectAttendanceRecords } from "../app/api/v1/teacher-services";
import { fetchChildDataAttendanceRecords } from "../app/api/v1/parent-services";
import Swal from "sweetalert2";
import axiosInstance from "../app/api/auth/axiosConfig";
import StudentDetail from "../features/student-information/Student";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from "react-icons/fa6";

const RecapAbsensi = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const parent_user = useSelector((state) => state.auth.parent);
  const child = useSelector((state) => state.header.child);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [SubjectOptions, setSubjectOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([
    { value: "", label: "Pilih Siswa", disabled: true },
  ]);
  const [cleared, setCleared] = useState(false);
  const [data, setData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const dt = useRef(null);
  const [isClassSelected, setIsClassSelected] = useState(false);
  const [personalData, setPersonalData] = useState([]);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "AwesomeFileName",
  });

  const handleDateChange = (event) => {
    setSelectedDate(event);
  };

  const handleClassChange = async (event) => {
    const selectedClass = event.target.value;

    // Reset dropdown siswa dan selectedStudent
    setStudentOptions([{ value: "", label: "Pilih Siswa", disabled: true }]);
    setSelectedStudent("");

    if (selectedClass === "") {
      setIsClassSelected(false);
      setSelectedClass("");
      return; // Hentikan jika kelas tidak dipilih
    }

    try {
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/students?class=${selectedClass}`
      );

      const formattedData = response.data.data.map((item) => ({
        value: item.rfid,
        label: item.name,
      }));

      setStudentOptions([
        { value: "", label: "Pilih Siswa", disabled: true },
        ...formattedData,
      ]);
    } catch (error) {
      console.error("Error fetching students:", error);
    }

    setIsClassSelected(true);
    setSelectedClass(selectedClass);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
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
      { field: "percentage", header: "Kehadiran (%)" },
    ];
    return cols;
  };

  const handleCSVExport = () => {
    if (selectedDate == null || selectedClass == null) {
      Swal.fire({
        icon: "error",
        title: "Woopsie!",
        text: `Pilih periode ${
          user == null ? "dan kelas" : ""
        } terlebih dahulu`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    exportCSV(data, selectedDate, selectedClass);
  };
  const handleExcelExport = () => {
    if (selectedDate == null || selectedClass == null) {
      Swal.fire({
        icon: "error",
        title: "Woopsie!",
        text: `Pilih periode ${
          user == null ? "dan kelas" : ""
        } terlebih dahulu`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    exportExcel(data, selectedDate, selectedClass);
  };

  const columns = generateColumns(selectedDate);

  const handlePDFExport = async () => {
    if (selectedDate == null || selectedClass == null) {
      Swal.fire({
        icon: "error",
        title: "Woopsie!",
        text: `Pilih periode ${
          user == null ? "dan kelas" : ""
        } terlebih dahulu`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    await exportPdf(data, selectedDate, selectedClass, user, parent_user);
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Rekapitulasi Absensi" }));
    const fetchData = async () => {
      await fetchDataClassOption(
        user,
        setClassOptions,
        setSubjectOptions,
        setSelectedClass,
        setSelectedSubject
      );

      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/events`
        );
        const formattedHolidays = response.data.data.map((holiday) => ({
          date: moment(holiday.date).format("DD-MM-YYYY"),
          description: holiday.description,
        }));
        setHolidays(formattedHolidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (parent_user != null) {
      fetchChildDataAttendanceRecords(selectedDate, child, holidays, setData);
    } else {
      if (user == null) {
        fetchDataAttendanceRecords(
          selectedDate,
          selectedClass,
          holidays,
          setData
        );
      } else if (user.class != null && selectedClass == user.class.id) {
        fetchDataAttendanceRecords(
          selectedDate,
          selectedClass,
          holidays,
          setData
        );
      } else if (user.class == null || selectedClass != user.class.id) {
        fetchDataSubjectAttendanceRecords(
          selectedDate,
          selectedClass,
          selectedSubject,
          user,
          holidays,
          setData
        );
      }
    }
  }, [selectedDate, selectedClass, selectedSubject, child]);

  useEffect(() => {
    // Pastikan semua kondisi terpenuhi sebelum mengisi personalData
    if (selectedDate && selectedClass && selectedStudent) {
      const student = data.find((i) => i.id === selectedStudent);
      if (student) {
        setPersonalData(student);
      } else {
        setPersonalData([]); // Kosongkan jika siswa tidak ditemukan
      }
      setCustomClass("hidden");
    } else {
      setCustomClass("");
    }
  }, [selectedDate, selectedClass, selectedStudent, data]);

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
      <div
        className="sticky top-0 bg-white rounded-md dark:bg-base-100 pl-4 pt-4 pr-4 pb-0.5 "
        data-testid="recap-absen-element"
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-4 font-poppins">
          <DatePickerComponent
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            setCleared={setCleared}
          />
          {parent_user == null && (
            <>
              <CustomSelect
                value={selectedClass}
                size="medium"
                onChange={handleClassChange}
                options={classOptions}
              />
              <CustomSelect
                value={selectedStudent}
                size="medium"
                onChange={handleStudentChange}
                options={studentOptions}
                name={isClassSelected}
              />
              {user != null && user.class == null && (
                <CustomSelect
                  value={selectedSubject}
                  size="medium"
                  onChange={handleSubjectChange}
                  options={SubjectOptions}
                />
              )}
              {(user != null && user.class == null) ||
                user == null ||
                (selectedClass != user.class.id && (
                  <CustomSelect
                    value={selectedSubject}
                    size="medium"
                    onChange={handleSubjectChange}
                    options={SubjectOptions}
                  />
                ))}
            </>
          )}
        </div>
        {!selectedStudent && !selectedDate && !selectedClass && (
          <ExportButtonsComponent
            exportCSV={handleCSVExport}
            exportExcel={handleExcelExport}
            exportPdf={handlePDFExport}
          />
        )}
        {selectedStudent && selectedDate && selectedClass && (
          <button
            className="flex items-center justify-end w-full"
            onClick={handlePrint}
          >
            <FaPrint className="text-black dark:text-dark-text w-5 h-5" />
          </button>
        )}
      </div>
      <div className="px-4 pb-5 bg-white dark:bg-base-100">
        <div
          className={`grid grid-cols-3 lg:grid-cols-12 font-poppins text-sm mt-5 lg:text-base lg:mt-0 whitespace-nowrap ${
            selectedDate && selectedClass && !selectedStudent ? "" : "hidden"
          }`}
        >
          <p>
            <span className="font-bold">H</span> : Hadir
          </p>
          <p>
            <span className="font-bold">A</span> : Absen
          </p>
          <p>
            <span className="font-bold">L</span> : Libur
          </p>
          <p>
            <span className="font-bold">I</span> : Izin
          </p>
          <p>
            <span className="font-bold">S</span> : Sakit
          </p>
        </div>
        <TableComponent
          ref={dt}
          data={data}
          columns={columns}
          getStatusClass={getStatusClass}
          className={customClass}
          type="recap"
        />
        {selectedStudent && selectedDate && selectedClass && (
          <StudentDetail
            ref={componentRef}
            data={{
              personalData,
              selectedClass,
              selectedDate,
              selectedStudent,
            }}
          />
        )}
      </div>
    </>
  );
};

export default RecapAbsensi;
