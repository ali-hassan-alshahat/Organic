import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Helper function to save guest cart to localStorage
const saveGuestCartToLocalStorage = (items) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

// Helper function to load guest cart from localStorage
const loadGuestCartFromLocalStorage = () => {
  try {
    const guestCart = localStorage.getItem("guestCart");
    return guestCart ? JSON.parse(guestCart) : [];
  } catch (error) {
    console.error("Error loading guest cart from localStorage:", error);
    return [];
  }
};

const transformBackendCart = (backendCart) => {
  if (!backendCart || !Array.isArray(backendCart)) return [];

  return backendCart.map((item) => ({
    ...item.productId,
    quantity: item.quantity,
    cartItemId: item._id,
  }));
};

const validateQuantityAgainstStock = (product, quantity) => {
  return Math.min(quantity, product.countInStock);
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      const productResponse = await fetch(
        `http://localhost:8000/api/products/${productId}`,
      );
      if (!productResponse.ok) {
        throw new Error("Failed to fetch product details");
      }
      const productData = await productResponse.json();
      const product = productData.data?.product;
      if (!product) {
        throw new Error("Product not found");
      }
      const validQuantity = validateQuantityAgainstStock(product, quantity);
      if (validQuantity === 0) {
        throw new Error("Product is out of stock");
      }
      if (!token) {
        // If user is not logged in, save to guest cart
        return {
          product: { ...product, quantity: validQuantity },
          local: true,
          guest: true,
        };
      }
      const response = await fetch("http://localhost:8000/api/users/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: validQuantity }),
      });
      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      return { ...data, product: { ...product, quantity: validQuantity } };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) {
        // If user is not logged in, get cart from guest localStorage
        const guestCart = loadGuestCartFromLocalStorage();
        return {
          items: guestCart,
          fromLocalStorage: true,
          guest: true,
        };
      }
      const response = await fetch("http://localhost:8000/api/users/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      const transformedItems = transformBackendCart(data.data?.cart);
      return {
        items: transformedItems,
        fromServer: true,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const syncGuestCartToServer = createAsyncThunk(
  "cart/syncGuestCartToServer",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      const guestCart = loadGuestCartFromLocalStorage();
      if (!token || guestCart.length === 0) {
        return { success: true, message: "No guest cart to sync", items: [] };
      }
      // Sync each item from guest cart to server
      for (const item of guestCart) {
        // Validate quantity against current stock before syncing
        const productResponse = await fetch(
          `http://localhost:8000/api/products/${item._id}`,
        );
        if (productResponse.ok) {
          const productData = await productResponse.json();
          const currentProduct = productData.data?.product;
          if (currentProduct) {
            const validQuantity = validateQuantityAgainstStock(
              currentProduct,
              item.quantity,
            );

            await fetch("http://localhost:8000/api/users/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                productId: item._id,
                quantity: validQuantity,
              }),
            });
          }
        }
        // Small delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // Clear guest cart after successful sync
      localStorage.removeItem("guestCart");

      console.log("Guest cart synced successfully");
      return {
        success: true,
        message: "Guest cart synced successfully",
        items: guestCart,
      };
    } catch (error) {
      console.error("Sync guest cart error:", error);
      return rejectWithValue(error.message);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    loading: false,
    error: null,
    isGuest: true,
  },
  reducers: {
    addItemToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        // Check if we can add more without exceeding stock
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity <= existingItem.countInStock) {
          existingItem.quantity = newQuantity;
        }
        // If it would exceed stock, don't change the quantity
      } else {
        // Adding new item - start with quantity 1 (or whatever is passed)
        const initialQuantity = product.quantity || 1;
        const validQuantity = validateQuantityAgainstStock(
          product,
          initialQuantity,
        );

        if (validQuantity > 0) {
          state.items.push({
            ...product,
            quantity: validQuantity,
          });
        }
      }
      updateCartTotals(state);
      // Save to localStorage if guest user
      if (state.isGuest) {
        saveGuestCartToLocalStorage(state.items);
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item._id !== productId);
      updateCartTotals(state);
      if (state.isGuest) {
        saveGuestCartToLocalStorage(state.items);
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item._id === productId);
      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item._id !== productId);
        } else {
          // Validate against stock
          const validQuantity = validateQuantityAgainstStock(
            existingItem,
            quantity,
          );
          existingItem.quantity = validQuantity;
        }
      }
      updateCartTotals(state);
      if (state.isGuest) {
        saveGuestCartToLocalStorage(state.items);
      }
    },
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item._id === productId);
      if (existingItem && existingItem.quantity < existingItem.countInStock) {
        existingItem.quantity += 1;
        updateCartTotals(state);
        if (state.isGuest) {
          saveGuestCartToLocalStorage(state.items);
        }
      }
    },
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item._id === productId);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item._id !== productId);
        }
        updateCartTotals(state);
        if (state.isGuest) {
          saveGuestCartToLocalStorage(state.items);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      if (state.isGuest) {
        localStorage.removeItem("guestCart");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Set cart items directly (used after login/logout)
    setCartItems: (state, action) => {
      state.items = action.payload;
      updateCartTotals(state);
    },
    // Switch to guest mode
    switchToGuestCart: (state) => {
      const guestCart = loadGuestCartFromLocalStorage();
      state.items = guestCart;
      state.isGuest = true;
      updateCartTotals(state);
    },
    switchToServerCart: (state, action) => {
      state.items = action.payload;
      state.isGuest = false;
      updateCartTotals(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.guest) {
          // For guest users, add to local cart
          const { product } = action.payload;
          const existingItem = state.items.find(
            (item) => item._id === product._id,
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + product.quantity;
            existingItem.quantity = validateQuantityAgainstStock(
              existingItem,
              newQuantity,
            );
          } else {
            state.items.push(product);
          }
          state.isGuest = true;
          updateCartTotals(state);
          saveGuestCartToLocalStorage(state.items);
        } else if (action.payload.data?.cart) {
          const transformedItems = transformBackendCart(
            action.payload.data.cart,
          );
          state.items = transformedItems;
          state.isGuest = false;
          updateCartTotals(state);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.guest) {
          // Guest cart from localStorage
          state.items = action.payload.items;
          state.isGuest = true;
        } else if (action.payload.items) {
          state.items = action.payload.items;
          state.isGuest = false;
        }
        updateCartTotals(state);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sync Guest Cart to Server
      .addCase(syncGuestCartToServer.fulfilled, (state, action) => {
        state.isGuest = false;
        // Don't set items from payload as they might be outdated
        // Instead, refetch the cart from server
      });
  },
});

// Helper function to update cart totals
const updateCartTotals = (state) => {
  state.totalQuantity = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  state.totalAmount = state.items.reduce((total, item) => {
    const price = item.salePrice || item.price;
    return total + price * item.quantity;
  }, 0);
};

export const {
  addItemToCart,
  removeItem,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  clearError,
  setCartItems,
  switchToGuestCart,
  switchToServerCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
export const selectTotalAmount = (state) => state.cart.totalAmount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectIsGuestCart = (state) => state.cart.isGuest;
export const selectCanAddToCart =
  (productId, quantity = 1) =>
  (state) => {
    const product = state.cart.items.find((item) => item._id === productId);
    if (!product) return true;
    return product.quantity + quantity <= product.countInStock;
  };
