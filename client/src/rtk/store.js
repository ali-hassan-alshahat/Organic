import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import authSlice from "./slices/authSlice";
import wishlistSlice from "./slices/wishlistSlice";
import adminSlice from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authSlice,
    wishlist: wishlistSlice,
    admin: adminSlice,
  },
});
