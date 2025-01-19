import React, { useEffect, useState, useCallback, forwardRef } from "react";
import DoughnutChart from "../chart/DoughnutChart";
import GaugeChart from "../chart/GaugeChart";
import { TbClockCheck, TbClockExclamation } from "react-icons/tb";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiRfid } from "react-icons/bi";
import { BsClipboardX } from "react-icons/bs";
import {
  fetchAttendanceDetailStudent,
  getGender,
  ImrpovementAttendanceOfStudent,
} from "../../app/api/v1/admin-services";

const StudentDetail = forwardRef(({ data }, ref) => {
  const [student, setStudent] = useState({ class: "", person: {} });
  const [attendance, setAttendance] = useState({
    attendance: [],
    hadir: 0,
    absen: 0,
    izin: 0,
    sakit: 0,
    percentage: "0",
    avgCheckIn: "",
    improvement: "",
    avgrate: "",
  });
  const [chartData, setChartData] = useState({
    completed: 0,
    remaining: 0,
  });
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [partialLogs, setPartialLogs] = useState({});
  const date = data.selectedDate;
  const [gender, setGender] = useState("");

  // Gunakan useCallback untuk menghindari pembuatan ulang fungsi fetch setiap render
  const fetchAttendanceLogs = useCallback(
    async (rfid) => {
      try {
        await fetchAttendanceDetailStudent(rfid, date, setAttendanceLogs);
        await getGender(rfid, setGender);
      } catch (error) {
        console.error("Error fetching attendance logs:", error);
      }
    },
    [data]
  );

  // Effect untuk inisialisasi data student dan attendance awal
  useEffect(() => {
    if (data) {
      const { selectedClass, personalData } = data;

      const isAllDataFilled = Object.values(personalData || {}).every(
        (value) => value !== "" && value !== null
      );

      if (isAllDataFilled && personalData.id) {
        // Reset state
        setPartialLogs({ OnTime: 0, Late: 0 }); // Reset partial logs saat student berubah
        setStudent({ class: selectedClass, person: personalData });
        setAttendance({
          attendance: personalData.attendance,
          hadir: personalData.hadir,
          absen: personalData.absen,
          izin: personalData.izin,
          sakit: personalData.sakit,
          percentage: personalData.percentage,
        });

        // Fetch attendance logs
        fetchAttendanceLogs(personalData.id);

        // Fetch attendance records
        ImrpovementAttendanceOfStudent(date, personalData.id, (result) => {
          setAttendance((prevAttendance) => ({
            ...prevAttendance,
            avgrate: result.averagePercentage.toFixed(2),
            improvement: result.improvement,
          }));
        });
      }
    }
  }, [data]);

  // Effect untuk update chart data
  useEffect(() => {
    if (attendance && Array.isArray(attendance.attendance)) {
      const effectiveDays = attendance.attendance.filter(
        (status) => status !== "L"
      ).length;

      setChartData({
        completed: attendance.hadir,
        remaining: effectiveDays - attendance.hadir,
      });
    }
  }, [attendance]);

  // Effect untuk kalkulasi average check-in time
  useEffect(() => {
    if (attendanceLogs.length > 0 && !attendance.avgCheckIn) {
      // Filter untuk Check In dengan status "Tepat Waktu"
      const onTimeCheckIns = attendanceLogs.filter(
        (log) => log.method === "Check In" && log.status === "Tepat Waktu"
      ).length;

      // Filter untuk Check In dengan status "Telat"
      const lateCheckIns = attendanceLogs.filter(
        (log) => log.method === "Check In" && log.status === "Telat"
      ).length;

      // Update state dengan object
      setPartialLogs({
        OnTime: onTimeCheckIns,
        Late: lateCheckIns,
      });

      // hanya update jika avgCheckIn belum ada
      const checkInLogs = attendanceLogs.filter(
        (log) => log.method === "Check In"
      );

      if (checkInLogs.length > 0) {
        const timeInMinutes = checkInLogs.map((log) => {
          const timePart = log.date.split(", ")[1].split(":");
          const hours = parseInt(timePart[0], 10);
          const minutes = parseInt(timePart[1], 10);
          return hours * 60 + minutes;
        });

        const totalMinutes = timeInMinutes.reduce(
          (sum, minutes) => sum + minutes,
          0
        );
        const averageMinutes = totalMinutes / timeInMinutes.length;

        const averageHours = Math.floor(averageMinutes / 60);
        const averageRemainingMinutes = Math.round(averageMinutes % 60);

        setAttendance((prevAttendance) => ({
          ...prevAttendance,
          avgCheckIn: `${averageHours
            .toString()
            .padStart(2, "0")}:${averageRemainingMinutes
            .toString()
            .padStart(2, "0")}`,
        }));
      }
    }
  }, [attendanceLogs]);

  if (!student || !attendance) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div ref={ref} className="my-10">
        <div className="grid md:grid-cols-3 grid-cols-1 md:gap-4 gap-y-4 print:grid-cols-3 print:gap-4">
          <div className="bg-white dark:bg-base-300 shadow-md rounded-lg p-6 ">
            <div className="h-auto flex items-center justify-center">
              <DoughnutChart data={chartData} />
            </div>
          </div>

          <div className="lg:col-span-2 col-span-3 bg-white dark:bg-base-300 shadow-md rounded-lg p-6 print:col-span-2">
            <div className="flex flex-col md:flex-row gap-x-9 print:flex-row">
              <div className="flex flex-col items-center w-full md:w-1/2 lg:w-1/5 print:w-1/5">
                <img
                  src={`./assets/icon/${
                    gender === "girl" ? "girl" : "boy"
                  }-icon.png`}
                  alt="profile-picture"
                  className="w-24 md:w-full rounded-full object-cover shadow-md print:w-full"
                />
                <div className="flex flex-row w-52 lg:w-44 mx-auto gap-x-2 justify-center items-center mt-3  text-gray-800 dark:text-dark-text print:w-44">
                  <p className="font-medium text-base lg:text-sm print:text-sm ">
                    {student.person.name}
                  </p>
                  <div className="border-l-2 border-gray-300 h-4 "></div>
                  <p className="font-medium">{student.class}</p>
                </div>
              </div>

              <div className="hidden md:block border-l-2 border-gray-300 h-32 print:block"></div>

              <div className="flex flex-row gap-x-8 my-5 lg:my-0 print:my-0">
                <div className="flex flex-col gap-2 items-center text-gray-800 dark:text-dark-text">
                  <div className="bg-emerald-100 rounded-3xl w-16 h-16 flex items-center justify-center">
                    <BiRfid className="text-emerald-600 w-8 h-8" />
                  </div>
                  <p className="font-bold text-2xl ">
                    {attendance?.avgCheckIn ? attendance.avgCheckIn : "..."}
                  </p>
                  <p className="font-semibold text-sm">Avg Check In Time</p>
                </div>

                <div className="flex flex-col gap-2 items-center text-gray-800 dark:text-dark-text">
                  <div className="bg-rose-100 rounded-3xl w-16 h-16 flex items-center justify-center">
                    <BsClipboardX className="text-rose-600 w-8 h-8" />
                  </div>
                  <p className=" font-bold text-2xl">{attendance.absen}</p>
                  <p className=" font-semibold text-sm">Absen</p>
                </div>
              </div>

              <div className="hidden md:block border-l-2 border-gray-300 h-32 print:block"></div>

              <div className="w-full lg:w-auto flex items-center justify-center lg:mx-auto lg:-mt-10 print:w-auto">
                {attendance?.improvement !== undefined ? (
                  <GaugeChart
                    value={Math.max(0, Math.min(100, attendance.improvement))}
                    min={0}
                    max={100}
                    title="Improvement in Attendance"
                    tooltip="Improvement berdasarkan data 3 bulan terakhir"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-20">
                    <span className="loading loading-ring loading-lg"></span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-between items-center mt-8 print:flex-row">
              <div className="flex flex-row gap-x-8">
                <div className="flex flex-col gap-2 items-center text-gray-800 dark:text-dark-text">
                  <div className="bg-emerald-100 rounded-3xl w-16 h-16 flex items-center justify-center">
                    <TbClockCheck className="text-emerald-600 w-8 h-8" />
                  </div>
                  <p className="font-bold text-2xl">{partialLogs.OnTime}</p>
                  <p className="font-semibold text-sm">On Time</p>
                </div>
                <div className="flex flex-col gap-2 items-center text-gray-800 dark:text-dark-text">
                  <div className="bg-rose-100 rounded-3xl w-16 h-16 flex items-center justify-center">
                    <TbClockExclamation className="text-rose-600 w-8 h-8" />
                  </div>
                  <p className="font-bold text-2xl">{partialLogs.Late}</p>
                  <p className="font-semibold text-sm">Late</p>
                </div>
              </div>
              <div className="hidden md:block border-l-2 border-gray-300 h-32 print:block"></div>
              <div className="flex flex-row gap-x-8">
                <div className="flex flex-col gap-2 items-center text-gray-800 dark:text-dark-text">
                  <div className="bg-amber-100 rounded-3xl w-16 h-16 flex items-center justify-center">
                    <IoDocumentTextOutline className="text-amber-600 w-8 h-8" />
                  </div>
                  <p className="font-bold text-2xl">{attendance.izin}</p>
                  <p className="font-semibold text-sm">Izin</p>
                </div>
                <div className="flex flex-col gap-2 items-center text-gray-800 dark:text-dark-text ">
                  <div className="bg-gray-100 rounded-3xl w-16 h-16 flex items-center justify-center">
                    <IoDocumentTextOutline className="text-gray-600 w-8 h-8" />
                  </div>
                  <p className="font-bold text-2xl">{attendance.sakit}</p>
                  <p className="font-semibold text-sm">Sakit</p>
                </div>
              </div>
              <div className="hidden md:block border-l-2 border-gray-300 h-32 print:block"></div>
              <div className="w-full lg:w-48 flex items-center justify-center print:w-48">
                {attendance?.avgrate !== undefined ? (
                  <GaugeChart
                    value={Math.max(0, Math.min(100, attendance.avgrate))}
                    min={0}
                    max={100}
                    title="Avg Presence Rate"
                    tooltip="Average berdasarkan data 3 bulan terakhir"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-20">
                    <span className="loading loading-ring loading-lg"></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-3 bg-white dark:bg-base-300 shadow-md rounded-lg p-6 ">
            <div className="overflow-x-auto">
              <table className="table text-center">
                <thead className="text-gray-500 text-md">
                  <tr>
                    <th>No</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs && attendanceLogs.length > 0 ? (
                    attendanceLogs.map((log, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{log.method}</td>
                        <td>{log.status}</td>
                        <td>{log.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No attendance logs available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <style type="text/css" media="print">
        {`
          @page {
            size: 313.6mm 236.3mm; /* Executive size */
          }
          /* Optional: Add any additional print-specific styles */
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
    </>
  );
});
export default StudentDetail;
