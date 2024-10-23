import React from "react";
import SingleButton from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";

const EnrollModal = ({
  searchTerm,
  setSearchTerm,
  selectedClassId,
  setSelectedClassId,
  uniqueClasses,
  filteredStudents,
  selectedStudents,
  handleSelectAllChange,
  handleCheckboxChange,
  handleCloseModal,
  handleEnrollStudents,
}) => {
  const isSelectAllChecked =
    selectedStudents.length === filteredStudents.length &&
    filteredStudents.length > 0;

  return (
    <dialog id="enroll" className="modal">
      <div className="modal-box bg-white dark:bg-base-200 h-[43rem] flex flex-col">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleCloseModal}
          >
            ✕
          </button>
        </form>

        <div className="mt-2 flex-grow flex flex-col h-[28rem]">
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              type="text"
              label="Cari Siswa..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              name="class"
              id="class"
              onChange={(e) => setSelectedClassId(e.target.value)}
              value={selectedClassId}
              className="border dark:border-none text-gray-600 p-3 rounded-md w-full dark:bg-base-300 h-max"
              required
            >
              {uniqueClasses.map((classId) => (
                <option key={classId} value={classId}>
                  Kelas {classId}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={isSelectAllChecked}
              onChange={handleSelectAllChange}
            />
            <span>Select All</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[28rem] overflow-auto">
            {filteredStudents.map((student) => (
              <label
                key={student.rfid}
                className="flex items-center p-2 border rounded shadow h-fit"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedStudents.includes(student.rfid)}
                  onChange={() => handleCheckboxChange(student.rfid)}
                />
                <span className="line-clamp-1">{student.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="lg:modal-action mt-auto flex justify-end">
          <SingleButton
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto"
            onClick={handleEnrollStudents}
          >
            Save
          </SingleButton>
        </div>
      </div>
    </dialog>
  );
};

export default EnrollModal;
