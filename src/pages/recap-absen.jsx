import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../redux/headerSlice";
import DatePickerComponent from "../components/input/DatePickerMonth";
import ExportButtonsComponent from "../features/export/Export";
import TableComponent from "../components/table/TableAttendance";
import moment from "moment";
import CustomSelect from "../components/input/Select";
import axios from "axios";
import {
  exportCSV,
  exportExcel,
  exportPdf,
  fetchDataAttendanceRecords,
  fetchDataClassOption,
} from "../app/api/v1/admin-services";
import { fetchDataSubjectAttendanceRecords } from "../app/api/v1/teacher-services";

import { fetchChildDataAttendanceRecords } from "../app/api/v1/parent-services";

const holidays = [
  // { date: "02-09-2024", description: "Independence Day" },
  // { date: "16-09-2024", description: "Holiday Event" },
];
const RecapAbsensi = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const parent_user = useSelector((state) => state.auth.parent);
  const child = useSelector((state) => state.header.child);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [SubjectOptions, setSubjectOptions] = useState([]);
  const [cleared, setCleared] = useState(false);
  const [data, setData] = useState([]);
  const dt = useRef(null);

  const handleDateChange = (event) => {
    setSelectedDate(event);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataClassOption(
        user,
        setClassOptions,
        setSubjectOptions,
        setSelectedClass,
        setSelectedSubject
      );
    };
    fetchData();
  }, []);

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

  const handleCSVExport = () => {
    exportCSV(data, selectedDate, selectedClass);
  };
  const handleExcelExport = () => {
    exportExcel(data, selectedDate, selectedClass);
  };

  const columns = generateColumns(selectedDate);

  const handlePDFExport = async () => {
    await exportPdf(data, selectedDate, selectedClass, user, parent_user);
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Rekapitulasi Absensi" }));
  }, []);

  useEffect(() => {
    if (parent_user != null) {
      fetchChildDataAttendanceRecords(selectedDate, child, holidays, setData);
    } else {
      if (user == null || user.class != null) {
        fetchDataAttendanceRecords(
          selectedDate,
          selectedClass,
          holidays,
          setData
        );
      } else {
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
              {parent_user == null && (
                <>
                  <CustomSelect
                    value={selectedClass}
                    size="medium"
                    onChange={handleClassChange}
                    options={classOptions}
                  />
                  {user != null && user.class == null && (
                    <CustomSelect
                      value={selectedSubject}
                      size="medium"
                      onChange={handleSubjectChange}
                      options={SubjectOptions}
                    />
                  )}
                </>
              )}
            </div>
            <ExportButtonsComponent
              exportCSV={handleCSVExport}
              exportExcel={handleExcelExport}
              exportPdf={handlePDFExport}
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
