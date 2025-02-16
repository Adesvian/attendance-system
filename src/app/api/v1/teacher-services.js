import moment from "moment";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import axiosInstance from "../auth/axiosConfig";
import Swal from "sweetalert2";
import { logger } from "./admin-services";

export const fetchDataDashboard = async (
  setData,
  setLoading,
  setError,
  user
) => {
  try {
    setLoading(true);

    const fetchDataFromApi = async (endpoint) => {
      const { data } = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/${endpoint}`
      );
      return data;
    };

    const classes = await fetchDataFromApi(
      `class-schedule?teacherid=${user.nid}`
    );
    const teachingDays = Array.from(
      new Set(classes.data.map((item) => item.day))
    );

    // Mendapatkan hari ini
    const today = new Date();
    const daysOfWeek = [
      "minggu",
      "senin",
      "selasa",
      "rabu",
      "kamis",
      "jumat",
      "sabtu",
    ];
    const todayDay = daysOfWeek[today.getDay()];

    // Filter kelas berdasarkan hari ini
    const todaysClasses = classes.data.filter((item) => item.day === todayDay);

    const uniqueClass = [...new Set(classes.data.map((item) => item.class_id))];
    const uniqueSubject = [
      ...new Set(classes.data.map((item) => item.subject_id)),
    ];

    const classParams = uniqueClass.join(",");
    const [chartdata, attendance, students, permits, events] =
      await Promise.all([
        user.class != null
          ? fetchDataFromApi(
              `attendance?class=${user.class.id ? user.class.id : classParams}`
            )
          : fetchDataFromApi(
              `subject-attendance?class=${classParams}&subject=${uniqueSubject}`
            ),

        user.class != null
          ? fetchDataFromApi(
              `attendance-today?class=${
                user.class != null ? user.class.id : classParams
              }`
            )
          : fetchDataFromApi(
              `subject-attendance-today?class=${
                user.class != null ? user.class.id : classParams
              }`
            ),

        fetchDataFromApi(
          `students?class=${user.class != null ? user.class.id : classParams}`
        ),

        fetchDataFromApi(
          `permits?class=${user.class != null ? user.class.id : classParams}`
        ),

        fetchDataFromApi(`events`),
      ]);

    const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    const todayEnd = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);

    const studentCounts = await Promise.all(
      todaysClasses.map(async (classItem) => {
        const studentData = await fetchDataFromApi(
          `students?class=${classItem.class_id}`
        );
        return studentData.data.length;
      })
    );

    const totalStudentsToday = studentCounts.reduce(
      (acc, count) => acc + count,
      0
    );

    // Hitung attendance rate
    let attendanceRate;
    if (user.class !== null) {
      const presentCount = attendance.data.filter(
        (a) => a.method === 1001
      ).length;
      const totalStudents = students.data.length;
      // Cek untuk kondisi 1/0
      if (totalStudents === 0) {
        attendanceRate = 0; // Atau bisa diatur sesuai kebutuhan
      } else {
        attendanceRate = (presentCount / totalStudents) * 100;
      }
    } else {
      const totalAttendanceToday = attendance.data.length; // Total kehadiran hari ini
      // Cek untuk kondisi 0/0
      if (totalStudentsToday === 0) {
        attendanceRate = 0; // Atau bisa diatur sesuai kebutuhan
      } else {
        attendanceRate = (totalAttendanceToday / totalStudentsToday) * 100;
      }
    }

    let permitData;
    if (user.class == null) {
      permitData = permits.data
        .map((permit) => {
          const dateObject = new Date(permit.date * 1000);
          const permitDay = dateObject
            .toLocaleDateString("id-ID", { weekday: "long" })
            .toLowerCase();
          const isTeachingDay = teachingDays.includes(permitDay);

          return isTeachingDay
            ? {
                ...permit,
              }
            : null;
        })
        .filter(Boolean);
    } else {
      permitData = permits.data;
    }

    setData((prevData) => ({
      ...prevData,
      student: students.data.length,
      class: uniqueClass.length,
      subject: uniqueSubject.length,
      classschedule: classes.data.length,
      presenceRate: parseFloat(attendanceRate.toFixed(2)),
      permit: permitData.filter((permit) => permit.status === 300).length,
      absent: permitData.filter(
        (permit) =>
          permit.status === 200 &&
          permit.date >= todayStart &&
          permit.date <= todayEnd
      ).length,
      onTime: attendance.data.filter(
        (a) => a.status === 200 && a.method === 1001
      ).length,
      late: attendance.data.filter((a) => a.status === 201).length,
      attendance: attendance.data,
      events: events.data,
      chartData: chartdata.data,
    }));
  } catch (error) {
    setError(error.message || "Error fetching data.");
  } finally {
    setLoading(false);
  }
};

export const fetchDataSubjectAttendanceRecords = async (
  selectedDate,
  selectedClass,
  selectedSubject,
  user,
  holidays,
  setData
) => {
  if (!selectedDate || !selectedClass || !selectedSubject) {
    return setData([]);
  }

  try {
    const [students, classSchedule, permits] = await Promise.all([
      axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/students?class=${selectedClass}`
      ),
      axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule?teacherid=${
          user.nid
        }`
      ),
      axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/permits?class=${selectedClass}`
      ),
    ]);
    const isExtracurricular = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/subjects/${selectedSubject}`
    );
    let filteredStudents;

    if (isExtracurricular.data.data.category.id == 2) {
      const enrolledStudents = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/enroll/${selectedSubject}`
      );
      const enrolledRFIDs = enrolledStudents.data.data.map(
        (enrolled) => enrolled.student_rfid
      );
      filteredStudents = students.data.data.filter((student) =>
        enrolledRFIDs.includes(student.rfid)
      );
    } else {
      filteredStudents = students.data.data;
    }

    const classSubjectMap = classSchedule.data.data.map((item) => ({
      class_id: item.class_id,
      subject_id: item.subject_id,
    }));

    const isValid = classSubjectMap.some(
      (schedule) =>
        schedule.class_id === selectedClass &&
        schedule.subject_id === selectedSubject
    );

    if (!isValid) {
      return setData([]);
    }

    const subjectAttendance = await axiosInstance.get(
      `${
        import.meta.env.VITE_BASE_URL_BACKEND
      }/subject-attendance?class=${selectedClass}&subject=${selectedSubject}`
    );

    const selectedMonth = moment(selectedDate).month();
    const selectedYear = moment(selectedDate).year();
    const daysInMonth = moment(selectedDate).daysInMonth();
    const today = moment().startOf("day");

    const processedRecords = subjectAttendance.data.data.map((record) => ({
      ...record,
      date: moment.unix(record.date).format("YYYY-MM-DD"),
    }));

    const processedPermits = permits.data.data
      .filter((permit) => permit.status === 200)
      .filter((permit) => {
        const permitDate = moment.unix(permit.date);
        return (
          permitDate.month() === selectedMonth &&
          permitDate.year() === selectedYear
        );
      })
      .map((permit) => ({
        ...permit,
        date: moment.unix(permit.date).format("YYYY-MM-DD"),
      }));

    const holidayDates = holidays.map((holiday) =>
      moment(holiday.date, "DD-MM-YYYY")
    );

    const filteredData = processedRecords.filter((record) => {
      const recordDate = moment(record.date, "YYYY-MM-DD");
      return (
        recordDate.month() === selectedMonth &&
        recordDate.year() === selectedYear &&
        record.class_id === selectedClass
      );
    });

    const methodMap = {
      "-": "-",
      izin: "I",
      sakit: "S",
      alfa: "A",
      libur: "L",
    };

    const hasScheduleForDate = (date) => {
      const dayName = new Date(date)
        .toLocaleString("in-ID", { weekday: "long" })
        .toLowerCase();
      return classSchedule.data.data.some(
        (s) =>
          s.day === dayName &&
          s.class_id === selectedClass &&
          s.subject_id === selectedSubject
      );
    };

    const formattedData = filteredStudents.map((student) => {
      const attendance = Array(daysInMonth).fill("-");

      attendance.forEach((_, index) => {
        const currentDate = moment(selectedDate)
          .date(index + 1)
          .startOf("day");
        const dayOfWeek = currentDate.day();
        const isHoliday = holidayDates.some((holidayDate) =>
          holidayDate.isSame(currentDate, "day")
        );

        if (isHoliday || dayOfWeek === 0 || dayOfWeek === 6) {
          attendance[index] = methodMap["libur"];
        }
      });

      // Temukan semua catatan kehadiran untuk siswa ini
      const studentAttendanceRecords = filteredData.filter(
        (record) => record.student_rfid === student.rfid
      );

      // Temukan semua permit (izin/sakit) untuk siswa ini, hanya yang Accepted
      const studentPermits = processedPermits.filter(
        (permit) =>
          permit.student_rfid === student.rfid && permit.status === 200
      );

      studentAttendanceRecords.forEach((record) => {
        const recordDate = moment(record.date, "YYYY-MM-DD").startOf("day");
        const dayIndex = recordDate.date() - 1;

        // Tandai kehadiran jika rekaman ditemukan
        attendance[dayIndex] = "H"; // Tandai sebagai hadir
      });

      // Tandai izin/sakit dalam rekap kehadiran
      studentPermits.forEach((permit) => {
        const permitDate = moment(permit.date, "YYYY-MM-DD").startOf("day");
        const dayIndex = permitDate.date() - 1;

        // Cek apakah tanggal permit sesuai dengan jadwal kelas dan mata pelajaran
        const isInSchedule = hasScheduleForDate(permitDate);

        let method = isInSchedule
          ? methodMap[permit.reason.toLowerCase()] || "-"
          : "-";
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

        // Jika hari libur dan status masih "-", ubah menjadi status libur
        if (isHoliday && status === "-") {
          return methodMap["libur"];
        }
        // Jika hari Sabtu atau Minggu dan status "-", ubah menjadi libur
        else if ((dayOfWeek === 0 || dayOfWeek === 6) && status === "-") {
          return methodMap["libur"];
        }
        // Jika tidak ada jadwal di hari itu dan status "-", tetap biarkan "-"
        else if (!hasScheduleForDate(currentDate) && status === "-") {
          return "-";
        }
        // Jika tanggal sebelum hari ini dan status "-", ubah menjadi alfa (tidak hadir)
        else if (currentDate.isBefore(today) && status === "-") {
          return methodMap["alfa"];
        }
        return status; // Jika tidak ada kondisi yang terpenuhi, kembalikan status asli
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

      // Hitung total hari libur
      const holidaysCount = holidayDates.filter(
        (holidayDate) =>
          holidayDate.month() === selectedMonth &&
          holidayDate.year() === selectedYear
      ).length;

      // Hitung total akhir pekan (Sabtu & Minggu)
      const weekendsCount = student.attendance.filter((_, index) => {
        const currentDate = moment(selectedDate)
          .date(index + 1)
          .startOf("day");
        return currentDate.day() === 0 || currentDate.day() === 6;
      }).length;

      const effectiveDays = Array.from({ length: daysInMonth }, (_, i) => {
        const currentDate = moment(selectedDate)
          .date(i + 1)
          .startOf("day");
        return hasScheduleForDate(currentDate) &&
          !(currentDate.day() === 0 || currentDate.day() === 6) &&
          !holidayDates.some((holidayDate) =>
            holidayDate.isSame(currentDate, "day")
          )
          ? 1
          : 0;
      }).reduce((sum, day) => sum + day, 0);

      // Hitung persentase kehadiran berdasarkan hari efektif
      student.percentage =
        effectiveDays > 0
          ? ((student.hadir / effectiveDays) * 100).toFixed(1)
          : "0.0";
    });

    setData(formattedData);
  } catch (error) {
    console.error("Error fetching subject attendance records: ", error);
    setData([]);
  }
};

