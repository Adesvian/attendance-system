import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "./headerSlice";
import authSlice from "./authSlice";

export default configureStore({
  reducer: {
    header: headerSlice,
    auth: authSlice,
  },
});
