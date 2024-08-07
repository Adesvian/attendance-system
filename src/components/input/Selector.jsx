import React, { useState, useEffect } from "react";

const ClassSelectorComponent = ({
  selectedClass,
  handleClassChange,
  localTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dataClass = [
    "Kelas 1",
    "Kelas 2",
    "Kelas 3",
    "Kelas 4",
    "Kelas 5",
    "Kelas 6",
  ];

  useEffect(() => {
    const selectElement = document.querySelector(".custom-select");
    const handleFocus = () => setIsOpen(true);
    const handleBlur = () => setIsOpen(false);

    selectElement.addEventListener("focus", handleFocus);
    selectElement.addEventListener("blur", handleBlur);

    return () => {
      selectElement.removeEventListener("focus", handleFocus);
      selectElement.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <select
      className={`custom-select select select-bordered w-full h-14 max-w-xs bg-white dark:bg-transparent focus:outline-base-100 dark:outline-dark-text border-base-200 dark:border-dark-text dark:border-2 ${
        localTheme === "dark" ? "dark:bg-gray-800 dark:text-white" : ""
      }`}
      value={selectedClass}
      onChange={handleClassChange}
    >
      <option
        disabled
        value=""
        className={
          isOpen
            ? "bg-gray-100 tex-white dark:text-dark-text dark:bg-gray-700"
            : ""
        }
      >
        Pilih Kelas
      </option>

      {dataClass.map((item) => (
        <option
          key={item}
          value={item}
          className={isOpen ? "bg-gray-100 dark:bg-gray-700" : ""}
        >
          {item}
        </option>
      ))}
    </select>
  );
};

export default ClassSelectorComponent;
