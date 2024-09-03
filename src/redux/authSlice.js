import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { decrypt } from "../app/auth";

// Thunk untuk melakukan fetch cookies
export const fetchCookies = createAsyncThunk(
  "auth/fetchCookies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3001/get-cookies", {
        withCredentials: true, // Kirim cookie dalam permintaan
      });

      const cookies = response.data;
      let decryptedToken = null;

      // Dekripsi token jika cookie yang relevan tersedia
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

      // Kembalikan token yang didekripsi atau null jika tidak ada token
      return decryptedToken;
    } catch (error) {
      console.error("Error fetching cookies:", error);
      return rejectWithValue(error.response?.data || "Error fetching cookies");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: null, // Awal state null
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: () => {
      return null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCookies.fulfilled, (state, action) => {
        return action.payload; // Update state dengan data cookies
      })
      .addCase(fetchCookies.rejected, (state, action) => {
        console.error("Failed to fetch cookies:", action.payload);
        return null; // Tetap null jika fetch gagal
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
