import axios from "axios";
import moment from "moment";
import "jspdf-autotable";
import Swal from "sweetalert2";

export const fetchDataDashboard = async (setData) => {
  try {
    const [
      students,
      subjects,
      teachers,
      classes,
      permits,
      attendance,
      classSchedule,
    ] = await Promise.all([
      axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/students`),
      axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/subjects`),
      axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/teachers`),
      axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/classes`),
      axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/permits-today`),
      axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/attendance-today`),
      axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule`),
    ]);

    const whatsapp = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/get-whatsapp-creds`
    );

    const attendanceRate =
      (attendance.data.data.filter((a) => a.method === 1001).length /
        students.data.data.length) *
      100;

    setData((prevData) => ({
      ...prevData,
      student: students.data.data.length,
      teacher: teachers.data.data.length,
      class: classes.data.data.length,
      subject: subjects.data.data.length,
      classSchedule: classSchedule.data.data.length,
      presenceRate: parseFloat(attendanceRate.toFixed(2)),
      absent: permits.data.data.filter((a) => a.status === 200).length,
      onTime: attendance.data.data.filter(
        (a) => a.status === 200 && a.method === 1001
      ).length,
      late: attendance.data.data.filter((a) => a.status === 201).length,
      attendance: attendance.data.data,
      whatsapp:
        whatsapp.data.data.length > 0
          ? whatsapp.data.data[0].status
          : "No Device",
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchRecentStudents = async (
  setStudents,
  setError,
  setLoading
) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/students`
    );
    const studentMap = response.data.data.map(({ name, gender }) => ({
      name,
      gender,
    }));
    setStudents(studentMap);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};

export const fetchDataAttendanceRecords = async (
  selectedDate,
  selectedClass,
  holidays,
  setData
) => {
  if (!selectedDate || !selectedClass) return setData([]);

  try {
    const [students, attendances, permits] = await Promise.all([
      axios.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/students?class=${selectedClass}`
      ),
      axios.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/attendance?class=${selectedClass}`
      ),
      axios.get(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/permits?class=${selectedClass}`
      ),
    ]);

    const selectedMonth = moment(selectedDate).month();
    const selectedYear = moment(selectedDate).year();
    const daysInMonth = moment(selectedDate).daysInMonth();
    const today = moment().startOf("day");
    const holidayDates = holidays.map((holiday) =>
      moment(holiday.date, "DD-MM-YYYY")
    );
    const methodMap = {
      1001: "H",
      "-": "-",
      izin: "I",
      sakit: "S",
      alfa: "A",
      libur: "L",
    };

    const processedRecords = attendances.data.data.map((record) => ({
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

    const filteredData = processedRecords.filter((record) => {
      const recordDate = moment(record.date, "YYYY-MM-DD");
      return (
        recordDate.month() === selectedMonth &&
        recordDate.year() === selectedYear &&
        record.method === 1001
      );
    });

    const formattedData = students.data.data.map((student) => {
      const attendance = Array(daysInMonth).fill("-");

      // Tandai hari libur dan akhir pekan
      for (let index = 0; index < daysInMonth; index++) {
        const currentDate = moment(selectedDate)
          .date(index + 1)
          .startOf("day");
        const isWeekend = currentDate.day() === 0 || currentDate.day() === 6;
        const isHoliday = holidayDates.some((holidayDate) =>
          holidayDate.isSame(currentDate, "day")
        );

        if (isHoliday || isWeekend) {
          attendance[index] = methodMap["libur"];
        }
      }

      // Proses kehadiran
      filteredData
        .filter((record) => record.student_rfid === student.rfid)
        .forEach(
          (record) =>
            (attendance[moment(record.date, "YYYY-MM-DD").date() - 1] =
              methodMap[record.method] || "-")
        );

      // Proses permit
      processedPermits
        .filter((permit) => permit.student_rfid === student.rfid)
        .forEach((permit) => {
          const permitDate = moment(permit.date, "YYYY-MM-DD");

          // Tandai 3 hari permit
          for (let i = 0; i < 3; i++) {
            const permitDay = permitDate.clone().add(i, "days");

            if (
              permitDay.month() === selectedMonth &&
              permitDay.year() === selectedYear
            ) {
              const permitIndex = permitDay.date() - 1;

              // Jika sudah ada kehadiran atau sudah ditandai sebagai libur, lewati penandaan
              if (
                attendance[permitIndex] === "H" ||
                attendance[permitIndex] === methodMap["libur"]
              ) {
                continue; // Keberadaan hadir dan libur harus diprioritaskan
              }

              // Cek kehadiran sehari setelah permit
              const nextDay = permitDay.clone().add(1, "days");
              const nextDayIndex = nextDay.date() - 1;

              if (attendance[nextDayIndex] === "H") {
                // Tandai hanya hari pertama dengan izin
                attendance[permitIndex] =
                  methodMap[permit.reason.toLowerCase()] || "-";
                break; // Keluar dari loop setelah menandai
              } else {
                // Jika tidak ada kehadiran sehari setelahnya, tetap gunakan logika sebelumnya
                attendance[permitIndex] = holidayDates.some((holidayDate) =>
                  holidayDate.isSame(permitDay, "day")
                )
                  ? methodMap["libur"] // Tetap tandai sebagai libur jika permit jatuh pada hari libur
                  : methodMap[permit.reason.toLowerCase()] || "-";
              }
            }
          }
        });

      // Periksa tanggal sebelum hari ini untuk status alfa
      attendance.forEach((status, index) => {
        const currentDate = moment(selectedDate)
          .date(index + 1)
          .startOf("day");
        if (currentDate.isBefore(today) && status === "-") {
          attendance[index] = methodMap["alfa"];
        }
      });

      const hadir = attendance.filter((status) => status === "H").length;
      const absen = attendance.filter((status) => status === "A").length;
      const izin = attendance.filter((status) => status === "I").length;
      const sakit = attendance.filter((status) => status === "S").length;

      const effectiveDays =
        daysInMonth -
        holidayDates.length -
        attendance.filter((_, index) => {
          const currentDate = moment(selectedDate)
            .date(index + 1)
            .startOf("day");
          return currentDate.day() === 0 || currentDate.day() === 6;
        }).length;

      return {
        name: student.name,
        attendance: attendance,
        hadir,
        absen,
        izin,
        sakit,
        percentage: ((hadir / effectiveDays) * 100).toFixed(1),
      };
    });

    setData(formattedData);
  } catch (error) {
    console.error("Error fetching data: ", error);
    setData([]);
  }
};

export const fetchDataClassOption = async (
  user,
  setClassOptions,
  setSubjectOptions,
  setSelectedClass,
  setSelectedSubject
) => {
  try {
    if (user != null && user.class != null) {
      setClassOptions([{ value: user.class.id, label: user.class.name }]);
      setSelectedClass(user.class.id);
    } else if (user != null) {
      const { data: classes } = await axios.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule?teacherid=${
          user.nid
        }`
      );

      const uniqueSubject = [
        // Menggunakan Map untuk memastikan subject.id unik
        ...new Map(
          classes.data.map((item) => [
            item.subject_id,
            { id: item.subject_id, name: item.subject.name },
          ])
        ).values(),
      ].sort((a, b) => a.name.localeCompare(b.name)); // Sortir berdasarkan nama subject

      setSubjectOptions([
        ...uniqueSubject.map((subject) => ({
          value: subject.id,
          label: subject.name,
        })),
      ]);

      const uniqueClass = [
        ...new Set(classes.data.map((item) => item.class_id)),
      ].sort((a, b) => a - b);

      setClassOptions([
        ...uniqueClass.map((className) => ({
          value: className,
          label: "Kelas " + className,
        })),
      ]);

      if (uniqueClass.length > 0 || uniqueSubject.length > 0) {
        setSelectedSubject(uniqueSubject[0].id);
        setSelectedClass(uniqueClass[0]);
      }
    } else {
      setClassOptions([
        { value: "", label: "Pilih Kelas" },
        { value: 1, label: "Kelas 1" },
        { value: 2, label: "Kelas 2" },
        { value: 3, label: "Kelas 3" },
        { value: 4, label: "Kelas 4" },
        { value: 5, label: "Kelas 5" },
        { value: 6, label: "Kelas 6" },
      ]);
    }
  } catch (err) {
    console.error(err);
  }
};

export const exportCSV = async (data, selectedDate, selectedClass) => {
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

export const exportExcel = async (data, selectedDate, selectedClass) => {
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

export const generateColumns = (selectedDate) => {
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

export const exportPdf = async (
  data,
  selectedDate,
  selectedClass,
  user,
  parent_user
) => {
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
      )}\nUser Download : ${
        parent_user ? parent_user.name : user ? user.name : "admin"
      }\n`,
      pageWidth - 35
    );
    doc.text(text, 40, 60);

    const exportColumns = generateColumns(selectedDate).map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

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

// API Functions

export const fetchTeachers = async (setData) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/teachers`
    );
    const updatedData = response.data.data.map((teacher) => {
      return {
        ...teacher,
        profile: `assets/icon/${
          teacher.gender === "Perempuan" ? "miss" : "sir"
        }.png`,
        type:
          teacher.type === "Class Teacher"
            ? `Wali Kelas ${teacher.class_id}`
            : "Guru Mapel",
        ttl:
          teacher.birth_of_place || teacher.birth_of_date
            ? `${teacher.birth_of_place},${moment(teacher.birth_of_date).format(
                " DD MMM YYYY"
              )}`
            : "-",
        address: teacher.address ? teacher.address : "-",
      };
    });

    setData(updatedData);
  } catch (error) {
    console.error(error);
  }
};

export const submitTeacherData = async (teacherData, setLoading) => {
  setLoading(true);

  const formattedTeacherData = {
    nid: String(teacherData.nid),
    name: teacherData.name,
    gender: teacherData.gender,
    birth_of_place: teacherData.birth_of_place,
    birth_of_date: teacherData.birth_of_date
      ? new Date(teacherData.birth_of_date).toISOString()
      : null,
    type: teacherData.type,
    class_id: teacherData.class,
    address: teacherData.address,
  };

  const formattedUserData = {
    nid: String(teacherData.nid),
    name: teacherData.name,
    username: teacherData.username,
    password: teacherData.password,
    role: "teacher",
  };

  try {
    await Promise.all([
      axios.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/teachers`,
        formattedTeacherData
      ),
      axios.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/users`,
        formattedUserData
      ),
    ]);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Data successfully added!",
    });

    return true; // Indicate success
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.error === "P2002"
          ? `${
              error.response.data.field.includes("class")
                ? `Guru Kelas ${teacherData.class}`
                : "NIK"
            } already exists!`
          : "Something went wrong!"
        : "Something went wrong!",
    });
    return false; // Indicate failure
  } finally {
    setLoading(false);
  }
};

export const updateTeacherData = async (teacherData, id, setLoading) => {
  setLoading(true);

  const formatTeacherData = {
    nid: String(teacherData.nid),
    name: teacherData.name,
    gender: teacherData.gender,
    birth_of_place: teacherData.birth_of_place,
    birth_of_date: teacherData.birth_of_date
      ? new Date(teacherData.birth_of_date).toISOString()
      : null,
    type: teacherData.type,
    class_id: Number(teacherData.class_id),
    address: teacherData.address,
  };

  const formatUserData = {
    nid: String(teacherData.nid),
    name: teacherData.name,
    username: teacherData.username,
    password: teacherData.password,
    role: "teacher",
  };

  try {
    await Promise.all([
      axios.put(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/teachers/${id}`,
        formatTeacherData
      ),
      axios.put(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/users/${id}`,
        formatUserData
      ),
    ]);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Data successfully updated!",
    });

    return true; // Indicate success
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.error === "P2002"
          ? `${
              error.response.data.field.includes("class")
                ? `Guru Kelas ${teacherData.class}`
                : "NIK"
            } already exists!`
          : "Something went wrong!"
        : "Something went wrong!",
    });
    return false; // Indicate failure
  } finally {
    setLoading(false);
  }
};

export const deleteTeacher = async (nid, setData) => {
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
      await Promise.all([
        axios.delete(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/teachers/${nid}`
        ),
        axios.delete(`${import.meta.env.VITE_BASE_URL_BACKEND}/users/${nid}`),
      ]);

      // Update the data state to remove the deleted item
      setData((prevData) => prevData.filter((teacher) => teacher.nid !== nid));

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

