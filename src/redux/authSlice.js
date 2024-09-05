import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { decrypt } from "../app/auth";

// Thunk untuk fetch data guru
export const fetchTeacherData = createAsyncThunk(
  "auth/fetchTeacherData",
  async (name) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_BACKEND
      }/teachers?nama=${encodeURIComponent(name)}`
    );
    return response.data[0];
  }
);

// Thunk untuk fetch cookies
export const fetchCookies = createAsyncThunk(
  "auth/fetchCookies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/get-cookies`,
        {
          withCredentials: true,
        }
      );

      const cookies = response.data;
      let decryptedToken = null;

      if (cookies._USER_AUTH_RAMADHAN) {
        try {
          decryptedToken = decrypt(
            import.meta.env.VITE_JWT_SECRET,
            cookies._USER_AUTH_RAMADHAN
          );
        } catch (error) {
          console.error("Invalid token decryption:", error);
          return rejectWithValue("Invalid token decryption");
        }
      }

      return decryptedToken;
    } catch (error) {
      console.error("Error fetching cookies:", error);
      return rejectWithValue(error.response?.data || "Error fetching cookies");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    teacher: null,
    token: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchTeacherData
    builder
      .addCase(fetchTeacherData.fulfilled, (state, action) => {
        state.teacher = action.payload;
      })
      .addCase(fetchTeacherData.rejected, (state, action) => {
        console.error("Failed to fetch teacher data:", action.error.message);
        state.teacher = null;
      });

    // Handle fetchCookies
    builder
      .addCase(fetchCookies.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(fetchCookies.rejected, (state, action) => {
        console.error("Failed to fetch cookies:", action.payload);
        state.token = null;
      });
  },
});

export default authSlice.reducer;
