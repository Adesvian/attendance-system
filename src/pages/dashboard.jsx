import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../redux/headerSlice";
import { FaUser } from "react-icons/fa6";
import Card from "../components/card/stats-card";

function Dashboard() {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState("Day");

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }));
  }, []);
  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 my-5">
        <Card />
        <Card />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        <div className="bg-white rounded-md shadow-md text-gray-800 p-4 col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-400">Total Page Views</div>
              <div className="text-3xl font-bold">89,400</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex space-x-2 mb-2">
                <button
                  className={`btn border-0 ${
                    activeButton === "Day"
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setActiveButton("Day")}
                >
                  Day
                </button>
                <button
                  className={`btn border-0 ${
                    activeButton === "Month"
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setActiveButton("Month")}
                >
                  Month
                </button>
                <button
                  className={`btn border-0 ${
                    activeButton === "Year"
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setActiveButton("Year")}
                >
                  Year
                </button>
              </div>
              <div className="flex justify-center">
                <FaUser className="w-10 h-10 text-gray-800" />
              </div>
            </div>
          </div>

          <canvas className="mt-4">Ini berisi chart</canvas>
        </div>
        <div className="bg-white rounded-md shadow-md text-gray-800 p-2">
          <div className="stat flex items-center justify-between">
            <div>
              <div className="text-gray-400">Total Page Views</div>
              <div className="stat-value text-3xl font-bold">89,400</div>
            </div>
            <div className="stat-figure flex-shrink-0">
              <FaUser className="w-10 h-10 text-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
