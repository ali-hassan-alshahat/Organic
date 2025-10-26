import React from "react";
import { Heart, ShoppingBag, Menu, X } from "lucide-react";

const IconsSection = ({ isMobile, onMenuToggle, isMenuOpen }) => {
  return (
    <div className={`flex items-center ${isMobile ? "gap-3" : "gap-6"}`}>
      <div className="relative cursor-pointer">
        <div
          className={`text-gray-600 hover:text-green-600 transition-colors ${
            isMobile ? "p-2" : "p-2"
          }`}
        >
          <Heart size={isMobile ? 20 : 24} />
          <span
            className={`absolute bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold ${
              isMobile
                ? "-top-1 -right-1 w-4 h-4 text-[10px]"
                : "-top-1 -right-1 w-5 h-5"
            }`}
          >
            3
          </span>
        </div>
      </div>
      <div className="relative cursor-pointer">
        <div
          className={`flex items-center text-gray-600 hover:text-green-600 transition-colors ${
            isMobile ? "gap-1 p-2" : "gap-2 p-2"
          }`}
        >
          <ShoppingBag size={isMobile ? 20 : 24} />
          <span
            className={`absolute bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold ${
              isMobile
                ? "-top-1 -right-1 w-4 h-4 text-[10px]"
                : "-top-1 -right-1 w-5 h-5"
            }`}
          >
            2
          </span>
          {!isMobile && <span className="text-sm font-medium">$125.00</span>}
        </div>
      </div>
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
