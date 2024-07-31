import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../redux/headerSlice";

function Siswa() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Siswa" }));
  }, []);
  return (
    <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
      <div className="stats shadow">
        <div className="stat">siswa</div>
      </div>
    </div>
  );
}

export default Siswa;
