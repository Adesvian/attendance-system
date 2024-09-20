import axios from "axios";
import moment from "moment";

export const fetchDataDashboard = async (
  setData,
  setLoading,
  setError,
  user
) => {
  try {
    setLoading(true);

    const fetchDataFromApi = async (endpoint) => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/${endpoint}`
      );
      return data;
    };

    const classes = await fetchDataFromApi(
      `class-schedule?teacherid=${user.nid}`
    );

    const uniqueClass = [...new Set(classes.data.map((item) => item.class_id))];
    const uniqueSubject = [
      ...new Set(classes.data.map((item) => item.subject_id)),
    ];

    const classParams = uniqueClass.join(",");

    const [chartdata, attendance, students, permits] = await Promise.all([
      user.class != null
        ? fetchDataFromApi(`attendance?class=${classParams}`)
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
    ]);

    const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    const todayEnd = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);

    const attendanceRate =
      (attendance.data.filter((a) => a.method === 1001).length /
        students.data.length) *
      100;

    setData((prevData) => ({
      ...prevData,
      student: students.data.length,
      class: uniqueClass.length,
      subject: uniqueSubject.length,
      classschedule: classes.data.length,
      presenceRate: parseFloat(attendanceRate.toFixed(2)),
      permit: permits.data.filter((permit) => permit.status === 300).length,
      absent: permits.data.filter(
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
  if (selectedDate && selectedClass && selectedSubject) {
    try {
      const [students, classSchedule, permits] = await Promise.all([
        axios.get(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/students?class=${selectedClass}`
        ),
        axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule?teacherid=${
            user.nid
          }`
        ),
        axios.get(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/permits?class=${selectedClass}`
        ),
      ]);

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
        setData([]);
        return;
      }
      const subjectAttendance = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/subject-attendance?class=${selectedClass}&subject=${selectedSubject}`
      );

      console.log(subjectAttendance.data.data);

      const selectedMonth = moment(selectedDate).month();
      const selectedYear = moment(selectedDate).year();
      const daysInMonth = moment(selectedDate).daysInMonth();
      const today = moment().startOf("day");

      const processedRecords = subjectAttendance.data.data.map((record) => ({
        ...record,
        date: moment.unix(record.date).format("YYYY-MM-DD"),
      }));
      console.log(processedRecords);

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

      const hasScheduleForDate = (date, selectedClass, selectedSubject) => {
        const dayName = new Date(date)
          .toLocaleString("in-ID", {
            weekday: "long",
          })
          .toLowerCase();

        return classSchedule.data.data.some(
          (s) =>
            s.day === dayName &&
            s.class_id === selectedClass &&
            s.subject_id === selectedSubject
        );
      };
      const formattedData = students.data.data.map((student) => {
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
          (permit) => permit.student_rfid === student.rfid
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

          // Check if the permit date matches the selected class and subject schedule
          const isInSchedule = hasScheduleForDate(
            permitDate,
            selectedClass,
            selectedSubject
          );

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
          const dayOfWeek = currentDate.day(); // 0 = Minggu, 6 = Sabtu
          const isHoliday = holidayDates.some((holidayDate) =>
            holidayDate.isSame(currentDate, "day")
          );
          const hasSchedule = hasScheduleForDate(
            currentDate,
            selectedClass,
            selectedSubject
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
          else if (!hasSchedule && status === "-") {
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

        // Hitung hari efektif (hari di mana ada jadwal mengajar dan bukan libur/akhir pekan)
        const effectiveDays = Array.from(
          { length: moment(selectedDate).daysInMonth() },
          (_, i) => {
            const currentDate = moment(selectedDate)
              .date(i + 1)
              .startOf("day");
            const hasSchedule = hasScheduleForDate(
              currentDate,
              selectedClass,
              selectedSubject
            );
            const isWeekend =
              currentDate.day() === 0 || currentDate.day() === 6;
            const isHoliday = holidayDates.some((holidayDate) =>
              holidayDate.isSame(currentDate, "day")
            );
            return hasSchedule && !isWeekend && !isHoliday ? 1 : 0;
          }
        ).reduce((sum, day) => sum + day, 0);

        // Hitung persentase kehadiran berdasarkan hari efektif
        student.percentage = ((student.hadir / effectiveDays) * 100).toFixed(1);
      });

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching subject attendance records: ", error);
    }
  } else {
    setData([]);
  }
};
