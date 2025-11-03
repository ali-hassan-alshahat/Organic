import React from "react";
import { MapPin, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../rtk/slices/authSlice";
import { clearCart, selectCartItems } from "../../rtk/slices/cartSlice";
import toast from "react-hot-toast";
import {
  clearWishlistData,
  selectWishlistItems,
} from "@/rtk/slices/wishlistSlice";

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // Save current cart AND wishlist to localStorage before logging out
    localStorage.setItem("localCart", JSON.stringify(cartItems));
    localStorage.setItem("guestWishlist", JSON.stringify(wishlistItems));

    // Clear Redux state by dispatching clear actions
    dispatch(clearCart());
    dispatch(clearWishlistData());

    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
  };
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-2 text-white">
      <div className="center !py-2 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-green-400" />
          <span className="text-gray-300 text-xs sm:text-sm">
            Store Location: Lincoln - 344, Illinois, Chicago, USA
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 text-gray-300">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 group">
                <User
                  size={14}
                  className="group-hover:text-green-400 transition-colors"
                />
                <span className="text-xs sm:text-sm hover:text-white transition-colors">
                  Welcome, {user.fullName || user.name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs sm:text-sm hover:text-white transition-colors cursor-pointer"
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer group">
              <User
                size={14}
                className="group-hover:text-green-400 transition-colors"
              />
              <Link
                to={"/login"}
                className="text-xs sm:text-sm hover:text-white transition-colors"
              >
                Login
              </Link>
              <span>/</span>
              <Link
                to={"/register"}
                className="text-xs sm:text-sm hover:text-white transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
