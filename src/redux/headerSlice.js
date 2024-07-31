import { createSlice } from "@reduxjs/toolkit";

export const headerSlice = createSlice({
  name: "header",
  initialState: {
    pageTitle: "Home",
    sideBar: true,
    theme: "light",
  },
  reducers: {
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload.title;
    },
    setSidebar: (state, action) => {
      state.sideBar = action.payload.sidebar;
    },
    setTheme: (state, action) => {
      state.theme = action.payload.theme;
    },
  },
});

export const { setPageTitle, setSidebar, setTheme } = headerSlice.actions;

export default headerSlice.reducer;
