import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ShoppingBag, Heart, Eye, X, Star, Truck, Shield } from "lucide-react";

const FeaturedBanner = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8000/api/products?isFeatured=true",
        );
        const products = res.data.results?.products;
        setData(products);
        console.log(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const openQuickView = (product) => {
    setQuickView(product);
    document.body.style.overflow = "hidden";
  };
  const closeQuickView = () => {
    setQuickView(null);
    document.body.style.overflow = "unset";
  };
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            i <= Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i - rating < 1
              ? "text-yellow-300 fill-yellow-300"
              : "text-gray-300"
          }`}
        />,
      );
    }
    return stars;
  };
  return (
    <div className="pt-4">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="center"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Featured Products
          </h1>
          <motion.a
            href="/shop"
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
            : data.map((product) => {
                const discount =
                  product.isOnSale && product.salePrice
                    ? Math.round(
                        ((product.price - product.salePrice) / product.price) *
                          100,
                      )
                    : 0;
                return (
                  <div
                    key={product._id}
                    className="group relative border border-gray-200 bg-white -m-[0.5px] transition-all duration-200 hover:border-[var(--soft-primary)] hover:shadow-[0_0_3px_1px_#84d187] hover:z-10 overflow-hidden"
                  >
                    {product.isOnSale && (
                      <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-4 py-2 rounded-br-lg z-20">
                        Sale {discount > 0 ? `${discount}%` : ""}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button className="bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-[var(--main-primary)] transition-colors cursor-pointer">
                        <Heart size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => openQuickView(product)}
                        className="bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-[var(--main-primary)] cursor-pointer transition-colors"
                      >
                        <Eye size={18} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
                      <img
                        src={product.image}
                        loading="lazy"
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-3 flex justify-between items-start">
                      <div className="text-left flex-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </p>
                        {product.isOnSale && product.salePrice ? (
                          <div className="flex gap-2 text-sm items-center">
                            <p className="font-semibold text-green-600">
                              ${product.salePrice.toFixed(2)}
                            </p>
                            <p className="line-through text-gray-500 text-xs">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-semibold text-gray-800">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                        <div className="flex items-center mt-1">
                          <div className="flex items-center gap-0.5">
                            {renderStars(product.rating)}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.numReviews})
                          </span>
                        </div>
                      </div>
                      <button className="bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded-lg transition-colors ml-2">
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeQuickView}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                <motion.button
                  onClick={closeQuickView}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors group cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X
                    size={24}
                    className="text-gray-500 group-hover:text-gray-700"
                  />
                </motion.button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-sm rounded-xl p-6">
                        <img
                          src={quickView.image}
                          loading="lazy"
                          alt={quickView.name}
                          className="w-full h-64 object-contain"
                        />
                      </div>
                      <div className="flex gap-3 mt-4">
                        {[1, 2, 3].map((index) => (
                          <div
                            key={index}
                            className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-gray-200 p-1 cursor-pointer hover:border-[var(--main-primary)] transition-colors"
                          >
                            <img
                              src={quickView.image}
                              loading="lazy"
                              alt={quickView.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {quickView.name}
                        </h1>
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {quickView.category?.name || quickView.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {renderStars(quickView.rating)}
                        </div>
                        <span className="text-gray-600">
                          {quickView.rating?.toFixed(1)} ({quickView.numReviews}{" "}
                          reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {quickView.isOnSale && quickView.salePrice ? (
                          <>
                            <span className="text-4xl font-bold text-green-600">
                              ${quickView.salePrice.toFixed(2)}
                            </span>
                            <span className="text-2xl line-through text-gray-400">
                              ${quickView.price.toFixed(2)}
                            </span>
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                              SAVE $
                              {(quickView.price - quickView.salePrice).toFixed(
                                2,
                              )}
                            </span>
                          </>
                        ) : (
                          <span className="text-4xl font-bold text-gray-900">
                            ${quickView.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {quickView.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Truck size={18} className="text-green-500" />
                          Free shipping
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Shield size={18} className="text-green-500" />
                          1-year warranty
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            quickView.countInStock > 0
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            quickView.countInStock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {quickView.countInStock > 0
                            ? `${quickView.countInStock} items available`
                            : "Out of stock"}
                        </span>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors hover:shadow-lg cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={quickView.countInStock === 0}
                        >
                          <ShoppingBag size={24} />
                          Add to Cart
                        </button>
                        <button className="p-4 border-2 border-gray-300 hover:border-[var(--main-primary)] hover:bg-gray-50 cursor-pointer rounded-xl transition-colors">
                          <Heart size={24} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default FeaturedBanner;