export const fetchSubjects = async (setData) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/subjects`
    );
    const dataWIndex = response.data.data.map((item, index) => ({
      ...item,
      no: index + 1,
      category: item.category.name,
    }));

    setData(dataWIndex);
  } catch (error) {
    console.error("Error fetching subjects data:", error);
  }
};

export const submitSubjectData = async (subjectData, setLoading) => {
  setLoading(true);
  const formattedData = {
    name: subjectData.name,
    category_id: Number(subjectData.category_id),
  };

  try {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/subjects`,
      formattedData
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Data successfully added!",
    });

    return true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.error === "P2002"
          ? `Subject ${subjectData.name} already exists!`
          : "Something went wrong!"
        : "Something went wrong!",
    });
    return false;
  } finally {
    setLoading(false);
  }
};

export const updateSubject = async (subjectData, id, setLoading) => {
  setLoading(true);

  const formattedData = {
    name: subjectData.name,
    category_id: Number(subjectData.category_id),
  };

  try {
    await axios.put(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/subjects/${id}`,
      formattedData
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Data successfully updated!",
    });

    return true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.error === "P2002"
          ? `Subject ${subjectData.name} already exists!`
          : "Something went wrong!"
        : "Something went wrong!",
    });
    return false; // Indicate failure
  } finally {
    setLoading(false);
  }
};

export const deleteSubject = async (id, setData) => {
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
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/subjects/${id}`
      );

      // Update the data state to remove the deleted item
      setData((prevData) => prevData.filter((subject) => subject.id !== id));

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
      console.error("Error deleting subject:", error);
    }
  }
};

