import React, { useState } from "react";
import moment from "moment";
import SingleButton from "../../components/button/Button";

function Threshold() {
  const [checkInTime, setCheckInTime] = useState(moment().format("HH:mm"));
  const [checkOutEntries, setCheckOutEntries] = useState([
    { class: "6", time: moment().hour(19).minute(0).second(0).format("HH:mm") },
  ]);
  const [selectedClass, setSelectedClass] = useState("1");

  const handleCheckInSubmit = (event) => {
    event.preventDefault();
    console.log("Check-In Time:", checkInTime);
  };

  const handleCheckOutSubmit = (index) => {
    const entry = checkOutEntries[index];
    console.log("Check-Out Entry:", entry);
  };

  const handleAddCheckOut = () => {
    const allClasses = ["1", "2", "3", "4", "5", "6"];
    const usedClasses = checkOutEntries.map((entry) => entry.class);
    const availableClasses = allClasses.filter(
      (classItem) => !usedClasses.includes(classItem)
    );

    if (availableClasses.length > 0) {
      const nextClass = availableClasses[0];
      const defaultTime = moment().hour(19).minute(0).second(0).format("HH:mm");
      setCheckOutEntries([
        ...checkOutEntries,
        { class: nextClass, time: defaultTime },
      ]);
      setSelectedClass(availableClasses[1] || availableClasses[0]);
    }
  };

  const handleCheckOutChange = (index, value) => {
    const updatedEntries = [...checkOutEntries];
    updatedEntries[index].time = value;
    setCheckOutEntries(updatedEntries);
  };

  const handleDeleteCheckOut = (index) => {
    if (checkOutEntries.length > 1) {
      const updatedEntries = checkOutEntries.filter((_, i) => i !== index);
      setCheckOutEntries(updatedEntries);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <label className="block mb-1 text-green-500 font-medium">
          Check-In Time <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <SingleButton
          onClick={handleCheckInSubmit}
          className="btn btn-success mt-2 text-white"
        >
          Submit Check-In
        </SingleButton>
      </div>

      <div className="mb-4">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-2 rounded-md w-full mb-2"
        >
          {["1", "2", "3", "4", "5", "6"]
            .filter(
              (classItem) =>
                !checkOutEntries.map((entry) => entry.class).includes(classItem)
            )
            .map((classOption) => (
              <option key={classOption} value={classOption}>
                Kelas {classOption}
              </option>
            ))}
        </select>
        <SingleButton
          onClick={handleAddCheckOut}
          className="btn btn-primary text-white"
        >
          Tambah Time Threshold
        </SingleButton>
      </div>

      {checkOutEntries.map((entry, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-1 text-red-500 font-medium">
            Check-Out Time: Kelas {entry.class}
          </label>
          <input
            type="time"
            value={entry.time}
            onChange={(e) => handleCheckOutChange(index, e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <div className="flex justify-between mt-2">
            <SingleButton
              onClick={() => handleCheckOutSubmit(index)}
              className="btn btn-success text-white"
            >
              Submit Check-Out
            </SingleButton>
            {checkOutEntries.length > 1 && (
              <button
                onClick={() => handleDeleteCheckOut(index)}
                className="btn btn-error text-white"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Threshold;
