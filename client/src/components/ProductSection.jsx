import React from "react";
import { motion } from "motion/react";
import Skeleton from "react-loading-skeleton";
import ProductCard from "./Shop/ProductCard";

const ProductSection = ({
  title,
  viewAllLink = "/shop",
  data = [],
  loading,
  onQuickView,
  className = "",
}) => {
  return (
    <div className={className}>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="center"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">{title}</h1>
          <motion.a
            href={viewAllLink}
            className="text-green-600 hover:underline font-medium"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            View All →
          </motion.a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border border-gray-200">
          {loading
            ? new Array(10).fill(null).map((_, i) => (
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
              ))
            : data.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
        </div>
      </motion.section>
    </div>
  );
};

export default ProductSection;
