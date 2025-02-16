import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "../../components/input/TextInput";
import SingleButton from "../../components/button/Button";
import { setPageTitle } from "../../redux/headerSlice";
import { updateTeacherData } from "../../app/api/v1/admin-services";
import axiosInstance from "../../app/api/auth/axiosConfig";

function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState({
    nid: "",
    name: "",
    gender: "Laki-Laki",
    birth_of_place: "",
    birth_of_date: "",
    type: "Class Teacher",
    education_level: "PG",
    class: 9,
    address: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const [teacher, user] = await Promise.all([
          axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/teachers/${id}`
          ),
          axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/users/${id}`
          ),
        ]);
        const response = {
          teacher: teacher.data.data,
          user: user.data.data,
        };
        const formattedData = {
          ...response.teacher,
          username: response.user.username,
          password: "",
          birth_of_date:
            response.teacher.birth_of_date === null
              ? ""
              : new Date(response.teacher.birth_of_date)
                  .toISOString()
                  .split("T")[0],
          class: String(response.teacher.class.id),
        };
        delete formattedData.class_id;
        setTeacherData(formattedData);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setTeacherData((prevData) => ({
        ...prevData,
        [name]: value,
        class:
          value === "Subject Teacher" || value === "Ekstra Teacher" ? null : 1,
      }));
    } else if (name === "nid") {
      setTeacherData({
        ...teacherData,
        [name]: value === "" ? "" : String(value),
      });
    } else if (name === "education_level") {
      // Mengatur class sesuai jenjang
      setTeacherData((prevData) => ({
        ...prevData,
        [name]: value,
        class: value === "PG" ? 9 : value === "TK" ? 7 : 1,
      }));
    } else {
      setTeacherData({
        ...teacherData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(teacherData);
    const success = await updateTeacherData(teacherData, id, setLoading);
    if (success) {
      navigate("/teacher");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Edit Guru" }));
  }, []);
  return (
    <div className="p-2 font-poppins" data-testid="edit-teacher-element">
      <form onSubmit={handleSubmit}>
        {/* NIK Guru */}
        <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="nid"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              NIK Guru :
            </label>
            <div className="mt-2">
              <TextInput
                className={"dark:bg-base-300 dark:text-gray-400"}
                id="nid"
                name="nid"
                type="number"
                label="NIK"
                value={teacherData.nid}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Nama Guru :
            </label>
            <div className="mt-2">
              <TextInput
                className={"dark:bg-base-300 dark:text-gray-400"}
                id="name"
                name="name"
                type="text"
                label="Nama"
                value={teacherData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="birth_of_place"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Tempat Lahir Guru :
            </label>
            <div className="mt-2">
              <TextInput
                className={"dark:bg-base-300 dark:text-gray-400"}
                id="birth_of_place"
                name="birth_of_place"
                type="text"
                label="Tempat Lahir"
                value={teacherData.birth_of_place}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Tanggal Lahir Guru :
            </label>
            <div className="mt-2">
              <TextInput
                className={"dark:bg-base-300 dark:text-gray-400"}
                id="birth_of_date"
                name="birth_of_date"
                type="date"
                label="Tempat Lahir"
                value={teacherData.birth_of_date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="gender"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Jenis Kelamin :
            </label>
            <div className="mt-2">
              <select
                name="gender"
                id="gender"
                onChange={handleChange}
                value={teacherData.gender}
                className="border dark:border-none p-3 rounded-md w-full dark:bg-base-300"
                required
              >
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6 gap-y-3 sm:gap-y-0">
          <div className="sm:col-span-3 mt-4 sm:mt-0">
            <label
              htmlFor="type"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Tipe Guru :
            </label>
            <div className="mt-2">
              <select
                name="type"
                id="type"
                onChange={handleChange}
                value={teacherData.type}
                className="border dark:border-none p-3 rounded-md w-full dark:bg-base-300"
                required
              >
                <option value="Class Teacher">Wali Kelas</option>
                <option value="Subject Teacher">Guru Mapel</option>
                <option value="Ekstra Teacher">Guru Ekskul</option>
              </select>
            </div>
          </div>

          {teacherData.type === "Class Teacher" && (
            <>
              {/* Dropdown Jenjang */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text">
                  Jenjang:
                </label>
                <div className="mt-2">
                  <select
                    name="education_level"
                    value={teacherData.education_level}
                    onChange={handleChange}
                    className="border dark:border-none text-gray-900 p-3 rounded-md w-full dark:bg-base-300"
                    required
                  >
                    <option value="PG">Play Group</option>
                    <option value="TK">TK</option>
                    <option value="SD">SD</option>
                  </select>
                </div>
              </div>

              {/* Dropdown Kelas */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text">
                  Kelas:
                </label>
                <div className="mt-2">
                  <select
                    name="class"
                    id="class"
                    onChange={handleChange}
                    value={teacherData.class}
                    className="border dark:border-none text-gray-900 p-3 rounded-md w-full dark:bg-base-300"
                    required
                    disabled={teacherData.education_level === "PG"} // PG ga punya kelas
                  >
                    {teacherData.education_level === "TK" && (
                      <>
                        <option value="7">A</option>
                        <option value="8">B</option>
                      </>
                    )}
                    {teacherData.education_level === "SD" &&
                      [1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          Kelas {num}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Alamat Guru :
            </label>
            <div className="mt-2">
              <TextInput
                className={"dark:bg-base-300 dark:text-gray-400"}
                id="address"
                name="address"
                type="text"
                label="Alamat"
                value={teacherData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Username :
            </label>
            <div className="mt-2">
              <TextInput
                className={"dark:bg-base-300 dark:text-gray-400"}
                id="username"
                name="username"
                type="text"
                label="Username"
                value={teacherData.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Password :
            </label>
            <div className="mt-2">
              <TextInput
                className={"dark:bg-base-300 dark:text-gray-400"}
                id="password"
                name="password"
                type="password"
                label="Password"
                value={teacherData.password}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <SingleButton
            btnTitle={loading ? "loading" : "Edit"}
            type="submit"
            className={`px-7 py-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            } bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none flex items-center justify-center`}
            disabled={loading}
          >
            {loading && (
              <span className="loading loading-spinner text-primary mr-2"></span>
            )}{" "}
          </SingleButton>
        </div>
      </form>
    </div>
  );
}

export default EditTeacher;