export const exportPdf = async (fn, user, parent_user, label) => {
  const data = fn.current;
  if (data) {
    try {
      const pdf = new jsPDF();

      pdf.setFontSize(18);
      pdf.text("Logs Records #" + moment().format("DD-MM-YYYY"), 14, 22);
      pdf.setFontSize(11);
      pdf.setTextColor(100);

      const pageSize = pdf.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      const text = pdf.splitTextToSize(
        "Download Time : " +
          moment().format("DD MMM YYYY HH:mm:ss") +
          "\n" +
          "User Download : " +
          (parent_user ? parent_user.name : user ? user.name : "admin") +
          "\n",
        pageWidth - 35,
        {}
      );
      pdf.text(text, 14, 30);

      let i = 1;
      const tableElement = data.cloneNode(true); // Clone the table to avoid modifying the original

      // Update the header to replace 'Profile' with 'ID'
      const headerCells = tableElement.querySelectorAll("th");
      headerCells.forEach((cell) => {
        if (cell.innerText === "Profile") {
          cell.innerText = "ID";
        }
      });

      // Update the table rows to replace profile with id
      const tableRows = tableElement.querySelectorAll("tbody tr");
      tableRows.forEach((row) => {
        const profileCell = row.querySelector("td");
        if (profileCell) {
          profileCell.innerText = i++;
        }
      });

      autotable(pdf, { html: tableElement, startY: 40 });

      pdf.save(`Logs-Records-${moment().format("DD-MM-YYYY")}.pdf`);
      await logger({
        activity: `Export ${window.location.pathname
          .split("/")
          .filter(Boolean)
          .pop()
          .replace(/-/g, " ")}  "${label}"  file into PDF`,
      });
    } catch (error) {
      console.error("Error generating PDF: ", error);
    }
  } else {
    console.error("Table ref is not available.");
  }
};

