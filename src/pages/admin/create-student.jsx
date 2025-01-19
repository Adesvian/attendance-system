import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import TextInput from "../../components/input/TextInput";
import SingleButton from "../../components/button/Button";
import { io } from "socket.io-client";
import {
  handleChangeParentData,
  submitStudentData,
} from "../../app/api/v1/admin-services";
import axiosInstance from "../../app/api/auth/axiosConfig";

const socket = io(`${import.meta.env.VITE_SOCKET_URL_BACKEND}`);

function CreateStudent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [parentData, setParentData] = useState([]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) =>
      handleChangeParentData(prevData, parentData, name, value)
    );
  };

  useEffect(() => {
    if (studentData.parent_type === "exist") {
      const parentExist = parentData.find(
        (parent) => parent.nid === studentData.parent_exist
      );
      if (parentExist) {
        setStudentData((prevData) => ({
          ...prevData,
          parent_nid: parentExist.nid,
          parent_name: parentExist.name,
          parent_gender: parentExist.gender,
          parent_birth_of_place: parentExist.birth_of_place,
          parent_birth_of_date: parentExist.birth_of_date,
        }));
      }
    }
  }, [studentData.parent_exist, studentData.parent_type, parentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setLoading(true);

    const success = await submitStudentData(studentData, setLoading);
    if (success) {
      navigate("/data-siswa");
    }
  };

  useEffect(() => {
    socket.emit("form-opened", { page: "form-c-student" });

    const fetchParentData = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/parents`
        );
        setParentData(response.data.data);
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };

    fetchParentData();
    dispatch(setPageTitle({ title: "Tambah Siswa" }));

    const handleGetUid = (data) => {
      setStudentData((prevData) => ({
        ...prevData,
        rfid: data,
      }));
    };

    socket.on("get-uid", handleGetUid);
    return () => {
      socket.emit("form-closed", { page: "form-c-student" });
      socket.off("get-uid", handleGetUid);
    };
  }, []);
  return (
    <>
      <div
        role="alert"
        className="alert bg-gray-200 dark:bg-base-300 text-gray-500 dark:text-white border-none "
        data-testid="add-student-element"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info h-6 w-6 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Silahkan Tempelkan kartu RFID ke reader untuk membaca kartu</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-2 font-poppins">
          <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="rfid"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
              >
                RFID Siswa :
              </label>
              <div className="mt-2">
                <TextInput
                  id="rfid"
                  name="rfid"
                  type="text"
                  label="Tap card on reader"
                  value={studentData.rfid}
                  onChange={handleChange}
                  className="bg-[#F2F2F2]"
                  readOnly
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text bg-indi"
              >
                Nama Siswa :
              </label>
              <div className="mt-2">
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  label="Nama"
                  value={studentData.name}
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
                Tempat Lahir Siswa :
              </label>
              <div className="mt-2">
                <TextInput
                  id="birth_of_place"
                  name="birth_of_place"
                  type="text"
                  label="Tempat Lahir"
                  value={studentData.birth_of_place}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
              >
                Tanggal Lahir Siswa :
              </label>
              <div className="mt-2">
                <TextInput
                  id="birth_of_date"
                  name="birth_of_date"
                  type="date"
                  label="Tempat Lahir"
                  value={studentData.birth_of_date}
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
                  value={studentData.gender}
                  className="border dark:border-none p-3 rounded-md w-full dark:bg-base-300"
                  required
                >
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-1 mt-3 lg:mt-0">
              <label
                htmlFor="class"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
              >
                Kelas :
              </label>
              <div className="mt-2">
                <select
                  name="class"
                  id="class"
                  onChange={handleChange}
                  value={studentData.class}
                  className="border dark:border-none p-3 rounded-md w-full dark:bg-base-300"
                  required
                >
                  <option value="1">Kelas 1</option>
                  <option value="2">Kelas 2</option>
                  <option value="3">Kelas 3</option>
                  <option value="4">Kelas 4</option>
                  <option value="5">Kelas 5</option>
                  <option value="6">Kelas 6</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
            <div className="sm:col-span-6 mt-3 lg:mt-0">
              <label
                htmlFor="parent_type"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
              >
                Wali Murid :
              </label>
              <div className="mt-2">
                <select
                  name="parent_type"
                  id="parent_type"
                  onChange={handleChange}
                  value={studentData.parent_type}
                  className="border dark:border-none p-3 rounded-md w-full dark:bg-base-300"
                  required
                >
                  <option value="new">Input Data Wali</option>
                  <option value="exist">Pilih Dari Data Yang Ada</option>
                </select>
              </div>
            </div>
            {studentData.parent_type === "exist" && (
              <div className="sm:col-span-6">
                <label
                  htmlFor="parent_exist"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  Pilih Wali Murid :
                </label>
                <div className="mt-2">
                  <select
                    name="parent_exist"
                    id="parent_exist"
                    onChange={handleChange}
                    className="border dark:border-none p-3 rounded-md w-full dark:bg-base-300"
                    required
                  >
                    <option value="">Pilih Data Wali</option>
                    {parentData.map((parent) => (
                      <option key={parent.nid} value={parent.nid}>
                        {parent.nid} - {parent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {studentData.parent_type === "exist" && (
            <div className="flex justify-end mt-5">
              <SingleButton
                btnTitle={loading ? "loading" : "Submit"}
                type="submit"
                className={`px-4 py-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none flex items-center justify-center`}
                disabled={loading}
              >
                {loading && (
                  <span className="loading loading-spinner text-primary mr-2"></span>
                )}{" "}
              </SingleButton>
            </div>
          )}
        </div>

        {studentData.parent_type === "new" && (
          <div className="p-2 font-poppins">
            <div className="mt-5 grid grid-cols-1 gap-x-5 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="parent_nid"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  NIK Wali Murid :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="parent_nid"
                    name="parent_nid"
                    type="number"
                    label="NIK"
                    value={studentData.parent_nid}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="parent_name"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  Nama Wali Murid :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="parent_name"
                    name="parent_name"
                    type="text"
                    label="Nama"
                    value={studentData.parent_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="parent_birth_of_place"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  Tempat Lahir Wali :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="parent_birth_of_place"
                    name="parent_birth_of_place"
                    type="text"
                    label="Tempat Lahir Wali"
                    value={studentData.parent_birth_of_place}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="parent_birth_of_date"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  Tanggal Lahir Wali :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="parent_birth_of_date"
                    name="parent_birth_of_date"
                    type="date"
                    label="Tempat Lahir"
                    value={studentData.parent_birth_of_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="parent_gender"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  Jenis Kelamin :
                </label>
                <div className="mt-2">
                  <select
                    name="parent_gender"
                    id="parent_gender"
                    onChange={handleChange}
                    value={studentData.parent_gender}
                    className="border dark:border-none p-3 rounded-md w-full dark:bg-base-300"
                    required
                  >
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="phone_num"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  No Whatsapp Wali :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="phone_num"
                    name="phone_num"
                    type="text"
                    label="No Whatsapp Wali"
                    value={studentData.phone_num}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  Alamat Siswa :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="address"
                    name="address"
                    type="text"
                    label="Alamat Siswa"
                    value={studentData.address}
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
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    value={studentData.username}
                    onChange={handleChange}
                    required
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
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={studentData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <SingleButton
                btnTitle={loading ? "loading" : "Submit"} // Change title based on loading state
                type="submit"
                className={`px-4 py-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none flex items-center justify-center`}
                disabled={loading}
              >
                {loading && (
                  <span className="loading loading-spinner text-primary mr-2"></span>
                )}{" "}
              </SingleButton>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default CreateStudent;
