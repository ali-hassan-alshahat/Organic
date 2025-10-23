import React, { useState } from "react";
import { MapPin, Heart, ShoppingBag, PhoneCall, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import logo from "../assets/logo-1.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <img src={logo} alt="Logo" className="h-8 w-auto sm:h-10" />
            </div>
            <div className="hidden lg:block">
              <NavigationMenu>
                <NavigationMenuList className="gap-6">
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink
                        className="text-gray-700 text-lg hover:text-[var(--soft-primary)] hover:bg-white font-medium transition-colors duration-200 cursor-pointer px-3 py-2"
                        asChild
                      >
                        <Link to={item.href}>{item.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm lg:text-base">
                Sign In / Sign Up
              </div>
              <div className="flex items-center gap-4">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer hover:text-[var(--soft-primary)] transition-colors" />
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer hover:text-[var(--soft-primary)] transition-colors" />
              </div>
              <button
                className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[var(--soft-primary)] hover:bg-gray-100 transition-colors"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? "max-h-96 opacity-100 py-4"
                : "max-h-0 opacity-0 overflow-hidden"
            } border-t border-gray-200`}
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-700 text-lg hover:text-[var(--soft-primary)] font-medium transition-colors duration-200 py-2 px-4 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="sm:hidden pt-2 border-t border-gray-200">
                <div className="text-gray-700 text-lg font-medium py-2 px-4">
                  Sign In / Sign Up
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