export const fetchSchedules = async (setData) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule`
    );

    const scheduleData = response.data.data.map((item) => ({
      ...item,
      className: item.class.name,
      subjectName: item.subject.name,
      teacherName: item.teacher.name,
      day: item.day, // Hari
      time: `${moment(item.start_time).utc().format("HH:mm")} - ${moment(
        item.end_time
      )
        .utc()
        .format("HH:mm")}`,
    }));

    setData(scheduleData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const submitScheduleData = async (scheduleData, setLoading) => {
  setLoading(true);

  const { teacher_nid, class_id, subject_id, day, start_time, end_time } =
    scheduleData;

  const schedulePayload = {
    class_id: Number(class_id),
    subject_id: Number(subject_id),
    teacher_nid: teacher_nid,
    day: day,
    start_time: `${new Date(`1970-01-01T${start_time}:00.000Z`).toISOString()}`,
    end_time: `${new Date(`1970-01-01T${end_time}:00.000Z`).toISOString()}`,
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule`,
      schedulePayload
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Class schedule successfully created!",
    });

    return true;
  } catch (error) {
    console.error("Error creating class schedule:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.error === "P2002"
          ? `Jadwal yang anda masukkan bertabrakan dengan jadwal lain!`
          : "Something went wrong!"
        : "Something went wrong!",
    });
  } finally {
    setLoading(false);
  }
};

