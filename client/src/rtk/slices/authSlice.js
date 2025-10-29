import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service";
import { fetchCart } from "./cartSlice";
import { fetchWishlist } from "./wishlistSlice";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.login(userData);
      if (response.success) {
        // After successful login, fetch user's cart and wishlist
        dispatch(fetchCart());
        dispatch(fetchWishlist());
        return {
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.message || "Login failed");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        dispatch(fetchCart());
        dispatch(fetchWishlist());
        return {
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.message || "Registration failed");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isInitialized: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state, action) => {
      if (action.payload?.saveCart) {
        const currentCart = action.payload.cartItems;
        localStorage.setItem("guestCart", JSON.stringify(currentCart));
      }

      state.user = null;
      state.token = null;
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const user = authService.getCurrentUser();
      const token = authService.getToken();
      state.user = user;
      state.token = token;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout, clearError, initializeAuth } =
  authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectAuthInitialized = (state) => state.auth.isInitialized;
