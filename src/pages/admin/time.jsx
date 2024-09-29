import React, { useState } from "react";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TextField } from "@mui/material";
import moment from "moment";
import SingleButton from "../../components/button/Button";

function Threshold() {
  const [checkInTime, setCheckInTime] = useState(moment());
  const [checkOutEntries, setCheckOutEntries] = useState([
    { class: "6", time: moment().hour(19).minute(0).second(0) }, // Default ke kelas 6, waktu 7 PM
  ]);
  const [selectedClass, setSelectedClass] = useState("1");

  const handleCheckInSubmit = (event) => {
    event.preventDefault();
    console.log("Check-In Time:", checkInTime.format("HH:mm"));
  };

  const handleCheckOutSubmit = (index) => {
    const entry = checkOutEntries[index];
    console.log("Check-Out Entry:", {
      ...entry,
      time: entry.time.format("HH:mm"), // Format waktu 24 jam
    });
  };

  const handleAddCheckOut = () => {
    const allClasses = ["1", "2", "3", "4", "5", "6"];
    const usedClasses = checkOutEntries.map((entry) => entry.class);
    const availableClasses = allClasses.filter(
      (classItem) => !usedClasses.includes(classItem)
    );

    if (availableClasses.length > 0) {
      const nextClass = availableClasses[0];
      const defaultTime = moment().hour(19).minute(0).second(0); // Set default time to 7 PM
      setCheckOutEntries([
        ...checkOutEntries,
        { class: nextClass, time: defaultTime },
      ]);
      setSelectedClass(
        availableClasses.length > 1 ? availableClasses[1] : availableClasses[0]
      );
    }
  };

  const handleCheckOutChange = (index, field, value) => {
    const updatedEntries = [...checkOutEntries];
    updatedEntries[index][field] = value;
    setCheckOutEntries(updatedEntries);
  };

  const handleDeleteCheckOut = (index) => {
    if (checkOutEntries.length > 1) {
      const updatedEntries = checkOutEntries.filter((_, i) => i !== index);
      setCheckOutEntries(updatedEntries);
    }
  };

  const allClasses = ["1", "2", "3", "4", "5", "6"];
  const usedClasses = checkOutEntries.map((entry) => entry.class);
  const availableClasses = allClasses.filter(
    (classItem) => !usedClasses.includes(classItem)
  );
  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-4">
        <div className="form-control mb-6">
          <label className="label">
            <span className="">
              <span className="text-green-500 font-medium">Check-In Time</span>{" "}
              : waktu ini berlaku untuk seluruh kelas
              <span className="text-red-500">*</span>
            </span>
          </label>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticTimePicker
              displayStaticWrapperAs="desktop"
              value={checkInTime}
              onChange={(newValue) => setCheckInTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <button
            onClick={handleCheckInSubmit}
            className="btn btn-success mt-2 text-white"
          >
            Submit Check-In
          </button>
        </div>

        <div className="form-control mb-4">
          <div className="grid grid-cols-3 gap-x-5">
            <div className="col-span-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border p-3 rounded-md w-full"
              >
                {availableClasses.map((classOption) => (
                  <option key={classOption} value={classOption}>
                    Kelas {classOption}
                  </option>
                ))}
              </select>
            </div>
            <SingleButton
              onClick={handleAddCheckOut}
              className="btn btn-primary text-white"
            >
              Tambah Time Threshold
            </SingleButton>
          </div>
        </div>

        {checkOutEntries.map((entry, index) => (
          <div key={index} className="mb-4">
            <div className="form-control">
              <label className="label mt-4">
                <span className="">
                  <span className="text-red-500 font-medium">
                    Check-Out Time
                  </span>{" "}
                  : Untuk Kelas {entry.class}
                </span>
              </label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <StaticTimePicker
                  displayStaticWrapperAs="desktop"
                  value={entry.time}
                  onChange={(newValue) =>
                    handleCheckOutChange(index, "time", newValue)
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <button
                onClick={() => handleCheckOutSubmit(index)}
                className="btn btn-success mt-2 text-white"
              >
                Submit Check-Out
              </button>
              {checkOutEntries.length > 1 && (
                <button
                  onClick={() => handleDeleteCheckOut(index)}
                  className="btn btn-error text-white mt-2"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Threshold;
