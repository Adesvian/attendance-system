// theme.js
import { createTheme } from "@mui/material/styles";

const getTheme = (theme) => {
  const isDarkTheme = theme === "dark";

  return createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: isDarkTheme ? "#ffffff" : "#000000",
            fontSize: "0.875rem",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDarkTheme ? "#ffffff" : "#000000",
            fontSize: "0.875rem",
            "&.MuiInputLabel-shrink": {
              color: isDarkTheme ? "#ffffff" : "#000000",
            },
          },
          shrink: {
            fontSize: "0.875rem",
            color: isDarkTheme ? "#ffffff" : "#000000",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDarkTheme ? "#ffffff" : "#000000",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isDarkTheme ? "#ffffff" : "#000000",
                border: isDarkTheme ? "2px solid" : "",
                height: "3.8rem",
              },
              "&:hover fieldset": {
                borderColor: isDarkTheme ? "#ffffff" : "#000000",
              },
              "&.Mui-focused fieldset": {
                borderColor: isDarkTheme ? "#ffffff" : "#000000",
              },
              borderRadius: "0.375rem",
            },
          },
        },
      },
    },
  });
};

export default getTheme;
