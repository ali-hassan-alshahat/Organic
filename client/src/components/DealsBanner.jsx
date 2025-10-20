import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import bestDeals from "../assets/best-deals.png";
import lowFat from "../assets/low-fat.png";
import freshFruit from "../assets/fresh-fruit.png";

const DealsBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 8);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeUnit = (time) => time.toString().padStart(2, "0");

  const data = [
    {
      id: 1,
      title: "Sale of the Month",
      subtitle: "Best Deals",
      bg: bestDeals,
      btnText: "Shop Now",
      link: "/shop",
      textColor: "text-white",
      showTimer: true,
    },
    {
      id: 2,
      title: "Low-Fat Meat",
      subtitle: "85% FAT FREE",
      description: "Started at",
      highlightNumber: "$79.99",
      highlightStyle: "text-orange-400 font-semibold",
      bg: lowFat,
      btnText: "Shop Now",
      link: "/shop",
      textColor: "text-white",
      showTimer: false,
    },
    {
      id: 3,
      title: "100% Fresh Fruit",
      subtitle: "SUMMER SALE",
      description: "Up to",
      highlightNumber: "64% OFF",
      highlightStyle:
        "bg-black text-yellow-400 px-3 py-2 rounded font-semibold text-sm",
      bg: freshFruit,
      btnText: "Shop Now",
      link: "/shop",
      textColor: "text-gray-900",
      showTimer: false,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {data.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden shadow-md"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.bg})` }}
            ></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div
              className={`relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 ${item.textColor}`}
            >
              <span className="uppercase tracking-wide font-semibold text-sm sm:text-base mb-2">
                {item.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                {item.title}
              </h2>
              {item.showTimer ? (
                <div className="w-full max-w-xs mb-4 sm:mb-6">
                  <div className="flex justify-between gap-1 sm:gap-2 text-gray-200">
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                        {formatTimeUnit(timeLeft.days)}
                      </span>
                      <span className="text-xs sm:text-sm font-normal mt-1">
                        Days
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xl sm:text-2xl font-bold opacity-70">
                        :
                      </span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                        {formatTimeUnit(timeLeft.hours)}
                      </span>
                      <span className="text-xs sm:text-sm font-normal mt-1">
                        Hours
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xl sm:text-2xl font-bold opacity-70">
                        :
                      </span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                        {formatTimeUnit(timeLeft.minutes)}
                      </span>
                      <span className="text-xs sm:text-sm font-normal mt-1">
                        Minutes
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xl sm:text-2xl font-bold opacity-70">
                        :
                      </span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                        {formatTimeUnit(timeLeft.seconds)}
                      </span>
                      <span className="text-xs sm:text-sm font-normal mt-1">
                        Seconds
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 px-4">
                  {item.description}{" "}
                  <span className={item.highlightStyle}>
                    {item.highlightNumber}
                  </span>
                </p>
              )}
              <Link
                to={item.link}
                className="flex items-center bg-white hover:bg-gray-200 transition-all duration-200 ease-in-out text-[var(--main-primary)] w-max py-2 sm:py-3 px-4 sm:px-6 rounded-4xl cursor-pointer group text-sm sm:text-base"
              >
                <span>{item.btnText}</span>
                <span className="ps-1 transition-all duration-300 ease-in-out group-hover:translate-x-2">
                  <MoveRight size={18} />
                </span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default DealsBanner;
