// pages/Home.jsx
import React from "react";
import BannerTop from "../components/BannerTop";
import CompaniesVector from "../components/CompaniesVector";
import DealsBanner from "../components/DealsBanner";
import DiscountBanner from "../components/DiscountBanner";
import Featured from "../components/Featured";
import FeaturedBanner from "../components/FeaturedBanner";
import HotDeals from "../components/HotDeals";
import Newsletter from "../components/Newsletter";
import PopularProducts from "../components/PopularProducts";
import SocialsBanner from "../components/SocialsBanner";

const Home = () => {
  return (
    <>
      <BannerTop />
      <Featured />
      <PopularProducts />
      <DealsBanner />
      <HotDeals />
      <DiscountBanner />
      <FeaturedBanner />
      <CompaniesVector />
      <SocialsBanner />
      <Newsletter />
    </>
  );
};

export default Home;