export const exportCSV = async (fn, label) => {
  const data = fn.current;
  if (data) {
    try {
      const { unparse } = await import("papaparse");
      const { saveAs } = await import("file-saver");

      let rows = [];
      let headers = [];

      // Get table header
      const headerCells = data.querySelectorAll("th");
      headerCells.forEach((cell) => {
        let headerText = cell.innerText;
        // Replace 'Profile' with 'ID'
        if (headerText === "Profile") {
          headerText = "ID";
        }
        headers.push(headerText);
      });

      // Add headers to rows
      rows.push(headers);

      // Get table body rows
      let i = 1;
      const tableRows = data.querySelectorAll("tbody tr");
      tableRows.forEach((row) => {
        const rowData = [];
        row.querySelectorAll("td").forEach((cell, index) => {
          let cellText = cell.innerText;
          // Replace profile data with incremented ID
          if (index === 0) {
            cellText = i++;
          }
          rowData.push(cellText);
        });
        rows.push(rowData);
      });

      // Convert rows to CSV format using PapaParse
      const csv = unparse(rows);

      // Create a blob and save as CSV file
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `Logs-Records-${moment().format("DD-MM-YYYY")}.csv`);
      await logger({
        activity: `Export ${window.location.pathname
          .split("/")
          .filter(Boolean)
          .pop()
          .replace(/-/g, " ")} "${label}" file into CSV`,
      });
    } catch (error) {
      console.error("Error exporting CSV: ", error);
    }
  } else {
    console.error("Table ref is not available.");
  }
};

