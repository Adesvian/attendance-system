import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import SingleButton from "../../components/button/Button";
import axios from "axios";

function CreatePermit() {
  const dispatch = useDispatch();
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
  }, []);

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

      // Set the original file to formData
      setFormData((prevData) => ({
        ...prevData,
        file: file,
      }));

      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Generate the new file name here
      const firstName = formData.name.split(" ")[0]; // Ambil nama depan
      const fileExtension = formData.file.name.split(".").pop(); // Ambil ekstensi file
      const newFileName = `${firstName}-${rfid}.${fileExtension}`; // Buat nama file baru

      // Create a new File object with the modified name
      const renamedFile = new File([formData.file], newFileName, {
        type: formData.file.type,
      });

      // Konversi tanggal menjadi epoch Unix time
      const Data = {
        ...formData,
        date: Math.floor(new Date(formData.date).getTime() / 1000),
        rfid,
        file: renamedFile, // Ganti file dengan file yang sudah dinamai
      };

      // Create FormData object to send the file and data
      const formDataToSend = new FormData();
      for (const key in Data) {
        formDataToSend.append(key, Data[key]);
      }

      try {
        const response = await axios.post(
          "http://localhost:3001/permits",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          // Handle success (e.g., show a success message or reset the form)
          console.log("Permit submitted successfully!");
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
        // Handle error (e.g., show an error message)
        setErrors((prevErrors) => ({
          ...prevErrors,
          submit: "Failed to submit permit. Please try again.",
        }));
      }
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
        <form
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4"
        >
          <h2 className="text-lg font-semibold mb-4">Form Surat Izin</h2>

          <input
            type="text"
            ref={id}
            id="id"
            name="id"
            value="BE21CD23"
            className={`border rounded-md p-2 hidden`}
            readOnly
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`border rounded-md p-2 w-full ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Masukkan nama"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium mb-1">
                Kelas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className={`border rounded-md p-2 w-full ${
                  errors.class ? "border-red-500" : ""
                }`}
                placeholder="Masukkan kelas"
              />
              {errors.class && (
                <span className="text-red-500 text-sm">{errors.class}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium mb-1"
              >
                Alasan <span className="text-red-500">*</span>
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={`border rounded-md p-2 w-full ${
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
              <input
                type="date"
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
              className="border rounded-md p-2 w-full"
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

            {/* Preview Gambar */}
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
      </div>
    </>
  );
}

export default CreatePermit;
