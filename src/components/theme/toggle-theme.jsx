// components/ToggleTheme.js
import React, { useState, useEffect } from "react";
import { AiOutlineSun, AiOutlineMoon } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../redux/headerSlice";

const ToggleTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.header.theme);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : theme === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    dispatch(setTheme({ theme: isDarkMode ? "dark" : "light" }));
  }, [isDarkMode, dispatch]);

  const handleToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const themeConfig = `${
    isDarkMode ? "text-gray-500" : "text-yellow-500"
  } transition-opacity ease-in w-5 h-5`;

  return (
    <label className="flex items-center cursor-pointer relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={isDarkMode}
        onChange={handleToggle}
      />
      <div className="relative flex items-center">
        <div
          className={`w-14 h-5 rounded-full flex items-center border-[1px] border-gray-400/60
          ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}
          transition-colors duration-300 ease-in-out`}
        >
          <div
            className={`w-8 h-8 bg-white border-[1px] border-gray-400/60 rounded-full transform
            ${isDarkMode ? "translate-x-6" : "-translate-x-[3px]"}
            transition-transform duration-300 ease-in-out`}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <AiOutlineSun
            className={`${themeConfig} ${
              isDarkMode ? "opacity-0" : "opacity-100"
            } `}
          />
          <AiOutlineMoon
            className={`${themeConfig} ${
              isDarkMode ? "opacity-100" : "opacity-0"
            } `}
          />
        </div>
      </div>
    </label>
  );
};

export default ToggleTheme;
