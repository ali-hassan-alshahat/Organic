import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BannerTop from "./components/BannerTop";
import CompaniesVector from "./components/CompaniesVector";
import DealsBanner from "./components/DealsBanner";
import DiscountBanner from "./components/DiscountBanner";
import Featured from "./components/Featured";
import FeaturedBanner from "./components/FeaturedBanner";
import HotDeals from "./components/HotDeals";
import Newsletter from "./components/Newsletter";
import PopularProducts from "./components/PopularProducts";
import SocialsBanner from "./components/SocialsBanner";
import Layout from "./components/Layout";
import Shop from "./pages/Shop";
import Home from "./pages/Home";

function App() {
  let routers = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        { path: "/shop", element: <Shop /> },
      ],
    },
  ]);
  return <RouterProvider router={routers} />;
}

export default App;
