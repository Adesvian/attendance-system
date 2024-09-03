// CustomSelect.js
import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";
import getTheme from "../input/theme/SelectTheme"; // Pastikan path ini sesuai dengan lokasi file tema Anda
import { ThemeProvider } from "@mui/material/styles";

const CustomSelect = ({ value, onChange, options, size = "small" }) => {
  const theme = useSelector((state) => state.header.theme);
  const muiTheme = getTheme(theme); // Dapatkan tema berdasarkan tema lokal

  return (
    <ThemeProvider theme={muiTheme}>
      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        size={size}
        inputProps={{ "aria-label": "Filter by Status" }}
        className="ml-2 text-xs"
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
