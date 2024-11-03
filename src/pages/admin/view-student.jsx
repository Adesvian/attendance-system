import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import TextInput from "../../components/input/TextInput";
import axiosInstance from "../../app/api/auth/axiosConfig";

function ViewStudent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    rfid: "",
    name: "",
    class: 1,
    gender: "Laki-Laki",
    birth_of_place: "",
    birth_of_date: "",
    parent_type: "new",
    parent_nid: "",
    parent_name: "",
    parent_gender: "Laki-Laki",
    parent_birth_of_place: "",
    parent_birth_of_date: "",
    phone_num: "",
    address: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentResponse = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/students/${id}`
        );

        const userResponse = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/users/${
            studentResponse.data.data.parent_nid
          }`
        );

        const student = studentResponse.data.data;
        const user = userResponse.data.data;

        const response = {
          rfid: student.rfid,
          name: student.name,
          class: student.class.name,
          gender: student.gender,
          birth_of_place: student.birth_of_place,
          birth_of_date:
            student.birth_of_date === null
              ? ""
              : new Date(student.birth_of_date).toISOString().split("T")[0],
          username: user.username,
          parent_nid: student.parent.nid,
          parent_name: student.parent.name,
          parent_gender: student.parent.gender,
          parent_birth_of_place: student.parent.birth_of_place,
          parent_birth_of_date:
            student.parent.birth_of_date === null
              ? ""
              : new Date(student.parent.birth_of_date)
                  .toISOString()
                  .split("T")[0],
          phone_num: student.parent.phone_num,
          address: student.parent.address,
        };

        const formatData = (data) => {
          const formattedData = {};
          for (const key in data) {
            formattedData[key] = data[key] === null ? "" : data[key];
          }
          return formattedData;
        };

        const formattedData = formatData(response);

        setStudentData(formattedData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, []);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Detail Siswa" }));
  }, []);

  return (
    <>
      <div className="p-2 font-poppins" data-testid="detail-student-element">
        <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="rfid"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              RFID Siswa :
            </label>
            <div className="mt-2">
              <TextInput
                id="rfid"
                name="rfid"
                type="text"
                label="Tap card on reader"
                onChange={() => {}}
                value={studentData.rfid}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Nama Siswa :
            </label>
            <div className="mt-2">
              <TextInput
                id="name"
                name="name"
                type="text"
                label="Nama"
                onChange={() => {}}
                value={studentData.name}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="birth_of_place"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Tempat Lahir Siswa :
            </label>
            <div className="mt-2">
              <TextInput
                id="birth_of_place"
                name="birth_of_place"
                type="text"
                label="Tempat Lahir"
                onChange={() => {}}
                value={studentData.birth_of_place}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Tanggal Lahir Siswa :
            </label>
            <div className="mt-2">
              <TextInput
                id="birth_of_date"
                name="birth_of_date"
                type="date"
                label="Tempat Lahir"
                onChange={() => {}}
                value={studentData.birth_of_date}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label
              htmlFor="gender"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Jenis Kelamin :
            </label>
            <div className="mt-2">
              <TextInput
                id="gender"
                name="gender"
                type="text"
                label="Jenis Kelamin"
                onChange={() => {}}
                value={studentData.gender}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="class"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Kelas :
            </label>
            <div className="mt-2">
              <TextInput
                id="class"
                name="class"
                type="text"
                label="Kelas"
                onChange={() => {}}
                value={studentData.class}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 font-poppins">
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Username :
            </label>
            <div className="mt-2">
              <TextInput
                id="username"
                name="username"
                type="text"
                label="Username"
                onChange={() => {}}
                value={studentData.username}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-x-5 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="parent_nid"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              NIK Wali Murid :
            </label>
            <div className="mt-2">
              <TextInput
                id="parent_nid"
                name="parent_nid"
                type="number"
                label="NIK"
                onChange={() => {}}
                value={studentData.parent_nid}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="parent_name"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Nama Wali Murid :
            </label>
            <div className="mt-2">
              <TextInput
                id="parent_name"
                name="parent_name"
                type="text"
                label="Nama"
                onChange={() => {}}
                value={studentData.parent_name}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="parent_birth_of_place"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Tempat Lahir Wali :
            </label>
            <div className="mt-2">
              <TextInput
                id="parent_birth_of_place"
                name="parent_birth_of_place"
                type="text"
                label="Tempat Lahir Wali"
                onChange={() => {}}
                value={studentData.parent_birth_of_place}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="parent_birth_of_date"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Tanggal Lahir Wali :
            </label>
            <div className="mt-2">
              <TextInput
                id="parent_birth_of_date"
                name="parent_birth_of_date"
                type="date"
                label="Tempat Lahir"
                onChange={() => {}}
                value={studentData.parent_birth_of_date}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label
              htmlFor="parent_gender"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Jenis Kelamin :
            </label>
            <div className="mt-2">
              <TextInput
                id="parent_gender"
                name="parent_gender"
                type="text"
                label="Jenis Kelamin"
                onChange={() => {}}
                value={studentData.parent_gender}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="phone_num"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              No Whatsapp Wali :
            </label>
            <div className="mt-2">
              <TextInput
                id="phone_num"
                name="phone_num"
                type="text"
                label="No Whatsapp Wali"
                onChange={() => {}}
                value={studentData.phone_num}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Alamat Siswa :
            </label>
            <div className="mt-2">
              <TextInput
                id="address"
                name="address"
                type="text"
                label="Alamat Siswa"
                onChange={() => {}}
                value={studentData.address}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewStudent;
