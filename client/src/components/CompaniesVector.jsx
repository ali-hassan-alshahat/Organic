import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Vector1 from "../assets/vector-1.svg?react";
import Vector2 from "../assets/vector-2.svg?react";
import Vector3 from "../assets/vector-3.svg?react";
import Vector4 from "../assets/vector-4.svg?react";
import Vector5 from "../assets/vector-5.svg?react";
import Vector6 from "../assets/vector-6.svg?react";

const CompaniesVector = () => {
  const data = [Vector1, Vector2, Vector3, Vector4, Vector5, Vector6];

  const slickSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 991, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 500, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="center">
      <Slider {...slickSettings}>
        {data.map((Icon, index) => (
          <div key={index}>
            <div className="px-4 flex justify-center items-center h-20 group">
              <Icon className="w-[120px] h-8 text-gray-400 transition-colors duration-300 group-hover:text-[var(--main-primary)]" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CompaniesVector;