export const updateSchedule = async (scheduleData, id, setLoading) => {
  setLoading(true);

  const { teacher_nid, class_id, subject_id, day, start_time, end_time } =
    scheduleData;

  const schedulePayload = {
    class_id: Number(class_id),
    subject_id: Number(subject_id),
    teacher_nid: teacher_nid,
    day: day,
    start_time: `${new Date(`1970-01-01T${start_time}:00.000Z`).toISOString()}`,
    end_time: `${new Date(`1970-01-01T${end_time}:00.000Z`).toISOString()}`,
  };

  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule/${id}`,
      schedulePayload
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Data successfully updated!",
    });

    return true;
  } catch (error) {
    console.error("Error creating class schedule:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.error === "P2002"
          ? `Jadwal yang anda masukkan bertabrakan dengan jadwal lain!`
          : "Something went wrong!"
        : "Something went wrong!",
    });
  } finally {
    setLoading(false);
  }
};

export const deleteClassSchedule = async (id, setData) => {
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
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/class-schedule/${id}`
      );

      // Update the data state to remove the deleted item
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
      console.error("Error deleting subject:", error);
    }
  }
};

export const handleChangeParentData = (
  studentData,
  parentData,
  name,
  value
) => {
  const newData = { ...studentData, [name]: value };

  // If parent_type is set to 'exist'
  if (name === "parent_exist" && newData.parent_type === "exist") {
    const parentExist = parentData.find((parent) => parent.nid === value);

    if (parentExist) {
      newData.parent_nid = parentExist.nid;
      newData.parent_name = parentExist.name;
      newData.parent_gender = parentExist.gender;
      newData.parent_birth_of_place = parentExist.birth_of_place;
      newData.parent_birth_of_date = parentExist.birth_of_date;
      newData.phone_num = parentExist.phone_num;
      newData.address = parentExist.address;
    }
  }

  // If parent_type is set to 'new', reset all relevant fields
  if (name === "parent_type" && value === "new") {
    newData.parent_exist = ""; // Clear existing parent selection
    newData.parent_nid = ""; // Reset NID for new parent
    newData.parent_name = ""; // Reset name for new parent
    newData.parent_gender = "Laki-Laki"; // Default value
    newData.parent_birth_of_place = ""; // Reset birth place
    newData.parent_birth_of_date = ""; // Reset birth date
    newData.phone_num = ""; // Reset phone number
    newData.address = ""; // Reset address
    newData.username = ""; // Reset username
    newData.password = ""; // Reset password
    newData.isnew = false; // Reset isnew state
  }

  return newData;
};

