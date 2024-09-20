import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "../../components/input/TextInput";
import SingleButton from "../../components/button/Button";
import { setPageTitle } from "../../redux/headerSlice";
import axios from "axios";
import { updateTeacherData } from "../../app/api/v1/admin-services";

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
    class: 0,
    address: "",
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/teachers/${id}`
        );
        const formattedData = {
          ...response.data.data,
          birth_of_date: new Date(response.data.data.birth_of_date)
            .toISOString()
            .split("T")[0],
          class_id: String(response.data.data.class_id),
        };
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
        class: value === "Subject Teacher" ? null : 1,
      }));
    } else if (name === "nid") {
      setTeacherData({
        ...teacherData,
        [name]: value === "" ? "" : Number(value),
      });
    } else {
      setTeacherData({
        ...teacherData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateTeacherData(
      teacherData,
      id,
      setTeacherData,
      setLoading
    );
    if (success) {
      navigate("/teacher");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Edit Guru" }));
  }, []);
  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-5 px-10 font-poppins">
        <form onSubmit={handleSubmit}>
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
                Tempat Lahir Guru :
              </label>
              <div className="mt-2">
                <TextInput
                  id="birth_of_place"
                  name="birth_of_place"
                  type="text"
                  label="Tempat Lahir"
                  value={teacherData.birth_of_place}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tanggal Lahir Guru :
              </label>
              <div className="mt-2">
                <TextInput
                  id="birth_of_date"
                  name="birth_of_date"
                  type="date"
                  label="Tempat Lahir"
                  value={teacherData.birth_of_date}
                  onChange={handleChange}
                  required
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
                  value={teacherData.gender}
                  className="border p-3 rounded-md w-full"
                  required
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
                  onChange={handleChange}
                  value={teacherData.type}
                  className="border p-3 rounded-md w-full"
                  required
                >
                  <option value="Class Teacher">Wali Kelas</option>
                  <option value="Subject Teacher">Guru Mapel</option>
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
                    onChange={handleChange}
                    value={teacherData.class}
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
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <SingleButton
              btnTitle={loading ? "loading" : "Edit"}
              type="submit"
              className={`px-4 py-2 ${
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
    </div>
  );
}

export default EditTeacher;
