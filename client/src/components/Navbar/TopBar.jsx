import React from "react";
import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-2 text-white">
      <div className="center flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-green-400" />
          <span className="text-gray-300 text-xs sm:text-sm">
            Store Location: Lincoln - 344, Illinois, Chicago, USA
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 text-gray-300">
          <div className="flex items-center gap-2 cursor-pointer group">
            <User
              size={14}
              className="group-hover:text-green-400 transition-colors"
            />
            <Link
              to={"/signin"}
              className="text-xs sm:text-sm hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <span>/</span>
            <Link
              to={"/register"}
              className="text-xs sm:text-sm hover:text-white transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
