import React from "react";
import { motion } from "motion/react";
import Skeleton from "react-loading-skeleton";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading, onQuickView, renderStars }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 border border-gray-200">
        {new Array(9).fill(null).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="border border-gray-200 bg-white p-3 -m-[0.5px]"
          >
            <Skeleton height={160} />
            <div className="mt-3 space-y-2">
              <Skeleton width="80%" height={15} />
              <Skeleton width="60%" height={15} />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 border border-gray-200">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onQuickView={onQuickView}
          renderStars={renderStars}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
