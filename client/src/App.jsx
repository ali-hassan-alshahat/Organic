import BannerTop from "./components/BannerTop";
import CompaniesVector from "./components/CompaniesVector";
import DealsBanner from "./components/DealsBanner";
import DiscountBanner from "./components/DiscountBanner";
import Featured from "./components/Featured";
import FeaturedBanner from "./components/FeaturedBanner";
import Footer from "./components/Footer";
import HotDeals from "./components/HotDeals";
import Navbar from "./components/Navbar";
import Newsletter from "./components/Newsletter";
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
      <Newsletter />
      <Footer />
    </>
  );
}

export default App;
