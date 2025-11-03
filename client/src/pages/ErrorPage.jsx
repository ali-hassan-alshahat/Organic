import React from "react";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import error from "../assets/error.png";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "404", href: "/" },
        ]}
      />
      <div className="center">
        <div className="flex flex-col items-center text-center py-2 sm:py-4 md:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-4 sm:mb-6 md:mb-8">
            <img
              src={error}
              alt="404 Error - Page not found"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-lg lg:max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
              Oops! Page Not Found
            </h1>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose px-2 sm:px-0">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <Link
              to={"/"}
              className="py-3 px-6 sm:py-3 sm:px-8 md:py-4 md:px-10 text-white bg-[var(--main-primary)] rounded-full hover:bg-[var(--hard-primary)] duration-300 text-sm sm:text-base md:text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-transform"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
