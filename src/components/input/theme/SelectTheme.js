// theme.js
import { createTheme } from "@mui/material/styles";

const getTheme = (theme) => {
  const isDarkTheme = theme === "dark";

  return createTheme({
    components: {
      MuiSelect: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDarkTheme ? "#ffffff" : "#000000",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDarkTheme ? "#ffffff" : "#000000",
            },
            "& .MuiSelect-icon": {
              color: isDarkTheme ? "#ffffff" : "#000000",
            },
            "& .MuiSelect-select": {
              color: isDarkTheme ? "#ffffff" : "#000000",
              fontSize: "14px",
            },
          },
        },
      },
    },
  });
};

export default getTheme;
