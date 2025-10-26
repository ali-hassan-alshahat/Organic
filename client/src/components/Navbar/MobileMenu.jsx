import React from "react";
import { NavLink } from "react-router-dom";
import { PhoneCall } from "lucide-react";

const MobileMenu = ({ isMobileMenuOpen, onClose }) => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "Contacts", href: "/contact" },
    { label: "Faq", href: "/faq" },
  ];

  return (
    <div
      className={`lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
      } overflow-hidden border-t border-gray-200 bg-white`}
    >
      <div className="px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `block py-3 px-4 font-medium rounded-lg transition-colors text-base ${
                    isActive
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
