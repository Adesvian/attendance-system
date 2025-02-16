import React, { useEffect, useState } from "react";
import moment from "moment";
import SingleButton from "../../components/button/Button";
import { FaPlus, FaRegTrashCan } from "react-icons/fa6";
import {
  CheckInSubmit,
  DefaultCheckOutSubmit,
  DeleteCheckOut,
  EachClassCheckOutSubmit,
  fetchThresholdData,
} from "../../app/api/v1/admin-services";
import { setPageTitle } from "../../redux/headerSlice";
import { useDispatch } from "react-redux";

function Threshold() {
  const dispatch = useDispatch();
  const [checkInTimeElementary, setCheckInTimeElementary] = useState(
    moment().format("HH:mm")
  );
  const [checkInTimePreschool, setCheckInTimePreschool] = useState(
    moment().format("HH:mm")
  );
  const [checkOutEntries, setCheckOutEntries] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [defaultCheckOutTime, setDefaultCheckOutTime] = useState(
    moment().format("HH:mm")
  );
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  const handleCheckInSubmit = async (event, type) => {
    event.preventDefault();

    const checkInTime =
      type === "elementary" ? checkInTimeElementary : checkInTimePreschool;
    await CheckInSubmit(checkInTime, type);
  };
  const handleDefaultCheckOutSubmit = async (event) => {
    event.preventDefault();
    const res = await DefaultCheckOutSubmit(defaultCheckOutTime);

    if (res.length === 0) {
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }
  };

  const handleEachClassCheckOutSubmit = async (index) => {
    const entry = checkOutEntries[index];
    await EachClassCheckOutSubmit(entry);
  };

  const handleAddCheckOut = () => {
    const classToAdd =
      parseInt(selectedClass) ||
      (availableClasses.length > 0 ? parseInt(availableClasses[0]) : "");
    if (classToAdd) {
      setCheckOutEntries((prevEntries) => [
        ...prevEntries,
        { class: classToAdd, time: defaultCheckOutTime },
      ]);
      setSelectedClass("");
      // Perbarui availableClasses setelah menambah checkOut
      setAvailableClasses((prev) =>
        prev.filter((classItem) => classItem !== classToAdd)
      );
    }
  };

  const handleCheckOutChange = (index, value) => {
    const updatedEntries = [...checkOutEntries];
    updatedEntries[index].time = value;
    setCheckOutEntries(updatedEntries);
  };

  const handleDeleteCheckOut = async (index) => {
    const res = await DeleteCheckOut(
      index,
      checkOutEntries,
      setCheckOutEntries,
      setAvailableClasses
    );

    if (res.length === 1) {
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchThresholdData(
        setCheckInTimeElementary,
        setCheckInTimePreschool,
        setCheckOutEntries,
        setDefaultCheckOutTime,
        setAvailableClasses
      );
    };
    fetchData();
    dispatch(setPageTitle({ title: "Time Threshold" }));
  }, []);

  return (
    <div className="p-2">
      <div role="tablist" className="tabs tabs-bordered lg:tabs-lg">
        {/* Check-In Tab */}
        <input
          type="radio"
          name="time-threshold"
          role="tab"
          className="tab whitespace-nowrap"
          aria-label="Check In"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content my-10">
          <div className="flex gap-2">
            <span className="text-red-500 dark:text-red-300">*</span>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
              Silahkan atur waktu check-in dibawah dengan memilih jam dan menit
              kemudian klik{" "}
              <span className="text-green-700 dark:text-green-500 font-bold">
                "Set Time"
              </span>
              . Waktu check-in ini berlaku untuk seluruh{" "}
              <span className="font-bold">"Kelas"</span> dan seluruh{" "}
              <span className="font-bold">"Jenjang"</span>
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-red-500 dark:text-red-300">*</span>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
              Jika siswa melakukan check-in diatas waktu yang ditetapkan, maka
              kehadiran tersebut di catat sebagai{" "}
              <span className="text-red-700 dark:text-red-500 font-bold">
                "Keterlamabatan"
              </span>
              .
            </p>
          </div>
          <div className="grid grid-cols-8 gap-x-6 mb-6 mt-5">
            <div className="lg:col-span-7 col-span-8">
              <label className="block mb-1 text-green-500 dark:text-green-300 font-medium">
                Check-In Time SD
              </label>
              <input
                name="checkInTimeElementary"
                type="time"
                value={checkInTimeElementary}
                onChange={(e) => setCheckInTimeElementary(e.target.value)}
                className="border p-2 rounded-md w-full h-12 dark:bg-base-100"
              />
            </div>

            <div className="col-span-8 lg:col-span-1 flex items-end mt-2 lg:mt-0">
              <SingleButton
                onClick={(e) => handleCheckInSubmit(e, "elementary")}
                className="btn btn-success text-white w-full h-12"
              >
                Set Time
              </SingleButton>
            </div>
          </div>
          <div className="grid grid-cols-8 gap-x-6 mb-6 mt-5">
            <div className="lg:col-span-7 col-span-8">
              <label className="block mb-1 text-green-500 dark:text-green-300 font-medium">
                Check-In Time TK / PAUD
              </label>
              <input
                name="checkInTimePreschool"
                type="time"
                value={checkInTimePreschool}
                onChange={(e) => setCheckInTimePreschool(e.target.value)}
                className="border p-2 rounded-md w-full h-12 dark:bg-base-100"
              />
            </div>

            <div className="col-span-8 lg:col-span-1 flex items-end mt-2 lg:mt-0">
              <SingleButton
                onClick={(e) => handleCheckInSubmit(e, "preschool")}
                className="btn btn-success text-white w-full h-12"
              >
                Set Time
              </SingleButton>
            </div>
          </div>
        </div>

        {/* Check-Out Tab */}
        <input
          type="radio"
          name="time-threshold"
          role="tab"
          className="tab whitespace-nowrap"
          aria-label="Check Out"
        />
        <div role="tabpanel" className="tab-content my-10">
          <div className="flex gap-2">
            <span className="text-red-500 dark:text-red-300">*</span>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
              Waktu dibawah ini digunakan untuk menetapkan waktu check-out
              secara default. Waktu check-out ini berlaku untuk seluruh kelas
              yang tidak di set custom waktu check-outnya.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-red-500 dark:text-red-300">*</span>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
              Default jam check-out <span className="font-bold">13:00:00</span>{" "}
              untuk jenjang <span className="font-bold">"SD"</span>. Selain itu{" "}
              <span className="font-bold">11:15:00</span>
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-red-500 dark:text-red-300">*</span>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
              Jika siswa melakukan check-out sebelum waktu yang ditetapkan, maka
              tidak akan tercatat dalam sistem.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-red-500 dark:text-red-300">*</span>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
              Khusus <span className="font-bold">Jumat</span> waktu check-out
              seluruh jenjang di jam <span className="font-bold">11:15:00</span>
            </p>
          </div>
          <div className="grid grid-cols-8 gap-x-6 mb-6 mt-5">
            <div className="lg:col-span-7 col-span-8">
              <label className="block mb-1 text-red-500 dark:text-red-300 font-medium">
                Check-Out Time (Unset Class)
              </label>
              <input
                type="time"
                value={defaultCheckOutTime}
                onChange={(e) => setDefaultCheckOutTime(e.target.value)}
                className="border p-2 rounded-md w-full h-12 dark:bg-base-100"
              />
            </div>
            <div className="col-span-8 lg:col-span-1 flex items-end mt-2 lg:mt-0">
              <SingleButton
                onClick={handleDefaultCheckOutSubmit}
                className="btn btn-success text-white w-full h-12"
                disabled={availableClasses.length === 0}
              >
                Set Time
              </SingleButton>
            </div>
          </div>
          <div className="divider my-16">Atur Waktu Untuk Setiap Kelas</div>
          {/* Class Selection Dropdown */}
          <div className="flex gap-2 ">
            <span className="text-red-500 dark:text-red-300">*</span>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
              Waktu di bawah ini digunakan untuk mengatur waktu check-out sesuai
              dengan kelas yang dipilih.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-red-500 dark:text-red-300">*</span>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
              Jika kelas yang diatur tidak ada dalam list, maka waktu check-out
              kelas tersebut mengikuti waktu check-out default.
            </p>
          </div>
          <div className="flex gap-x-2 mb-6 mt-5">
            <div className="w-full">
              <label className="block mb-1 text-green-500 dark:text-green-300 font-medium">
                Pilih Kelas{" "}
                <span className="text-red-500 dark:text-red-300">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border p-2 rounded-md w-full h-12 dark:bg-base-100"
              >
                {availableClasses.map((classOption, index) => (
                  <option key={`${classOption}-${index}`} value={classOption}>
                    {classOption === 7
                      ? "TK A"
                      : classOption === 8
                      ? "TK B"
                      : classOption === 9
                      ? "Play Group"
                      : `Kelas ${classOption}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <SingleButton
                onClick={handleAddCheckOut}
                className="btn btn-primary text-white lg:w-44 w-12 h-12 whitespace-nowrap"
                disabled={availableClasses.length === 0}
              >
                <FaPlus />{" "}
                <span className="hidden lg:block">Tambah Threshold</span>
              </SingleButton>
            </div>
          </div>

          {/* Check-Out Entries */}
          {checkOutEntries.map((entry, index) => (
            <div
              key={`${entry.class}-${entry.time}-${index}`}
              className="mb-4 flex gap-x-6 items-end"
            >
              <div className="w-full">
                <label className="block mb-1 text-red-500 dark:text-red-300 font-medium">
                  Check-Out Time:{" "}
                  <span className="text-black dark:text-dark-text">
                    {entry.class === 7
                      ? "TK A"
                      : entry.class === 8
                      ? "TK B"
                      : entry.class === 9
                      ? "Play Group"
                      : `Kelas ${entry.class}`}
                  </span>
                </label>
                <input
                  type="time"
                  value={entry.time}
                  onChange={(e) => handleCheckOutChange(index, e.target.value)}
                  className="border p-2 rounded-md w-full dark:bg-base-100"
                />
              </div>
              <div className="flex items-end">
                <SingleButton
                  onClick={() => handleDeleteCheckOut(index)}
                  className="btn btn-error text-white"
                >
                  <FaRegTrashCan />
                </SingleButton>
              </div>
            </div>
          ))}

          {checkOutEntries.length > 0 && (
            <div className="mt-4">
              <SingleButton
                onClick={() =>
                  checkOutEntries.forEach((_, index) =>
                    handleEachClassCheckOutSubmit(index)
                  )
                }
                className="btn btn-success text-white w-full"
              >
                Set Time
              </SingleButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Threshold;
