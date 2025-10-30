import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../../services/admin.service";

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await adminService.login(adminData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Admin login failed");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const adminAuthSlice = createSlice({
  name: "admin",
  initialState: {
    adminUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    adminLogout: (state) => {
      state.adminUser = null;
      adminService.logout();
    },
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUser = action.payload.user;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout, clearAdminError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
