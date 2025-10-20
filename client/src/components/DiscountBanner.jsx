import { MoveRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import discountBanner from "../assets/discount-banner.png";

const DiscountBanner = () => {
  return (
    <div className="center">
      <section
        className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] block rounded-2xl bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${discountBanner})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex flex-col justify-center h-full text-white px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-md ml-auto">
            <span className="text-sm sm:text-base font-medium tracking-wider text-gray-200 block mb-2">
              SUMMER SALE
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4">
              <span className="text-orange-400">37%</span> OFF
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6 max-w-xs">
              Free on all your order, Free Shipping and 30 days money-back
              guarantee
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ease-in-out w-max py-3 px-6 sm:px-8 rounded-full cursor-pointer group font-medium text-sm sm:text-base"
            >
              <span>Shop Now</span>
              <MoveRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscountBanner;
