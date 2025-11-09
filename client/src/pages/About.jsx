import React from "react";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import about1 from "../assets/about-1.png";
import bgAbout2 from "../assets/bg-about-2.png";
import about2 from "../assets/about-2.png";
import about3 from "../assets/about-3.png";
import {
  Check,
  CircleCheckBig,
  Headset,
  Leaf,
  MoveRight,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import CompaniesVector from "@/components/CompaniesVector";

const About = () => {
  const features = [
    {
      icon: <Leaf size={36} />,
      title: "100% Organic Food",
      text: "Free shipping on all your order",
    },
    {
      icon: <Headset size={36} />,
      title: "Customer Support 24/7",
      text: "Instant access to Support",
    },
    {
      icon: <Sparkles size={36} />,
      title: "Customer Feedback",
      text: "Our happy customer",
    },
    {
      icon: <CircleCheckBig size={36} />,
      title: "100% Secure Payment",
      text: "We ensure your money is safe",
    },
    {
      icon: <Truck size={36} />,
      title: "Free Shipping",
      text: "Free shipping on all your order",
    },
    {
      icon: <Package size={36} />,
      title: "Money-Back Guarantee",
      text: "30 Days Money-Back Guarantee",
    },
  ];

  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />
      <div className="center">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 py-8 px-4 sm:px-6">
          <div className="flex flex-col gap-6 w-full lg:w-[55%] xl:w-[50%] text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight sm:leading-snug lg:leading-relaxed">
              100% Trusted Organic Food Store
            </h1>
            <p className="text-gray-800 leading-relaxed text-base sm:text-lg lg:text-base">
              Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi,
              laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit.
              Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan.
              Donec a eros non massa vulputate ornare. Vivamus ornare commodo
              ante, at commodo felis congue vitae.
            </p>
          </div>
          <div className="flex items-center justify-center w-full lg:w-[45%] xl:w-[50%]">
            <img
              src={about1}
              alt="Organic food store"
              className="w-full max-w-md sm:max-w-lg lg:max-w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          className="flex flex-col lg:flex-row justify-between items-center gap-8 py-16 px-4 sm:px-6 bg-no-repeat bg-cover bg-center min-h-[600px]"
          style={{ backgroundImage: `url(${bgAbout2})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-l from-white via-white/90 to-white/20 pointer-events-none"></div>
          <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center justify-center w-full lg:w-[45%] xl:w-[50%] order-2 lg:order-1">
              <img
                src={about2}
                alt="Organic food store"
                className="w-full max-w-md sm:max-w-lg lg:max-w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-6 w-full lg:w-[55%] xl:w-[50%] text-center lg:text-left order-1 lg:order-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight sm:leading-snug lg:leading-relaxed">
                100% Trusted Organic Food Store
              </h1>
              <p className="text-gray-800 leading-relaxed text-base sm:text-lg lg:text-base">
                Pellentesque a ante vulputate leo porttitor luctus sed eget
                eros. Nulla et rhoncus neque. Duis non diam eget est luctus
                tincidunt a a mi. Nulla eu eros consequat tortor tincidunt
                feugiat.
              </p>
              <div className="mt-4">
                <FeaturedIcons features={features} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="center">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8 py-6 sm:py-8 px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-[55%] xl:w-[50%] text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight sm:leading-snug lg:leading-relaxed">
              We Delivered, You Enjoy Your Order.
            </h1>
            <p className="text-gray-800 leading-relaxed text-sm sm:text-base lg:text-base">
              Ut suscipit egestas suscipit. Sed posuere pellentesque nunc,
              ultrices consectetur velit dapibus eu. Mauris sollicitudin
              dignissim diam, ac mattis eros accumsan rhoncus. Curabitur auctor
              bibendum nunc eget elementum.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center text-[var(--main-primary)] bg-[#84d18766] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 mt-0.5">
                  <Check size={16} className="sm:w-5 sm:h-5" />
                </div>
                <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Sed in metus pellentesque.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center text-[var(--main-primary)] bg-[#84d18766] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 mt-0.5">
                  <Check size={16} className="sm:w-5 sm:h-5" />
                </div>
                <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Fusce et ex commodo, aliquam nulla efficitur, tempus lorem.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center text-[var(--main-primary)] bg-[#84d18766] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 mt-0.5">
                  <Check size={16} className="sm:w-5 sm:h-5" />
                </div>
                <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Maecenas ut nunc fringilla erat varius.
                </span>
              </div>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ease-in-out w-max py-2.5 sm:py-3 px-5 sm:px-6 lg:px-8 rounded-full cursor-pointer group font-medium text-xs sm:text-sm lg:text-base mx-auto lg:mx-0"
            >
              <span>Shop Now</span>
              <MoveRight
                size={16}
                className="sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="flex items-center justify-center w-full lg:w-[45%] xl:w-[50%] mt-4 sm:mt-6 lg:mt-0">
            <img
              src={about3}
              alt="Organic food store"
              className="w-full max-w-xs sm:max-w-md lg:max-w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      <CompaniesVector />
    </>
  );
};

const FeaturedIcons = ({ features }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    {features.map((feature) => (
      <div
        key={feature.title}
        className="flex items-start gap-3 p-3 sm:p-4 rounded-lg hover:bg-green-50 transition-colors border border-green-100"
      >
        <div className="text-[var(--soft-primary)] bg-green-100 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
          {feature.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            {feature.text}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default About;