export const fetchStudentData = async (setData) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/students`
    );

    const updatedData = response.data.data.map((student) => {
      return {
        ...student,
        profile: `assets/icon/${
          student.gender === "Perempuan" ? "girl" : "boy"
        }-icon.png`,
        rfid: student.rfid,
        name: student.name,
        class: student.class.name,
        ttl:
          student.birth_of_place || student.birth_of_date
            ? `${student.birth_of_place}, ${
                student.birth_of_date
                  ? moment(student.birth_of_date).format("DD MMM YYYY")
                  : ""
              }`
            : "-",
        parent_name: student.parent.name,
      };
    });

    setData(updatedData);
  } catch (error) {
    console.error(error);
  }
};

export const submitStudentData = async (studentData, setLoading) => {
  // setLoading(true);

  const formatStudentData = {
    rfid: studentData.rfid,
    name: studentData.name,
    class_id: studentData.class,
    gender: studentData.gender,
    birth_of_place: studentData.birth_of_place
      ? studentData.birth_of_place
      : null,
    birth_of_date: studentData.birth_of_date
      ? new Date(studentData.birth_of_date).toISOString()
      : null,
    parent_nid: studentData.parent_nid,
  };

  let formatUserData = null;
  let formatParentData = null;
  if (studentData.parent_type === "new") {
    formatUserData = {
      nid: studentData.parent_nid,
      name: studentData.parent_name,
      username: studentData.username,
      password: studentData.password,
      role: "parent",
    };
    formatParentData = {
      nid: studentData.parent_nid,
      name: studentData.parent_name,
      gender: studentData.parent_gender,
      birth_of_place: studentData.parent_birth_of_place
        ? studentData.parent_birth_of_place
        : null,
      birth_of_date: studentData.parent_birth_of_date
        ? new Date(studentData.parent_birth_of_date).toISOString()
        : null,
      phone_num: studentData.phone_num ? studentData.phone_num : null,
      address: studentData.address ? studentData.address : null,
    };
  }

  const promises = [
    formatParentData
      ? axios.post(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/parents`,
          formatParentData
        )
      : null,
    formatUserData
      ? axios.post(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/users`,
          formatUserData
        )
      : null,
    axios.post(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/students`,
      formatStudentData
    ),
  ].filter(Boolean);
  try {
    await Promise.all(promises);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Data successfully created!",
    });
    return true;
  } catch (error) {
    console.error("Error creating student:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.error === "P2002"
          ? `RFID ${studentData.rfid} already exists!`
          : "Something went wrong!"
        : "Something went wrong!",
    });
  } finally {
    setLoading(false);
  }
};

