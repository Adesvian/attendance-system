import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import TextInput from "../../components/input/TextInput";
import SingleButton from "../../components/button/Button";
import axios from "axios";
import { io } from "socket.io-client";
import {
  handleChangeParentData,
  submitStudentData,
  updateStudentData,
} from "../../app/api/v1/admin-services";

function EditStudent() {
  const { id } = useParams();
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
    isnew: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setStudentData((prevData) =>
      handleChangeParentData(prevData, parentData, name, newValue)
    );
  };
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/students/${id}`
        );

        const userResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/users/${
            studentResponse.data.data.parent_nid
          }`
        );

        const student = studentResponse.data.data;
        const user = userResponse.data.data;

        const response = {
          rfid: student.rfid,
          name: student.name,
          class: student.class.id,
          gender: student.gender,
          birth_of_place: student.birth_of_place,
          birth_of_date:
            student.birth_of_date === null
              ? ""
              : new Date(student.birth_of_date).toISOString().split("T")[0],
          username: user.username,
          password: "",
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
          parent_type: "new",
          isnew: false,
          default_nid: student.parent.nid,
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
    const success = await updateStudentData(studentData, id, setLoading);
    if (success) {
      navigate("/data-siswa");
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("rfidData", (data) => {
      setStudentData((prevData) => ({
        ...prevData,
        rfid: data,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/parents`
        );
        setParentData(response.data.data);
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };

    fetchParentData();
    dispatch(setPageTitle({ title: "Tambah Siswa" }));
  }, []);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
          <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-5 px-10 font-poppins">
            <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="rfid"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  RFID Siswa :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="rfid"
                    name="rfid"
                    type="text"
                    label="Tap card on reader"
                    value={studentData.rfid || ""}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nama Siswa :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="name"
                    name="name"
                    type="text"
                    label="Nama"
                    value={studentData.name || ""}
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
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tempat Lahir Siswa :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="birth_of_place"
                    name="birth_of_place"
                    type="text"
                    label="Tempat Lahir"
                    value={studentData.birth_of_place || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tanggal Lahir Siswa :
                </label>
                <div className="mt-2">
                  <TextInput
                    id="birth_of_date"
                    name="birth_of_date"
                    type="date"
                    label="Tempat Lahir"
                    value={studentData.birth_of_date || ""}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    value={studentData.gender || "Laki-Laki"}
                    className="border p-3 rounded-md w-full"
                    required
                  >
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-1">
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
                    onChange={handleChange}
                    value={studentData.class}
                    className="border p-3 rounded-md w-full"
                    required
                  >
                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="3">Kelas 5</option>
                    <option value="4">Kelas 6</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="parent_type"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Wali Murid :
                </label>
                <div className="mt-2">
                  <select
                    name="parent_type"
                    id="parent_type"
                    onChange={handleChange}
                    value={studentData.parent_type || "new"}
                    className="border p-3 rounded-md w-full"
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
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Pilih Wali Murid :
                  </label>
                  <div className="mt-2">
                    <select
                      name="parent_exist"
                      id="parent_exist"
                      onChange={handleChange}
                      className="border p-3 rounded-md w-full"
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
                  } bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none flex items-center justify-center`}
                  disabled={loading}
                >
                  {loading && (
                    <span className="loading loading-spinner text-primary mr-2"></span>
                  )}{" "}
                </SingleButton>
              </div>
            )}
          </div>
        </div>

        {studentData.parent_type === "new" && (
          <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 my-5">
            <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-5 px-10 font-poppins">
              <div className="flex my-6 mb-10 gap-x-2 text-sm">
                <input
                  id="isnew"
                  name="isnew"
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                  defaultChecked={studentData.isnew || false}
                  onChange={handleChange}
                />
                Dengan mencentang ini maka data wali murid yang di submit akan
                diinputkan sebagai
                <span className="text-red-600 font-medium">
                  data wali murid baru
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-x-5 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="parent_nid"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    NIK Wali Murid :
                  </label>
                  <div className="mt-2">
                    <TextInput
                      id="parent_nid"
                      name="parent_nid"
                      type="number"
                      label="NIK"
                      value={studentData.parent_nid || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="parent_name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nama Wali Murid :
                  </label>
                  <div className="mt-2">
                    <TextInput
                      id="parent_name"
                      name="parent_name"
                      type="text"
                      label="Nama"
                      value={studentData.parent_name || ""}
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
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tempat Lahir Wali :
                  </label>
                  <div className="mt-2">
                    <TextInput
                      id="parent_birth_of_place"
                      name="parent_birth_of_place"
                      type="text"
                      label="Tempat Lahir Wali"
                      value={studentData.parent_birth_of_place || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label
                    htmlFor="parent_birth_of_date"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tanggal Lahir Wali :
                  </label>
                  <div className="mt-2">
                    <TextInput
                      id="parent_birth_of_date"
                      name="parent_birth_of_date"
                      type="date"
                      label="Tempat Lahir"
                      value={studentData.parent_birth_of_date || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="parent_gender"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Jenis Kelamin :
                  </label>
                  <div className="mt-2">
                    <select
                      name="parent_gender"
                      id="parent_gender"
                      onChange={handleChange}
                      value={studentData.parent_gender || ""}
                      className="border p-3 rounded-md w-full"
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
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    No Whatsapp Wali :
                  </label>
                  <div className="mt-2">
                    <TextInput
                      id="phone_num"
                      name="phone_num"
                      type="text"
                      label="No Whatsapp Wali"
                      value={studentData.phone_num || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Alamat Siswa :
                  </label>
                  <div className="mt-2">
                    <TextInput
                      id="address"
                      name="address"
                      type="text"
                      label="Alamat Siswa"
                      value={studentData.address || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
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
                      value={studentData.username || ""}
                      onChange={handleChange}
                      required
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
                      type="password"
                      label="Password"
                      value={studentData.password || ""}
                      onChange={handleChange}
                      required={studentData.isnew ? true : false}
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
                  } bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none flex items-center justify-center`}
                  disabled={loading}
                >
                  {loading && (
                    <span className="loading loading-spinner text-primary mr-2"></span>
                  )}{" "}
                </SingleButton>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default EditStudent;
