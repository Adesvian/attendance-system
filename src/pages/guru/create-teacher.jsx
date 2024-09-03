import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";

function CreateTeacher() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tambah Guru" }));
  }, []);
  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Form Guru</h2>
        {/* Tambahkan ulir di sini */}
      </div>
    </>
  );
}

export default CreateTeacher;
