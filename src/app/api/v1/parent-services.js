import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

export const fetchChildDataAttendanceRecords = async (
  selectedDate,
  child,
  holidays,
  setData
) => {
  if (!selectedDate) return setData([]);

  try {
    const [attendances, permits] = await Promise.all([
      axios.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance?rfid=${child.rfid}`
      ),
      axios.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/permits?rfid=${child.rfid}`
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

    const formattedData = () => {
      const attendance = Array(daysInMonth).fill("-");

      // Set weekend and holiday statuses
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

      // Update attendance with records
      filteredData.forEach((record) => {
        if (record.student_rfid === child.rfid) {
          attendance[moment(record.date, "YYYY-MM-DD").date() - 1] =
            methodMap[record.method] || "-";
        }
      });

      // Update attendance with permits
      processedPermits.forEach((permit) => {
        if (permit.student_rfid === child.rfid) {
          attendance[moment(permit.date, "YYYY-MM-DD").date() - 1] =
            methodMap[permit.reason.toLowerCase()] || "-";
        }
      });

      // Mark absent for past dates
      attendance.forEach((status, index) => {
        const currentDate = moment(selectedDate)
          .date(index + 1)
          .startOf("day");
        if (currentDate.isBefore(today) && status === "-") {
          attendance[index] = methodMap["alfa"];
        }
      });

      // Calculate counts and percentage
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
        name: child.name,
        attendance,
        hadir,
        absen,
        izin,
        sakit,
        percentage: effectiveDays
          ? ((hadir / effectiveDays) * 100).toFixed(1)
          : "0.0",
      };
    };
    setData([formattedData()]);
  } catch (error) {
    console.error("Error fetching data:", error);
    setData([]);
  }
};

export const fetchChildAttendanceData = async (user) => {
  try {
    const attendanceResponse = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/attendance?parent=${user.nid}`
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
      time: moment.unix(record.date).local().format("DD-MM-YYYY HH:mm:ss"),
      unixTime: record.date,
    }));

    return updatedData.sort((a, b) => b.unixTime - a.unixTime);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchChildSubjectAttendanceData = async (user) => {
  try {
    const subattendance = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/subject-attendance?parent=${
        user.nid
      }`
    );

    const updatedData = subattendance.data.data.map((record) => ({
      ...record,
      profile: `assets/icon/${
        record.student.gender === "Perempuan" ? "girl" : "boy"
      }-icon.png`,
      student_name: record.student.name,
      class: record.student.class.name,
      subject: record.subject.name,
      time: moment.unix(record.date).local().format("DD-MM-YYYY HH:mm:ss"),
      unixTime: record.date,
    }));

    return updatedData.sort((a, b) => b.unixTime - a.unixTime);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updatePassword = async (
  password,
  confirmPassword,
  parent_user,
  teacher_user,
  setPassword,
  setConfirmPassword
) => {
  // Validate passwords
  if (!password || !confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: "Password fields cannot be empty.",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }
  if (password !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Passwords do not match.",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  // Prepare the data to be sent
  const userData = {
    password,
  };

  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/users/${
        parent_user?.nid || teacher_user?.nid
      }`,
      userData
    );

    Swal.fire({
      icon: "success",
      title: "Success",
      text: response.data.msg,
      timer: 2000,
      showConfirmButton: false,
    });

    // Clear the password fields
    setPassword("");
    setConfirmPassword("");
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.msg
      : "Something went wrong. Please try again.";

    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

export const fetchPermitDataParent = async (parentUser) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/permits?parent=${
        parentUser.nid
      }`
    );
    const convertedData = await Promise.all(
      response.data.data.map(async (item) => {
        const studentResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/students/${
            item.student_rfid
          }`
        );
        const student = studentResponse.data;

        return {
          ...item,
          name: student.data.name,
          class: "Kelas " + item.class_id,
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

    return convertedData;
  } catch (error) {
    throw error;
  }
};

export const SubmitFormPermit = async (
  formData,
  setErrors,
  setFormData,
  id,
  navigate,
  fileInputRef,
  setFilePreview
) => {
  const newErrors = {};

  // Validasi input
  if (!formData.name) newErrors.name = "Nama harus diisi";
  if (!formData.class) newErrors.class = "Kelas harus diisi";
  if (!formData.reason) newErrors.reason = "Alasan harus dipilih";
  if (!formData.date) newErrors.date = "Tanggal harus diisi";
  if (!formData.file) newErrors.file = "File harus diupload";

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    const rfid = id.current.value;
    const firstName = formData.name.split(" ")[0];
    const fileExtension = formData.file.name.split(".").pop();
    const newFileName = `${firstName}-${rfid}.${fileExtension}`;

    const renamedFile = new File([formData.file], newFileName, {
      type: formData.file.type,
    });

    const Data = {
      ...formData,
      date: Math.floor(new Date(formData.date).getTime() / 1000),
      rfid,
      file: renamedFile,
    };

    const formDataToSend = new FormData();
    for (const key in Data) {
      formDataToSend.append(key, Data[key]);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/permits`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        // Menampilkan SweetAlert dengan timer
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Izin berhasil diajukan.",
          showConfirmButton: false,
          timer: 1500,
        });

        // Navigasi ke halaman permit setelah delay
        setTimeout(() => {
          navigate("/permit");
        }, 1500);

        // Reset form
        setFormData({
          name: "",
          class: "",
          reason: "",
          date: "",
          file: null,
          notes: "",
        });
        setFilePreview(null);
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting permit:", error);
      // Menampilkan alert error dengan timer
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Gagal mengirim izin. Silakan coba lagi.",
        showConfirmButton: false,
        timer: 1500,
      });

      setErrors((prevErrors) => ({
        ...prevErrors,
        submit: "Failed to submit permit. Please try again.",
      }));
    }
  }
};