export const updateStudentData = async (studentData, id, setLoading) => {
  // setLoading(true);
  let parentExist = false;

  try {
    await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/parents/${
        studentData.parent_nid
      }`
    );
    parentExist = true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      parentExist = false;
    } else {
      parentExist = false;
    }
  }

  // Prepare student data
  const formattedData = {
    rfid: studentData.rfid,
    name: studentData.name,
    class_id: Number(studentData.class),
    gender: studentData.gender,
    birth_of_place: studentData.birth_of_place || null,
    birth_of_date: studentData.birth_of_date
      ? new Date(studentData.birth_of_date).toISOString()
      : null,
    parent_nid: studentData.parent_nid,
  };

  // Prepare parent data only if parent_type is not "exist"
  const formatParentData =
    studentData.parent_type !== "exist"
      ? {
          nid: studentData.parent_nid,
          name: studentData.parent_name,
          gender: studentData.parent_gender,
          birth_of_place: studentData.parent_birth_of_place || null,
          birth_of_date: studentData.parent_birth_of_date
            ? new Date(studentData.parent_birth_of_date).toISOString()
            : null,
          phone_num: studentData.phone_num || null,
          address: studentData.address || null,
        }
      : null;

  const formatUserData =
    studentData.parent_type !== "exist"
      ? {
          nid: studentData.parent_nid,
          name: studentData.parent_name,
          username: studentData.username,
          password: studentData.password,
          role: "parent",
        }
      : null;

  const promises = [];

  // Handle parent data update/creation based on conditions
  if (studentData.parent_type !== "exist") {
    // Only create or update parent if not exist
    if (studentData.isnew) {
      promises.push(
        axios.post(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/parents`,
          formatParentData
        )
      );
      promises.push(
        axios.post(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/users`,
          formatUserData
        )
      );
    } else {
      if (parentExist) {
        promises.push(
          axios.put(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/parents/${
              studentData.parent_nid
            }`,
            formatParentData
          )
        );
        promises.push(
          axios.put(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/users/${
              studentData.parent_nid
            }`,
            formatUserData
          )
        );
      } else {
        // If the parent does not exist and is not new, update the parent anyway
        promises.push(
          axios.put(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/parents/${
              studentData.default_nid
            }`,
            formatParentData
          )
        );
        promises.push(
          axios.put(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/users/${
              studentData.default_nid
            }`,
            formatUserData
          )
        );
      }
    }
  }

  // Always include the student update
  promises.push(
    axios.put(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/students/${id}`,
      formattedData
    )
  );
  try {
    await Promise.all(promises);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Data successfully updated!",
    });
    return true;
  } catch (error) {
    console.error("Error updating student:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.error === "P2002"
          ? `RFID ${studentData.rfid} already exists!`
          : "Something went wrong!"
        : "Something went wrong!",
    });
  } finally {
    setLoading(false);
  }
};

export const deleteStudent = async (id, setData) => {
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
      const count = await axios.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/students/count/${
          id.parent_nid
        }`
      );
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/students/${id.rfid}`
      );
      if (count.data.count === 1) {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/users/${id.parent_nid}`
        );
      }
      setData((prevData) => prevData.filter((item) => item.rfid !== id.rfid));
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Data successfully deleted!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
      console.error("Error deleting student:", error);
    }
  }
};

export const functionOpenQR = async (QRModal, data) => {
  console.log(data);
  if (QRModal.current) {
    QRModal.current.showModal();
    const formatData = {
      session: data,
      scan: true,
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/create-session`,
        formatData
      );
    } catch (error) {
      console.log(error);
    }
  }
};