export const exportExcel = async (fn) => {
  const data = fn.current;
  if (data) {
    try {
      // Import libraries dynamically
      const { utils, writeFile } = await import("xlsx");

      let rows = [];
      let headers = [];

      // Get table header
      const headerCells = data.querySelectorAll("th");
      headerCells.forEach((cell) => {
        let headerText = cell.innerText;
        // Replace 'Profile' with 'ID'
        if (headerText === "Profile") {
          headerText = "ID";
        }
        headers.push(headerText);
      });

      // Add headers to rows
      rows.push(headers);

      // Get table body rows
      let i = 1;
      const tableRows = data.querySelectorAll("tbody tr");
      tableRows.forEach((row) => {
        const rowData = [];
        row.querySelectorAll("td").forEach((cell, index) => {
          let cellText = cell.innerText;
          // Replace profile data with incremented ID
          if (index === 0) {
            cellText = i++;
          }
          rowData.push(cellText);
        });
        rows.push(rowData);
      });

      // Create a new worksheet
      const worksheet = utils.aoa_to_sheet(rows);

      // Create a new workbook and append the worksheet
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Logs Records");

      // Write the workbook to an Excel file
      writeFile(workbook, `Logs-Records-${moment().format("DD-MM-YYYY")}.xlsx`);
      await logger({
        activity: `Export ${window.location.pathname
          .split("/")
          .filter(Boolean)
          .pop()
          .replace(/-/g, " ")} "${label}" file into Excel`,
      });
    } catch (error) {
      console.error("Error exporting Excel: ", error);
    }
  } else {
    console.error("Table ref is not available.");
  }
};

