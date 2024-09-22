import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import TextInput from "../../components/input/TextInput";
import axios from "axios";

function ViewTeacher() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState({
    nid: "",
    name: "",
    gender: "Laki-Laki",
    birth_of_place: "",
    birth_of_date: "",
    type: "Class Teacher",
    class: 0,
    address: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        const [teacher, user] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/teachers/${id}`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/users/${id}`),
        ]);
        const response = {
          teacher: teacher.data.data,
          user: {
            username: user.data.data.username,
          },
        };
        const formattedData = {
          ...response.teacher,
          birth_of_date:
            response.teacher.birth_of_date == null
              ? ""
              : new Date(response.teacher.birth_of_date)
                  .toISOString()
                  .split("T")[0],
          class:
            response.teacher.type === "Class Teacher"
              ? String(response.teacher.class_id)
              : null,
          username: response.user.username,
        };
        setTeacherData(formattedData);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
    dispatch(setPageTitle({ title: "Detail Guru" }));
  }, []);

  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-5 px-10 font-poppins">
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
                value={teacherData.username}
                onChange={() => {}}
                className="dark:bg-base-300 dark:text-dark-text"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="nid"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              NIK Guru :
            </label>
            <div className="mt-2">
              <TextInput
                id="nid"
                name="nid"
                type="text"
                label="NIK"
                value={teacherData.nid}
                className="dark:bg-base-300 dark:text-dark-text"
                onChange={() => {}}
                readOnly
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Nama Guru :
            </label>
            <div className="mt-2">
              <TextInput
                id="name"
                name="name"
                type="text"
                label="Nama"
                value={teacherData.name}
                className="dark:bg-base-300 dark:text-dark-text"
                onChange={() => {}}
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
              Tempat Lahir Guru :
            </label>
            <div className="mt-2">
              <TextInput
                id="birth_of_place"
                name="birth_of_place"
                type="text"
                label="Tempat Lahir"
                value={teacherData.birth_of_place}
                className="dark:bg-base-300 dark:text-dark-text"
                onChange={() => {}}
                readOnly
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="birth_of_date"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Tanggal Lahir Guru :
            </label>
            <div className="mt-2">
              <TextInput
                id="birth_of_date"
                name="birth_of_date"
                type="date"
                label="Tanggal Lahir"
                value={teacherData.birth_of_date}
                className="dark:bg-base-300 dark:text-dark-text"
                onChange={() => {}}
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
                value={teacherData.gender}
                className="dark:bg-base-300 dark:text-dark-text"
                onChange={() => {}}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="type"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Tipe Guru :
            </label>
            <div className="mt-2">
              <TextInput
                id="type"
                name="type"
                type="text"
                label="Tipe Guru"
                value={
                  teacherData.type === "Class Teacher"
                    ? "Wali Kelas"
                    : "Guru Mapel"
                }
                className="dark:bg-base-300 dark:text-dark-text"
                onChange={() => {}}
                readOnly
              />
            </div>
          </div>

          {teacherData.type === "Class Teacher" && (
            <div className="sm:col-span-3">
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
                  value={`Kelas ${teacherData.class}`}
                  className="dark:bg-base-300 dark:text-dark-text"
                  onChange={() => {}}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900  dark:text-dark-text"
            >
              Alamat Guru :
            </label>
            <div className="mt-2">
              <TextInput
                id="address"
                name="address"
                type="text"
                label="Alamat"
                value={teacherData.address}
                className="dark:bg-base-300 dark:text-dark-text"
                onChange={() => {}}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTeacher;
