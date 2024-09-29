import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { decrypt } from "../app/api/v1/auth";

// Thunk untuk fetch data guru
export const fetchTeacherData = createAsyncThunk(
  "auth/fetchTeacherData",
  async (nid) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/teachers/${nid}`
    );
    return response.data.data;
  }
);

// Thunk untuk fetch data orang tua
export const fetchParentData = createAsyncThunk(
  "auth/fetchParentData",
  async (nid) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_BACKEND}/parents/${nid}`
    );
    return response.data.data;
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
    parent: null,
    token: null,
  },
  reducers: {
    resetAuth: (state) => {
      state.teacher = null;
      state.parent = null;
      state.token = null;
    },
  },
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

    // Handle fetchParentData
    builder
      .addCase(fetchParentData.fulfilled, (state, action) => {
        state.parent = action.payload;
      })
      .addCase(fetchParentData.rejected, (state, action) => {
        console.error("Failed to fetch parent data:", action.error.message);
        state.parent = null;
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

export const { resetAuth } = authSlice.actions;

export default authSlice.reducer;
