import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service";
import { fetchCart } from "./cartSlice";
import { fetchWishlist } from "./wishlistSlice";

// Helper functions for guest data
const loadGuestCartFromLocalStorage = () => {
  try {
    const guestCart = localStorage.getItem("guestCart");
    return guestCart ? JSON.parse(guestCart) : [];
  } catch (error) {
    return [];
  }
};

const loadGuestWishlistFromLocalStorage = () => {
  try {
    const guestWishlist = localStorage.getItem("guestWishlist");
    return guestWishlist ? JSON.parse(guestWishlist) : [];
  } catch (error) {
    return [];
  }
};

const syncGuestCartWithToken = async (token, guestCart) => {
  if (!token || guestCart.length === 0) return;
  for (const item of guestCart) {
    try {
      await fetch("/api/users/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item._id,
          quantity: item.quantity,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  localStorage.removeItem("guestCart");
};

const syncGuestWishlistWithToken = async (token, guestWishlist) => {
  if (!token || guestWishlist.length === 0) return;
  for (const item of guestWishlist) {
    try {
      const productId = item.productId?._id || item.productId;
      await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  localStorage.removeItem("guestWishlist");
};

// Updated thunks with proper sync
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.login(userData);

      if (response.success) {
        const token = response.data.token;
        // Get guest data before sync
        const guestCart = loadGuestCartFromLocalStorage();
        const guestWishlist = loadGuestWishlistFromLocalStorage();
        // Sync guest data using token from response
        if (token && guestCart.length > 0) {
          await syncGuestCartWithToken(token, guestCart);
        }

        if (token && guestWishlist.length > 0) {
          await syncGuestWishlistWithToken(token, guestWishlist);
        }

        // Fetch updated data from server
        await dispatch(fetchCart()).unwrap();
        await dispatch(fetchWishlist()).unwrap();
        return {
          user: response.data.user,
          token: token,
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
        const token = response.data.token;
        // Get guest data before sync
        const guestCart = loadGuestCartFromLocalStorage();
        const guestWishlist = loadGuestWishlistFromLocalStorage();
        // Sync guest data using token from response
        if (token && guestCart.length > 0) {
          await syncGuestCartWithToken(token, guestCart);
        }
        if (token && guestWishlist.length > 0) {
          await syncGuestWishlistWithToken(token, guestWishlist);
        }
        // Fetch updated data from server
        await dispatch(fetchCart()).unwrap();
        await dispatch(fetchWishlist()).unwrap();
        return {
          user: response.data.user,
          token: token,
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
      // Save current data to guest storage if requested
      if (action.payload?.saveCart) {
        const currentCart = action.payload.cartItems;
        const currentWishlist = action.payload.wishlistItems;

        localStorage.setItem("guestCart", JSON.stringify(currentCart));
        localStorage.setItem("guestWishlist", JSON.stringify(currentWishlist));
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
