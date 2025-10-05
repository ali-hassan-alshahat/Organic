import React from "react";
import banner1 from "../assets/banner-1.webp";
import banner2 from "../assets/banner-2.webp";
import banner3 from "../assets/banner-3.webp";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const BannerTop = () => {
  return (
    <div className="center">
      <div className="flex flex-col lg:flex-row gap-4 w-full h-auto lg:h-[550px]">
        {/* LEFT MAIN BANNER */}
        <div className="w-full lg:w-[65%] h-[300px] sm:h-[400px] lg:h-full">
          <section
            className="relative w-full h-full block rounded-lg bg-cover bg-center bg-no-repeat after:absolute after:inset-0 after:bg-gradient-to-r after:from-black/70 after:to-black/5 after:rounded-lg after:z-10"
            style={{
              backgroundImage: `url(${banner1})`,
            }}
          >
            <div className="relative flex flex-col justify-center h-full text-white gap-4 sm:gap-6 z-20 ps-6 sm:ps-10 lg:ps-12">
              <div className="flex flex-col gap-2 sm:gap-4 text-3xl sm:text-4xl lg:text-5xl leading-tight">
                <span>Fresh & Healthy</span>
                <span>Organic Food</span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-4 border-s-[2px] p-2 border-[var(--soft-primary)]">
                <div className="flex items-center gap-2 text-lg sm:text-2xl">
                  <span>Sale up to</span>
                  <div className="bg-orange-400 w-max py-1 px-2 rounded">
                    <span>30% Off</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-300">
                  Free shipping on all your order
                </span>
              </div>

              <Link
                to="/shop"
                className="flex items-center bg-white hover:bg-gray-200 transition-all duration-200 ease-in-out text-[var(--main-primary)] w-max py-2 sm:py-3 px-4 sm:px-6 rounded-4xl cursor-pointer group text-sm sm:text-base"
              >
                <span>Shop Now</span>
                <span className="ps-1 transition-all duration-300 ease-in-out group-hover:translate-x-2">
                  <MoveRight />
                </span>
              </Link>
            </div>
          </section>
        </div>

        {/* RIGHT SIDE BANNERS */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4 h-auto lg:h-full">
          {/* Banner 2 */}
          <section
            className="relative w-full h-[200px] sm:h-[250px] lg:h-1/2 block rounded-lg bg-cover bg-center bg-no-repeat after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/35 after:via-black/9 after:to-transparent after:rounded-lg after:z-10"
            style={{
              backgroundImage: `url(${banner2})`,
            }}
          >
            <div className="relative flex flex-col h-full justify-center gap-2 sm:gap-4 p-4 sm:p-6 z-20">
              <span className="text-lg sm:text-xl font-medium">
                Summer Sale
              </span>
              <span className="text-2xl sm:text-3xl font-medium">75% OFF</span>
              <span className="text-xs sm:text-sm text-gray-700">
                Only Fruit & Vegetable
              </span>
              <Link
                to="/shop"
                className="flex items-center text-[var(--main-primary)] hover:text-[var(--hard-primary)] w-max cursor-pointer transition-all duration-200 ease-in-out group text-sm sm:text-base"
              >
                <span>Shop Now</span>
                <span className="ps-1 transition-all duration-300 ease-in-out group-hover:translate-x-2">
                  <MoveRight />
                </span>
              </Link>
            </div>
          </section>

          {/* Banner 3 */}
          <section
            className="relative w-full h-[200px] sm:h-[250px] lg:h-1/2 block rounded-lg bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${banner3})`,
            }}
          >
            <div className="flex flex-col items-center justify-center text-center gap-1 sm:gap-2 h-full text-white px-4">
              <span className="text-lg sm:text-xl font-medium">Best Deal</span>
              <span className="text-2xl sm:text-3xl font-medium leading-tight">
                Special Products
                <br />
                Deal Of The Month
              </span>
              <Link
                to="/shop"
                className="flex items-center text-[var(--main-primary)] hover:text-[var(--soft-primary)] w-max cursor-pointer transition-all duration-200 ease-in-out group text-sm sm:text-base"
              >
                <span>Shop Now</span>
                <span className="ps-1 transition-all duration-300 ease-in-out group-hover:translate-x-2">
                  <MoveRight />
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BannerTop;
