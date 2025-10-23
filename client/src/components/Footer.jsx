import React from "react";
import logo from "../assets/logo-2.svg";
import applePay from "../assets/applePay.svg";
import visa from "../assets/visa.svg";
import discover from "../assets/discover.svg";
import mastercard from "../assets/mastercard.svg";
import securepayment from "../assets/securePayment.svg";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-2 md:py-4 lg:py-6">
      <div className="center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          <div className="px-4 md:px-6 lg:px-8 text-left">
            <img src={logo} alt="Logo" className="h-8 sm:h-10 lg:h-12 mb-4" />
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 md:mb-8">
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis
              dui, eget bibendum magna congue nec.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-4 pt-4 md:pt-6 lg:pt-8">
              <span className="border-b border-[var(--main-primary)] pb-1 text-sm sm:text-base hover:text-[var(--main-primary)] transition-colors cursor-pointer whitespace-nowrap">
                (219) 555-0114
              </span>
              <span className="text-gray-500 text-sm">Or</span>
              <span className="border-b border-[var(--main-primary)] pb-1 text-sm sm:text-base hover:text-[var(--main-primary)] transition-colors cursor-pointer whitespace-nowrap">
                Proxy@gmail.com
              </span>
            </div>
          </div>
          <div className="flex flex-col px-4 md:px-6 lg:px-8 text-left">
            <h4 className="text-lg md:text-xl font-semibold pb-4 md:pb-6 border-b md:border-none border-gray-700 mb-4">
              My Account
            </h4>
            <ul className="text-gray-400 flex flex-col gap-3 md:gap-4 text-sm md:text-base">
              {["Order History", "Wishlist", "Shopping Cart", "Settings"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-[var(--main-primary)] hover:ps-1 transition-all cursor-pointer py-1"
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="flex flex-col px-4 md:px-6 lg:px-8 text-left">
            <h4 className="text-lg md:text-xl font-semibold pb-4 md:pb-6 border-b md:border-none border-gray-700 mb-4">
              Helps
            </h4>
            <ul className="text-gray-400 flex flex-col gap-3 md:gap-4 text-sm md:text-base">
              {["Contacts", "Faqs", "Terms & Condition", "Privacy Policy"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-[var(--main-primary)] hover:ps-1 transition-all cursor-pointer py-1"
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 md:mt-12 lg:mt-16 pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>Ecobazar© 2024. All Rights Reserved</p>
            <div className="flex gap-2 text-xs sm:text-sm">
              {[applePay, visa, discover, mastercard, securepayment].map(
                (item) => (
                  <img
                    src={item}
                    alt="Logo"
                    key={item}
                    className="sm:h-4 md:h-8 lg:h-10 w-auto cursor-pointer"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
