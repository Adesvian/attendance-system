import React, { useState, useEffect } from "react";
import { BsClipboardCheck, BsSortUpAlt, BsSortDown } from "react-icons/bs";
import moment from "moment";
import { fetchRecentStudents } from "../../app/api/v1/admin-services";
import { useSelector } from "react-redux";

const getRelativeTime = (time) => moment.unix(time).fromNow();

const RecentAttendance = ({
  data,
  initialRowsPerPage = 5,
  initialSortOrder = "desc",
}) => {
  const user = useSelector((state) => state.auth.teacher);
  const parent = useSelector((state) => state.auth.parent);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  useEffect(() => {
    fetchRecentStudents(setStudents, setError, setLoading);
  }, []);

  const toggleSortOrder = () =>
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));

  const sortedData = [...data].sort((a, b) =>
    sortOrder === "desc" ? a.date - b.date : b.date - a.date
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="bg-white h-[32rem] w-full overflow-y-auto dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-dark-text p-4 border dark:border-[#2B3039] dark:border-[2px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold">Logs Presence</div>
            <p className="text-sm mt-2">Kehadiran terkini pada hari ini</p>
          </div>
          <div className="stat-figure flex-shrink-0 rounded-[22px] p-4 bg-indigo-200 text-indigo-600">
            <BsClipboardCheck className="w-7 h-7" />
          </div>
        </div>
        <div className="flex justify-between mb-3 text-sm">
          <div className="flex items-center">
            <label
              htmlFor="rowsPerPage"
              className="mr-2 text-gray-500 dark:text-gray-300"
            >
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="cursor-pointer border bg-transparent rounded-md p-1"
            >
              {[5, 10, 15, 20].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleSortOrder}
              className="cursor-pointer border bg-transparent rounded-md p-1 flex items-center"
            >
              {sortOrder === "asc" ? <BsSortDown /> : <BsSortUpAlt />}
            </button>
          </div>
        </div>
        <div>
          {sortedData.slice(0, rowsPerPage).map((attendance, index) => {
            const student = students.find(
              (student) => student.name === attendance.student.name
            );
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 mb-2 bg-gray-100 dark:bg-gray-800 rounded-md"
              >
                <div className="flex items-center gap-3 text-gray-900 dark:text-dark-text">
                  <img
                    src={`assets/icon/${
                      student.gender === "Perempuan" ? "girl" : "boy"
                    }-icon.png`}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-sm font-medium leading-snug pb-0.5">
                      {attendance.student.name}{" "}
                      <span className="text-gray-400">
                        dari {attendance.student.class.name} telah{" "}
                        {!attendance.method ? (
                          <span className="text-green-500">
                            Tap Kartu{" "}
                            {parent && (
                              <span className="text-gray-400">
                                di pelajaran {attendance.subject.name}
                              </span>
                            )}
                          </span>
                        ) : attendance.method === 1001 ? (
                          <span className="text-green-500">check in</span>
                        ) : (
                          <span className="text-red-500">check out</span>
                        )}
                      </span>
                    </h2>
                    <h3 className="text-gray-400 text-xs font-normal leading-4">
                      {attendance.method !== 1002 && (
                        <span>
                          {!attendance.status ? (
                            ""
                          ) : attendance.status === 200 ? (
                            <span>On time | </span>
                          ) : (
                            <span>Late | </span>
                          )}
                        </span>
                      )}
                      {getRelativeTime(attendance.date)}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RecentAttendance;
