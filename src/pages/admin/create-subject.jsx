import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import TextInput from "../../components/input/TextInput";
import SingleButton from "../../components/button/Button";
import { submitSubjectData } from "../../app/api/v1/admin-services";

function CreateTeacher() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [subjectData, setsubjectData] = useState({
    name: "",
    category_id: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setsubjectData({
      ...subjectData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitSubjectData(subjectData, setLoading);
    if (success) {
      navigate("/data-mapel");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tambah Mata Pelajaran" }));
  }, []);
  return (
    <div className="p-2 font-poppins">
      <form onSubmit={handleSubmit}>
        {/* Nama Subject */}
        <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Nama Mata Pelajaran :
            </label>
            <div className="mt-2">
              <TextInput
                id="name"
                name="name"
                type="text"
                label="Nama Mata Pelajaran"
                value={subjectData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="category_id"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
            >
              Category Mapel :
            </label>
            <div className="mt-2">
              <select
                name="category_id"
                id="category_id"
                onChange={handleChange}
                value={subjectData.category_id}
                className="border dark:border-none p-3 rounded-md w-full dark:bg-base-300"
                required
              >
                <option value="1">Wajib</option>
                <option value="2">Mulok</option>
              </select>
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
      </form>
    </div>
  );
}

export default CreateTeacher;
