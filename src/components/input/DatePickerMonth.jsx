// DatePickerComponent.jsx
import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const DatePickerComponent = ({
  selectedDate,
  handleDateChange,
  setCleared,
  localTheme,
}) => {
  const theme = createTheme({
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            color: "#9ca3af",
            borderRadius: "6px",
            borderWidth: "2px",
            borderColor: "#9ca3af",
            border: "2px solid",
            backgroundColor: "transparent",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: localTheme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: localTheme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: localTheme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: localTheme === "dark" ? "#ffffff" : "#000000",
              },
              "&:hover fieldset": {
                borderColor: localTheme === "dark" ? "#ffffff" : "#000000",
              },
              "&.Mui-focused fieldset": {
                borderColor: localTheme === "dark" ? "#ffffff" : "#000000",
              },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label="Pilih bulan"
          views={["year", "month"]}
          value={selectedDate}
          slotProps={{
            field: { clearable: true, onClear: () => setCleared(true) },
          }}
          onChange={handleDateChange}
          renderInput={(params) => (
            <div>
              <input {...params.inputProps} placeholder="Pilih bulan" />
            </div>
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DatePickerComponent;
