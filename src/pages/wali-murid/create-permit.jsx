import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import SingleButton from "../../components/button/Button";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { SubmitFormPermit } from "../../app/api/v1/parent-services";
import TextInput from "../../components/input/TextInput";

function CreatePermit() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const child = useSelector((state) => state.header.child);
  const id = useRef(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    reason: "",
    date: "",
    file: null,
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Buat Surat Izin" }));
  }, [dispatch]);

  useEffect(() => {
    if (child && Object.keys(child).length > 0) {
      setFormData({
        name: child.name || "",
        class: child.class?.id || "",
        reason: "",
        date: "",
        file: null,
        notes: "",
      });
    }
  }, [child]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes

    if (file && file.size > maxSize) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        file: "Ukuran file tidak boleh lebih dari 10MB.",
      }));
      setFilePreview(null);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, file: "" }));
      setFormData((prevData) => ({
        ...prevData,
        file: file,
      }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    SubmitFormPermit(
      formData,
      setErrors,
      setFormData,
      id,
      navigate,
      fileInputRef,
      setFilePreview
    );
  };

  return (
    <>
      <div
        role="alert"
        className="alert bg-gray-200 dark:bg-base-300 text-gray-500 dark:text-white border-none "
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
        <span>
          Izin berlaku 3 hari dari tanggal pengajuan setelah izin di setujui
        </span>
      </div>
      <form
        method="POST"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="p-2"
      >
        <h2 className="text-xl font-semibold mb-4">Form Surat Izin</h2>

        <input
          type="text"
          ref={id}
          id="id"
          name="id"
          value={child.rfid || ""}
          className="border rounded-md p-2 hidden"
          readOnly
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nama <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`border rounded-md p-2 w-full opacity-80 bg-gray-200 ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Masukkan nama"
              readOnly
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium mb-1">
              Kelas <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className={`border rounded-md p-2 w-full opacity-80 bg-gray-200 ${
                errors.class ? "border-red-500" : ""
              }`}
              placeholder="Masukkan kelas"
              readOnly
            />
            {errors.class && (
              <span className="text-red-500 text-sm">{errors.class}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-1">
              Alasan <span className="text-red-500">*</span>
            </label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className={`border dark:border-[#2B3039] dark:border-[2px] rounded-md p-2 w-full dark:bg-base-300 h-12 ${
                errors.reason ? "border-red-500" : ""
              }`}
            >
              <option value="">Pilih alasan</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
            </select>
            {errors.reason && (
              <span className="text-red-500 text-sm">{errors.reason}</span>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="date"
              isMinDateEnabled={true}
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`border rounded-md p-2 w-full ${
                errors.date ? "border-red-500" : ""
              }`}
            />
            {errors.date && (
              <span className="text-red-500 text-sm">{errors.date}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Catatan
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="border dark:border-[#2B3039] dark:border-[2px] rounded-md p-2 w-full dark:bg-base-300"
            placeholder="Masukkan keterangan tambahan (opsional)"
          ></textarea>
        </div>

        <div className="mb-4 flex">
          <div className="w-auto flex-none">
            <label htmlFor="file" className="block text-sm font-medium mb-1">
              Upload File (JPG/PNG) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              ref={fileInputRef}
              className={`border rounded-md p-2 w-full ${
                errors.file ? "border-red-500" : ""
              }`}
            />
            {errors.file && (
              <span className="text-red-500 text-sm">{errors.file}</span>
            )}
          </div>

          {filePreview && (
            <div className="ml-4 flex-grow">
              <img
                src={filePreview}
                alt="Preview"
                className="object-cover border rounded-md"
              />
            </div>
          )}
        </div>

        <SingleButton
          btnTitle={"Kirim"}
          type="submit"
          className="btn btn-primary btn-block text-white"
        />
      </form>
    </>
  );
}

export default CreatePermit;