export const fetchPermitDataTeacher = async (user) => {
  try {
    const { data: classes } = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule?teacherid=${
        user.nid
      }`
    );

    const uniqueClass = [...new Set(classes.data.map((item) => item.class_id))];
    const classParams = uniqueClass.join(",");
    const teachingDays = classes.data.map((item) => item.day);

    if (classParams.length === 0) {
      return [];
    }

    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/permits?class=${
        user.class != null ? user.class.id : classParams
      }`
    );

    let permitData;
    if (user.class == null) {
      permitData = response.data.data
        .map((permit) => {
          const dateObject = new Date(permit.date * 1000);
          const permitDay = dateObject
            .toLocaleDateString("id-ID", { weekday: "long" })
            .toLowerCase();
          const isTeachingDay = teachingDays.includes(permitDay);

          return isTeachingDay
            ? {
                ...permit,
              }
            : null;
        })
        .filter(Boolean);
    } else {
      permitData = response.data.data;
    }

    const convertedData = await Promise.all(
      permitData.map(async (item) => {
        const studentResponse = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/students/${
            item.student_rfid
          }`
        );
        const student = studentResponse.data;

        return {
          ...item,
          name: student.data.name,
          class:
            item.class.id <= 6 ? "Kelas " + item.class.id : item.class.name,
          status:
            item.status === 300
              ? "Pending"
              : item.status === 200
              ? "Accepted"
              : "Rejected",
          date: moment(item.date * 1000).format("YYYY-MM-DD"),
        };
      })
    );

    // Mengurutkan data berdasarkan status dan tanggal terkini
    convertedData.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      // Urutkan berdasarkan status (Pending lebih dahulu)
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;

      // Jika status sama, urutkan berdasarkan tanggal (terkini dahulu)
      return dateB - dateA;
    });

    return convertedData;
  } catch (error) {
    throw error;
  }
};

export const fetchAttendanceData = async (user) => {
  try {
    const attendanceResponse = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance?class=${
        user?.class?.id || ""
      }`
    );

    const updatedData = attendanceResponse.data.data.map((record) => ({
      ...record,
      profile: `assets/icon/${
        record.student.gender === "Perempuan" ? "girl" : "boy"
      }-icon.png`,
      student_name: record.student.name,
      class: record.student.class.name,
      status:
        record.method === 1002 && record.status === 200
          ? "Checked Out"
          : record.status === 200
          ? "On Time"
          : "Late",
      method: record.method === 1001 ? "Check-In" : "Check-Out",
      time: moment.unix(record.date).local().format("DD MMM YYYY HH:mm:ss"),
      unixTime: record.date,
      action: record.id,
    }));

    return updatedData.sort((a, b) => b.unixTime - a.unixTime);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchSubjectAttendanceData = async (user) => {
  try {
    let subattendance, classes;

    if (user) {
      classes = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule?teacherid=${
          user.nid
        }`
      );
      const uniquesClass = [
        ...new Set(classes.data.data.map((item) => item.class_id)),
      ];
      const classParams = uniquesClass.join(",");
      const uniqueSubject = [
        ...new Set(classes.data.data.map((item) => item.subject_id)),
      ];
      const subjectParams = uniqueSubject.join(",");

      subattendance = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/subject-attendance?class=${classParams}&subject=${subjectParams}`
      );
    } else {
      classes = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule`
      );
      const classParams = "";
      const subjectParams = "";

      subattendance = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/subject-attendance?class=${classParams}&subject=${subjectParams}`
      );
    }

    const classSubjectMap = classes.data.data.map((item) => ({
      class_id: item.class_id,
      subject_id: item.subject_id,
    }));

    const records = subattendance.data.data.filter((attendance) => {
      return classSubjectMap.some(
        (taught) =>
          taught.class_id === attendance.class_id &&
          taught.subject_id === attendance.subject_id
      );
    });

    const updatedData = records.map((record) => ({
      ...record,
      profile: `assets/icon/${
        record.student.gender === "Perempuan" ? "girl" : "boy"
      }-icon.png`,
      student_name: record.student.name,
      class: record.student.class.name,
      subject: record.subject.name,
      time: moment.unix(record.date).local().format("DD MMM YYYY HH:mm:ss"),
      unixTime: record.date,
    }));

    return updatedData.sort((a, b) => b.unixTime - a.unixTime);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteAttendance = async (id, tab, setData) => {
  const confirmDelete = await Swal.fire({
    title: "Are you sure?",
    text: `Data yang dihapus tidak dapat dikembalikan!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Cancel",
  });

  if (confirmDelete.isConfirmed) {
    try {
      if (tab === "attendance") {
        await axiosInstance.delete(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance/${id}`
        );
      } else {
        await axiosInstance.delete(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/subject-attendance/${id}`
        );
      }
      setData((prevData) => prevData.filter((item) => item.id !== id));
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Data has been deleted.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
      console.error("Error deleting teacher:", error);
    }
  }
};

export const fetchSChedule = async (
  teacher,
  setScheduleData,
  setSelectedClassId,
  setSubjectId
) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule?teacherid=${
        teacher.nid
      }`
    );
    if (response.data.data.length === 0) {
      return;
    }
    const schedule = response.data.data || [];
    setScheduleData({ schedule });

    const uniqueClasses = [
      ...new Set(schedule.map((item) => item.class_id)),
    ].sort((a, b) => a - b);

    if (uniqueClasses.length > 0) {
      setSelectedClassId(uniqueClasses[0]);
    }

    if (teacher.type === "Ekstra Teacher") {
      const subjectId = schedule[0].subject_id;
      setSubjectId(subjectId);
    }
  } catch (error) {
    console.error("Error fetching schedule:", error);
  }
};

export const fetchStudentsEnrollment = async (
  selectedClassId,
  setStudents,
  scheduleData,
  setSelectedClassId
) => {
  if (selectedClassId) {
    try {
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/students?class=${selectedClassId}`
      );
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  } else if (scheduleData.schedule.length > 0) {
    // Set default selected class
    const firstClassId = scheduleData.schedule[0].class_id;
    setSelectedClassId(firstClassId);
  }
};

export const enrollStudents = async (
  subjectId,
  selectedStudents,
  handleCloseModal
) => {
  try {
    const enrollResponse = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/enroll/${subjectId}`
    );
    const enrolledStudents = enrollResponse.data.data.map(
      (student) => student.student_rfid
    );

    const studentsToAdd = selectedStudents.filter(
      (rfid) => !enrolledStudents.includes(rfid)
    );
    const studentsToRemove = enrolledStudents.filter(
      (rfid) => !selectedStudents.includes(rfid)
    );

    // Add new enrollments
    if (studentsToAdd.length > 0) {
      await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/enroll`,
        {
          student_rfid: studentsToAdd,
          ekstrakurikuler: subjectId,
        }
      );
    }

    // Remove unenrolled students in one request
    if (studentsToRemove.length > 0) {
      await axiosInstance.delete(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/enroll`,
        {
          data: {
            student_rfid: studentsToRemove,
            ekstrakurikuler: subjectId,
          },
        }
      );
    }

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `Siswa berhasil diperbarui.`,
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Gagal memperbarui enroll siswa.",
      showConfirmButton: false,
      timer: 1500,
    });
    console.error("Error updating enrollments:", error);
  }
  handleCloseModal();
};
