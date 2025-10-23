import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import React from "react";

const Newsletter = () => {
  return (
    <div className="bg-gray-100 py-6">
      <div className="center">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-8 text-center lg:text-left">
          <div className="flex flex-col max-w-md">
            <span className="text-2xl sm:text-3xl font-semibold mb-2">
              Subscribe to our Newsletter
            </span>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Pellentesque eu nibh eget mauris congue mattis mattis nec tellus.
              Phasellus imperdiet elit eu magna.
            </p>
          </div>
          <form className="w-full sm:w-[80%] md:w-[480px]">
            <div className="relative mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full h-[48px] sm:h-[52px] rounded-full border border-[#cccccc] ps-5 pr-32 text-sm sm:text-base outline-none bg-white transition-colors focus:border-[var(--main-primary)] hover:border-[var(--main-primary)]"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 sm:px-6 rounded-full bg-[var(--main-primary)] cursor-pointer text-white text-sm sm:text-base font-medium transition-colors hover:bg-[var(--hard-primary)]"
              >
                Subscribe
              </button>
            </div>
          </form>
          <div className="flex gap-4 text-gray-600 text-lg sm:text-xl justify-center lg:justify-end">
            <Linkedin className="transition-colors duration-200 hover:text-[var(--main-primary)] cursor-pointer" />
            <Facebook className="transition-colors duration-200 hover:text-[var(--main-primary)] cursor-pointer" />
            <Instagram className="transition-colors duration-200 hover:text-[var(--main-primary)] cursor-pointer" />
            <Twitter className="transition-colors duration-200 hover:text-[var(--main-primary)] cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
