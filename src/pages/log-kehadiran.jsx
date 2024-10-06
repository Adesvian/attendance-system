import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../components/table/TableAttendance";
import ExportButtonsComponent from "../features/export/Export";
import { setPageTitle } from "../redux/headerSlice";
import {
  fetchAttendanceData,
  fetchSubjectAttendanceData,
  exportCSV,
  exportExcel,
  exportPdf,
} from "../app/api/v1/teacher-services";
import {
  fetchChildAttendanceData,
  fetchChildSubjectAttendanceData,
} from "../app/api/v1/parent-services";
import { FaSearch } from "react-icons/fa";

function LogKehadiran() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.teacher);
  const parent_user = useSelector((state) => state.auth.parent);
  const dt = useRef(null);
  const dts = useRef(null);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [activeTab, setActiveTab] = useState(
    parent_user
      ? "attendance"
      : !user
      ? "attendance"
      : user.class
      ? "attendance"
      : "subject"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Determine tabs based on user.class
  const tabs =
    parent_user || !user || user.class
      ? [
          {
            id: "attendance",
            label: "Attendance",
            data: data,
            columns: columns,
            ref: dt,
            exportFunction: (ref) => (
              <ExportButtonsComponent
                exportCSV={() => exportCSV(ref)}
                exportExcel={() => exportExcel(ref)}
                exportPdf={() => exportPdf(ref)}
              />
            ),
          },
          {
            id: "subject",
            label: "Subject",
            data: data2,
            columns: columns2,
            ref: dts,
            exportFunction: (ref) => (
              <ExportButtonsComponent
                exportCSV={() => exportCSV(ref)}
                exportExcel={() => exportExcel(ref)}
                exportPdf={() => exportPdf(ref)}
              />
            ),
          },
        ]
      : [
          {
            id: "subject",
            label: "Subject",
            data: data2,
            columns: columns2,
            ref: dts,
            exportFunction: (ref) => (
              <ExportButtonsComponent
                exportCSV={() => exportCSV(ref)}
                exportExcel={() => exportExcel(ref)}
                exportPdf={() => exportPdf(ref)}
              />
            ),
          },
        ];

  const loadData = async () => {
    const attendanceData = parent_user
      ? await fetchChildAttendanceData(parent_user)
      : await fetchAttendanceData(user);
    const subjectAttendanceData = parent_user
      ? await fetchChildSubjectAttendanceData(parent_user)
      : await fetchSubjectAttendanceData(user);

    setData(attendanceData);
    setData2(subjectAttendanceData);
  };

  useEffect(() => {
    loadData();
    setColumns([
      { field: "profile", header: "Gender" },
      { field: "student_name", header: "Nama" },
      { field: "class", header: "Kelas" },
      { field: "method", header: "Metode" },
      { field: "status", header: "Status" },
      { field: "time", header: "Waktu" },
    ]);
    setColumns2([
      { field: "profile", header: "Gender" },
      { field: "student_name", header: "Nama" },
      { field: "class", header: "Kelas" },
      { field: "subject", header: "Mata Pelajaran" },
      { field: "time", header: "Waktu" },
    ]);

    dispatch(setPageTitle({ title: "Log Kehadiran" }));
  }, [dispatch, user]);

  const filteredData = tabs
    .find((tab) => tab.id === activeTab)
    ?.data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <>
      <div className="relative mb-14 lg:mb-0">
        <FaSearch className="absolute right-[17.3rem] top-[.8rem] z-10 text-md text-gray-300 dark:text-gray-600" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="absolute right-4 w-72 mb-4 pl-10 p-2 border dark:border-gray-600 rounded-md dark:bg-base-100"
        />
      </div>
      <div role="tablist" className="tabs tabs-bordered tabs-md lg:tabs-lg">
        {tabs.map((tab) => (
          <React.Fragment key={tab.id}>
            <input
              type="radio"
              name="tab_logs"
              className={`tab [--tab-bg:#fff] [--tab-border-color:#fff] dark:[--tab-bg:#1D232A] dark:[--tab-border-color:#1D232A] ${
                activeTab === tab.id
                  ? "text-[#383838] dark:text-[#f1f1f1]"
                  : "text-[#8e8e8e]"
              }`}
              role="tab"
              aria-label={tab.label}
              defaultChecked={activeTab === tab.id}
              onChange={() => setActiveTab(tab.id)}
            />
            <div
              role="tabpanel"
              className={`tab-content bg-white dark:bg-base-100 rounded-box ${
                activeTab === tab.id ? "" : "hidden"
              }`}
            >
              <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 mt-3 lg:-mt-10">
                <div className="flex justify-end gap-x-1 lg:relative lg:right-[23rem] lg:top-[3rem]">
                  {tab.exportFunction(tab.ref)}
                </div>
                <TableComponent
                  ref={tab.ref}
                  data={filteredData || tab.data}
                  columns={tab.columns}
                  getStatusClass={(status) => {
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
                  }}
                  type="logs-table"
                />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default LogKehadiran;