export const functionCloseQR = async (
  QRModal,
  data,
  fetchStopSession = false
) => {
  if (QRModal.current) {
    QRModal.current.close();
  }

  if (fetchStopSession) {
    const formatData = {
      session: data,
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/stop-session`,
        formatData
      );
    } catch (error) {
      console.log(error);
    }
  }
};

export const ConnnectSession = async (setLoading, setIsConnected, data) => {
  setLoading(true);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/start-session`,
      { number: data }
    );
    if (response.data.success) {
      setIsConnected(false);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const DisconnectSession = async (setLoading, setIsConnected, data) => {
  setLoading(true);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/stop-session`,
      { number: data }
    );
    if (response.data.success) {
      setIsConnected(false);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const SubmitSession = async (event, setLoading, socket, data) => {
  event.preventDefault();

  let finalWaNum = data.number;
  if (finalWaNum.startsWith("08")) {
    finalWaNum = "62" + finalWaNum.slice(1);
  }

  const updatedData = { ...data, number: finalWaNum };
  setLoading(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/create-whatsapp-creds`,
      updatedData
    );
    if (response.data.success) {
      socket.emit("new-data", updatedData);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const DeleteSession = async (setLoading, setData, data) => {
  setLoading(true);
  const confirmDelete = await Swal.fire({
    title: "Are you sure?",
    text: "Jika Sesi di hapus maka tidak ada notifikasi ke orang tua siwa!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Cancel",
  });

  if (confirmDelete.isConfirmed) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/delete-whatsapp-creds/${data}`
      );
      if (response.data.success) {
        setData({
          number: "",
          name: "",
          status: "Pending",
        });
      }
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Session has been deleted.`,
        showConfirmButton: false,
        timer: 1500,
      });
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
      console.error("Error deleting subject:", error);
    } finally {
      setLoading(false);
    }
  }
};

export const fetchThresholdData = async (
  setCheckInTime,
  setCheckOutEntries,
  setDefaultCheckOutTime,
  setAvailableClasses
) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/threshold`
    );
    const data = response.data.data;

    // Set Check-In Time
    const defaultCheckInEntry = data.find(
      (entry) => entry.class_id === 1 && entry.method === 1001
    );

    if (defaultCheckInEntry) {
      const checkInTime = moment.utc(defaultCheckInEntry.time).format("HH:mm");
      setCheckInTime(checkInTime);
    }

    // Set Check-Out Entries
    const checkOutEntries = data
      .filter((entry) => entry.method === 1002 && entry.custom_time !== null)
      .map((entry) => ({
        class: entry.class_id,
        time: moment.utc(entry.time).format("HH:mm"),
      }));

    setCheckOutEntries(checkOutEntries);

    // Set Default Check-Out Time
    const defaultCheckOutEntry = data.find(
      (entry) => entry.method === 1002 && entry.custom_time === null
    );

    if (defaultCheckOutEntry) {
      const checkOutTime = moment
        .utc(defaultCheckOutEntry.time)
        .format("HH:mm");
      setDefaultCheckOutTime(checkOutTime);
    }

    // Set Available Classes
    const optionRemain = data
      .filter((entry) => entry.method === 1002 && entry.custom_time == null)
      .map((entry) => entry.class_id);

    setAvailableClasses(optionRemain);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const CheckInSubmit = async (checkInTime) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/threshold/check-in`,
      {
        time: checkInTime,
      }
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `Waktu check-in berhasil di set pada pukul ${checkInTime}.`,
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error submitting check-in:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Terdapat kesalahan dengan server.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

export const DefaultCheckOutSubmit = async (defaultCheckOutTime) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/threshold/check-out`,
      {
        time: defaultCheckOutTime,
      }
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `Waktu check-out berhasil di set pada pukul ${defaultCheckOutTime}.`,
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error submitting check-out:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Terdapat kesalahan dengan server.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

export const EachClassCheckOutSubmit = async (classEntry) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/threshold/check-out/${
        classEntry.class
      }`,
      {
        time: classEntry.time,
      }
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `Waktu custom check-out berhasil diatur.`,
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error submitting check-out:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Terdapat kesalahan dengan server.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

export const DeleteCheckOut = async (
  index,
  checkOutEntries,
  setCheckOutEntries,
  setAvailableClasses
) => {
  const entryToDelete = checkOutEntries[index];
  const updatedEntries = checkOutEntries.filter((_, i) => i !== index);

  try {
    await axios.put(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/threshold/check-out/${
        entryToDelete.class
      }`,
      {
        time: "13:00:00",
      }
    );

    setCheckOutEntries(updatedEntries);
    setAvailableClasses((prev) => [...prev, entryToDelete.class]);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `Waktu check-out untuk Kelas ${entryToDelete.class} telah diatur ulang ke waktu default.`,
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error submitting check-out:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Terdapat kesalahan dengan server.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
