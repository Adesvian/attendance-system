import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "../../components/input/TextInput";
import SingleButton from "../../components/button/Button";
import axios from "axios";
import { updateSubject } from "../../app/api/v1/admin-services";
import { setPageTitle } from "../../redux/headerSlice";

function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [subjectData, setsubjectData] = useState({
    name: "",
    category_id: 1,
  });

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/subjects/${id}`
        );

        setsubjectData(response.data.data);
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    fetchSubjectData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setsubjectData({
      ...subjectData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateSubject(
      subjectData,
      id,
      setsubjectData,
      setLoading
    );
    if (success) {
      navigate("/data-mapel");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Edit Mata Pelajaran" }));
  }, []);
  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-5 px-10 font-poppins">
        <form onSubmit={handleSubmit}>
          {/* Nama Subject */}
          <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nama Mata Pelajaran :
              </label>
              <div className="mt-2">
                <TextInput
                  id="name"
                  name="name"
                  category_id="text"
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
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Category Mapel :
              </label>
              <div className="mt-2">
                <select
                  name="category_id"
                  id="category_id"
                  onChange={handleChange}
                  value={subjectData.category_id}
                  className="border p-3 rounded-md w-full"
                  required
                >
                  <option value="1">Wajib</option>
                  <option value="2">Mulok</option>
                </select>
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

export default EditSubject;
