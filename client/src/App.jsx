import BannerTop from "./components/BannerTop";
import DealsBanner from "./components/DealsBanner";
import DiscountBanner from "./components/DiscountBanner";
import Featured from "./components/Featured";
import FeaturedBanner from "./components/FeaturedBanner";
import HotDeals from "./components/HotDeals";
import Navbar from "./components/Navbar";
import PopularProducts from "./components/PopularProducts";

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
    </>
  );
}

export default App;
