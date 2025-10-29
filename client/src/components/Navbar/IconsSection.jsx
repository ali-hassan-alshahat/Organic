import React from "react";
import { Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectTotalQuantity,
  selectTotalAmount,
} from "../../rtk/slices/cartSlice";
import { selectWishlistCount } from "../../rtk/slices/wishlistSlice";

const IconsSection = ({ isMobile, onMenuToggle, isMenuOpen }) => {
  const totalQuantity = useSelector(selectTotalQuantity);
  const totalAmount = useSelector(selectTotalAmount);
  const wishlistCount = useSelector(selectWishlistCount);

  return (
    <div className={`flex items-center ${isMobile ? "gap-3" : "gap-6"}`}>
      <Link to="/wishlist" className="relative cursor-pointer">
        <div
          className={`text-gray-600 hover:text-green-600 transition-colors ${
            isMobile ? "p-2" : "p-2"
          }`}
        >
          <Heart size={isMobile ? 20 : 24} className="text-gray-600" />
          {wishlistCount > 0 && (
            <span
              className={`absolute bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold ${
                isMobile
                  ? "-top-1 -right-1 w-4 h-4 text-[10px]"
                  : "-top-1 -right-1 w-5 h-5"
              }`}
            >
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </span>
          )}
        </div>
      </Link>
      <Link to="/cart" className="relative cursor-pointer">
        <div
          className={`flex items-center text-gray-600 hover:text-green-600 transition-colors ${
            isMobile ? "gap-1 p-2" : "gap-2 p-2"
          }`}
        >
          <ShoppingBag size={isMobile ? 20 : 24} />
          {totalQuantity > 0 && (
            <span
              className={`absolute bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold ${
                isMobile
                  ? "-top-1 -right-1 w-4 h-4 text-[10px]"
                  : "-top-1 -right-1 w-5 h-5"
              }`}
            >
              {totalQuantity > 99 ? "99+" : totalQuantity}
            </span>
          )}
          {!isMobile && totalQuantity > 0 && (
            <span className="text-sm font-medium">
              ${totalAmount.toFixed(2)}
            </span>
          )}
        </div>
      </Link>
      {isMobile && (
        <button
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          onClick={onMenuToggle}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
    </div>
  );
};

export default IconsSection;
