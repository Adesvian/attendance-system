import { createTheme } from "@mui/material/styles";

const getTheme = (theme) => {
  const isDarkTheme = theme === "dark";

  return createTheme({
    palette: {
      mode: theme,
      background: {
        default: isDarkTheme ? "#121212" : "#ffffff",
        paper: isDarkTheme ? "#1e1e1e" : "#f5f5f5",
      },
      text: {
        primary: isDarkTheme ? "#ffffff" : "#000000",
        secondary: isDarkTheme ? "#b0bec5" : "#555555",
      },
    },
    components: {
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            color: isDarkTheme ? "white" : "inherit",
            "&.Mui-active": {
              color: isDarkTheme ? "white" : "inherit",
              "& .MuiTableSortLabel-icon": {
                color: isDarkTheme ? "white" : "inherit",
              },
            },
            "&:hover": {
              color: isDarkTheme ? "white" : "inherit",
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkTheme ? "#1e1e1e" : "#f5f5f5",
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            "& .MuiPaginationItem-root": {
              color: isDarkTheme ? "white" : "inherit",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: isDarkTheme ? "white" : "#00000014",
              color: isDarkTheme ? "black" : "inherit",
            },
            "& .MuiPaginationItem-page": {
              borderColor: isDarkTheme ? "white" : "inherit",
              color: isDarkTheme ? "white" : "inherit",
            },
            "& .MuiPaginationItem-root.MuiButtonBase-root": {
              borderColor: isDarkTheme ? "white" : "inherit",
            },
          },
        },
      },
    },
  });
};

export default getTheme;
