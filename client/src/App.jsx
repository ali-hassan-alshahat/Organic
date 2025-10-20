import BannerTop from "./components/BannerTop";
import DealsBanner from "./components/DealsBanner";
import DiscountBanner from "./components/DiscountBanner";
import Featured from "./components/Featured";
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
    </>
  );
}

export default App;
