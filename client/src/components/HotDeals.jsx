import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductSection from "./common/ProductSection";
import QuickViewModal from "../components/common/QuickViewModal";
import { useQuickView } from "../hooks/useQuickView";

const HotDeals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { quickView, openQuickView, closeQuickView } = useQuickView();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8000/api/products?isFeatured=true",
        );
        const products = res.data.results?.products;
        setData(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <ProductSection
        title="Featured Products"
        data={data}
        loading={loading}
        onQuickView={openQuickView}
        className="pt-4"
      />
      <QuickViewModal quickView={quickView} onClose={closeQuickView} />
    </>
  );
};

export default HotDeals;
