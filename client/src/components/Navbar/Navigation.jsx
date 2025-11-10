import React from "react";
import { NavLink } from "react-router-dom";
import { PhoneCall, ShoppingCart } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Contacts", href: "/contact" },
    { label: "Faq", href: "/faq" },
  ];

  return (
    <div className="hidden lg:block border-t border-gray-200 bg-white">
      <div className="center !py-3">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `relative font-medium text-gray-700 transition-all duration-200 hover:text-green-600 text-base ${
                    isActive ? "text-green-600" : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-green-600 rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-2 font-medium text-gray-700 transition-all duration-200 hover:text-green-600 text-base ${
                  isActive ? "text-green-600" : ""
                }`
              }
            ></NavLink>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <PhoneCall size={16} className="text-green-500" />
            <span className="text-sm">(219) 555-0114</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
