import BannerTop from "./components/BannerTop";
import DealsBanner from "./components/DealsBanner";
import Featured from "./components/Featured";
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
    </>
  );
}

export default App;
