import React from "react";
import post1 from "../assets/instagram-post1.png";
import post2 from "../assets/instagram-post2.png";
import post3 from "../assets/instagram-post3.png";
import post4 from "../assets/instagram-post4.png";
import post5 from "../assets/instagram-post5.png";
import post6 from "../assets/instagram-post6.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Instagram } from "lucide-react";
import { motion } from "motion/react";

const SocialsBanner = () => {
  const data = [post1, post2, post3, post4, post5, post6];
  const slickSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
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
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="center"
    >
      <div className="flex items-center justify-center sm:justify-start py-4 pb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Follow us on Instagram
        </h1>
      </div>
      <div className="relative w-full">
        <Slider {...slickSettings}>
          {data.map((post, index) => (
            <div key={index} className="relative px-2 group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={post}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex items-center justify-center cursor-pointer absolute inset-0 opacity-0 group-hover:bg-[#2B572E] group-hover:opacity-[80%] transition-all duration-300 ease-in-out z-10">
                  <Instagram
                    size={40}
                    className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </motion.section>
  );
};

export default SocialsBanner;
