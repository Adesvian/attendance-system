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
  const [activeTab, setActiveTab] = useState("attendance");

  const tabs = [
    {
      id: "attendance",
      label: "Attendance",
      data: data,
      columns: columns,
      ref: dt,
      exportFunction: (ref) => (
        <>
          <ExportButtonsComponent
            exportCSV={() => exportCSV(ref)}
            exportExcel={() => exportExcel(ref)}
            exportPdf={() => exportPdf(ref)}
          />
        </>
      ),
    },
    {
      id: "subject",
      label: "Subject",
      data: data2,
      columns: columns2,
      ref: dts,
      exportFunction: (ref) => (
        <>
          <ExportButtonsComponent
            exportCSV={() => exportCSV(ref)}
            exportExcel={() => exportExcel(ref)}
            exportPdf={() => exportPdf(ref)}
          />
        </>
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
  }, [dispatch, user]);

  return (
    <div role="tablist" className="tabs tabs-lifted tabs-lg">
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
            className={`tab-content bg-white dark:bg-base-100 rounded-box p-6 ${
              activeTab === tab.id ? "" : "hidden"
            }`}
          >
            <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 lg:-mt-10">
              <div className="flex justify-end gap-x-1 lg:relative lg:right-[23rem] lg:top-[3rem]">
                {tab.exportFunction(tab.ref)}
              </div>
              <TableComponent
                ref={tab.ref}
                data={tab.data}
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
  );
}

export default LogKehadiran;
