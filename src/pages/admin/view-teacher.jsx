import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import TextInput from "../../components/input/TextInput";
import axios from "axios";
import bcrypt from "bcrypt";

function ViewTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Initialize as loading
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
      try {
        const [teacher, user] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/teachers/${id}`),
          axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/users/${id}`),
        ]);
        const response = {
          teacher: teacher.data.data,
          user: {
            username: user.data.data.username,
            password: user.data.data.password,
          },
        };
        const formattedData = {
          ...response.teacher,
          birth_of_date: new Date(response.teacher.birth_of_date)
            .toISOString()
            .split("T")[0],
          class: String(response.teacher.class_id),
          username: response.user.username,
          password: await bcrypt.hash(response.user.password, 10),
        };
        setTeacherData(formattedData);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
    dispatch(setPageTitle({ title: "View Teacher" }));
  }, [id, dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-5 px-10 font-poppins">
        {/* NIK Guru */}
        <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="nid"
              className="block text-sm font-medium leading-6 text-gray-900"
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
                disabled
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
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
                disabled
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="birth_of_place"
              className="block text-sm font-medium leading-6 text-gray-900"
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
                disabled
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="birth_of_date"
              className="block text-sm font-medium leading-6 text-gray-900"
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
                disabled
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="gender"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Jenis Kelamin :
            </label>
            <div className="mt-2">
              <select
                name="gender"
                id="gender"
                value={teacherData.gender}
                className="border p-3 rounded-md w-full"
                disabled
              >
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tipe Guru :
            </label>
            <div className="mt-2">
              <select
                name="type"
                id="type"
                value={teacherData.type}
                className="border p-3 rounded-md w-full"
                disabled
              >
                <option value={teacherData.type}>
                  {teacherData.type === "Class Teacher"
                    ? "Wali Kelas"
                    : "Guru Mapel"}
                </option>
              </select>
            </div>
          </div>

          {teacherData.type === "Class Teacher" && (
            <div className="sm:col-span-3">
              <label
                htmlFor="class"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Kelas :
              </label>
              <div className="mt-2">
                <select
                  name="class"
                  id="class"
                  value={teacherData.class}
                  className="border p-3 rounded-md w-full"
                  disabled
                >
                  <option value={teacherData.class}>
                    Kelas {teacherData.class}
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900"
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
                disabled
              />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                    disabled
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="password"
                    name="password"
                    type="text"
                    label="Password"
                    value={teacherData.password}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTeacher;
