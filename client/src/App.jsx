import BannerTop from "./components/BannerTop";
import CompaniesVector from "./components/CompaniesVector";
import DealsBanner from "./components/DealsBanner";
import DiscountBanner from "./components/DiscountBanner";
import Featured from "./components/Featured";
import FeaturedBanner from "./components/FeaturedBanner";
import HotDeals from "./components/HotDeals";
import Navbar from "./components/Navbar";
import PopularProducts from "./components/PopularProducts";
import SocialsBanner from "./components/SocialsBanner";

function App() {
  return (
    <>
      <Navbar />
      <BannerTop />
      <Featured />
      <PopularProducts />
      <DealsBanner />
      <HotDeals />
      <DiscountBanner />
      <FeaturedBanner />
      <CompaniesVector />
      <SocialsBanner />
    </>
  );
}

export default App;
