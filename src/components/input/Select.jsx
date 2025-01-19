// CustomSelect.js
import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";
import getTheme from "../input/theme/SelectTheme"; // Pastikan path ini sesuai dengan lokasi file tema Anda
import { ThemeProvider } from "@mui/material/styles";

const CustomSelect = ({ value, onChange, options, name, size = "small" }) => {
  const theme = useSelector((state) => state.header.theme);
  const muiTheme = getTheme(theme);
  const handleChange = (event) => {
    onChange({
      target: {
        name: name,
        value: event.target.value,
      },
    });
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        size={size}
        inputProps={{ "aria-label": "Filter by Status" }}
        className={`text-xs `}
        style={{
          display: `${name === undefined || name === true ? "block" : "none"}`,
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </ThemeProvider>
  );
};

export default CustomSelect;
