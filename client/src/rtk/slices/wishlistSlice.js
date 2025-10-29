import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../services/wishlist.service";
import { fetchCart } from "./cartSlice";

// Async thunks
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistService.addToWishlist(productId);
      if (response.success) {
        return {
          wishlist: response.data.wishlist,
        };
      } else {
        return rejectWithValue(response.message || "Failed to add to wishlist");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.success) {
        return productId;
      } else {
        return rejectWithValue(
          response.message || "Failed to remove from wishlist",
        );
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      if (response.success) {
        return {
          wishlist: response.data.wishlist,
        };
      } else {
        return rejectWithValue(response.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clear",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.clearWishlist();
      if (response.success) {
        return {
          wishlist: [],
        };
      } else {
        return rejectWithValue(response.message || "Failed to clear wishlist");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const moveToCart = createAsyncThunk(
  "wishlist/moveToCart",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const response = await wishlistService.moveToCart(productId);
      if (response.success) {
        // Refresh cart after moving item
        dispatch(fetchCart());
        return {
          wishlist: response.data.wishlist,
          cart: response.data.cart,
        };
      } else {
        return rejectWithValue(response.message || "Failed to move to cart");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
    isInitialized: false,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    initializeWishlist: (state) => {
      // Initialize from localStorage or set default
      const guestWishlist = localStorage.getItem("guestWishlist");
      if (guestWishlist) {
        state.items = JSON.parse(guestWishlist);
      }
      state.isInitialized = true;
    },
    clearWishlistData: (state) => {
      state.items = [];
      state.isInitialized = false;
    },
    // Guest wishlist functionality
    addToGuestWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.productId?._id === product._id || item.productId === product._id,
      );

      if (!existingItem) {
        state.items.push({
          productId: product,
          addedAt: new Date().toISOString(),
        });

        // Save to localStorage for guest
        localStorage.setItem("guestWishlist", JSON.stringify(state.items));
      }
    },
    removeFromGuestWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) =>
          item.productId?._id !== productId && item.productId !== productId,
      );

      // Update localStorage for guest
      localStorage.setItem("guestWishlist", JSON.stringify(state.items));
    },
    syncGuestWishlistToServer: (state, action) => {
      // Replace guest wishlist with server data after login
      state.items = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) =>
            item.productId?._id !== action.payload &&
            item.productId !== action.payload,
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist;
        state.isInitialized = true;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isInitialized = true;
      })
      // Clear wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Move to cart
      .addCase(moveToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearWishlistError,
  initializeWishlist,
  clearWishlistData,
  addToGuestWishlist,
  removeFromGuestWishlist,
  syncGuestWishlistToServer,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectWishlistInitialized = (state) =>
  state.wishlist.isInitialized;
export const selectIsInWishlist = (state, productId) =>
  state.wishlist.items?.some(
    (item) => item.productId?._id === productId || item.productId === productId,
  ) || false;
export const selectWishlistCount = (state) => state.wishlist.items?.length || 0;
