// DatePickerComponent.jsx
import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ThemeProvider } from "@mui/material/styles";
import getTheme from "./theme/DatePickerMonthTheme";
import { useSelector } from "react-redux";

const DatePickerComponent = ({
  selectedDate,
  handleDateChange,
  setCleared,
  label = "Pilih bulan",
  placeholder = "Pilih bulan",
  views = ["year", "month"],
}) => {
  const theme = useSelector((state) => state.header.theme);
  const muitheme = getTheme(theme);

  return (
    <ThemeProvider theme={muitheme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label={label}
          views={views}
          value={selectedDate}
          onChange={handleDateChange}
          slotProps={{
            field: {
              clearable: true,
              onClear: () => setCleared(true),
              placeholder,
            },
          }}
          textField={(params) => (
            <input {...params.inputProps} placeholder={placeholder} />
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DatePickerComponent;
