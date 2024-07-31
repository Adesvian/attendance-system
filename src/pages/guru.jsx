import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../redux/headerSlice";

function Guru() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Guru" }));
  }, []);
  return (
    <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
      <div className="stats shadow">
        <div className="stat">Guru</div>
      </div>
    </div>
  );
}

export default Guru;
