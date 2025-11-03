import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  X,
  ShoppingBag,
  Heart,
  Truck,
  Shield,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { renderStars } from "../../utils/renderStars";
import {
  addItemToCart,
  addToCart,
  selectCartItems,
  selectCanAddToCart,
  clearError,
} from "@/rtk/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
  addToGuestWishlist,
  removeFromGuestWishlist,
} from "@/rtk/slices/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/rtk/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const QuickViewModal = ({ quickView, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector(selectCartItems);
  const { loading: cartLoading, error: cartError } = useSelector(
    (state) => state.cart,
  );
  const isInWishlist = useSelector((state) =>
    quickView ? selectIsInWishlist(state, quickView._id) : false,
  );
  const wishlistLoading = useSelector((state) => state.wishlist.loading);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);

  const canAddToCart = useSelector((state) =>
    quickView ? selectCanAddToCart(quickView._id, 1)(state) : false,
  );
  useEffect(() => {
    if (quickView) {
      const inCart = cartItems.some((item) => item._id === quickView._id);
      setIsProductInCart(inCart);
    }
  }, [cartItems, quickView]);

  useEffect(() => {
    return () => {
      if (cartError) {
        dispatch(clearError());
      }
    };
  }, [dispatch, cartError]);

  useEffect(() => {
    if (quickView && cartError) {
      dispatch(clearError());
    }
  }, [quickView, dispatch, cartError]);

  if (!quickView) return null;

  const handleAddToCart = async () => {
    if (addingToCart) return;
    // Check stock before adding
    const existingCartItem = cartItems.find(
      (item) => item._id === quickView._id,
    );
    const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;
    if (currentQuantity >= quickView.countInStock) {
      toast.error(
        `Cannot add more ${quickView.name} - maximum quantity reached`,
      );
      return;
    }
    setAddingToCart(true);
    try {
      if (isAuthenticated) {
        await dispatch(
          addToCart({ productId: quickView._id, quantity: 1 }),
        ).unwrap();
        toast.success(`Added ${quickView.name} to cart successfully`);
        setIsProductInCart(true);
      } else {
        const productWithQuantity = { ...quickView, quantity: 1 };
        dispatch(addItemToCart(productWithQuantity));
        toast.success(`Added ${quickView.name} to cart successfully`);
        setIsProductInCart(true);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleGoToCart = () => {
    onClose();
    navigate("/cart");
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      if (isInWishlist) {
        dispatch(removeFromGuestWishlist(quickView._id));
        toast.success(`${quickView.name} removed from wishlist`);
      } else {
        dispatch(addToGuestWishlist(quickView));
        toast.success(`${quickView.name} added to wishlist`);
      }
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(quickView._id)).unwrap();
        toast.success(`${quickView.name} removed from wishlist`);
      } else {
        await dispatch(addToWishlist(quickView._id)).unwrap();
        toast.success(`${quickView.name} added to wishlist`);
      }
    } catch (error) {
      toast.error(error.payload || "Something went wrong");
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
  };

  // Check if product is out of stock or max quantity reached
  const isOutOfStock = quickView.countInStock === 0;
  const isMaxQuantityReached = !canAddToCart;
  const isLoading = addingToCart || cartLoading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
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
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} className="text-gray-500 group-hover:text-gray-700" />
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
                        {(quickView.price - quickView.salePrice).toFixed(2)}
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
                      quickView.countInStock > 0 ? "bg-green-500" : "bg-red-500"
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
                  {isMaxQuantityReached && !isOutOfStock && (
                    <span className="text-sm text-orange-600 font-medium">
                      • Max quantity in cart
                    </span>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  {isProductInCart ? (
                    <button
                      onClick={handleGoToCart}
                      className="flex-1 py-4 px-8 rounded-xl font-semibold text-lg transition-colors hover:shadow-lg flex items-center justify-center gap-3 bg-[var(--main-primary)] hover:bg-[var(--hard-primary)] text-white cursor-pointer"
                    >
                      <ShoppingBag size={24} />
                      Go to Cart
                      <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        isLoading || isOutOfStock || isMaxQuantityReached
                      }
                      className={`flex-1 py-4 px-8 rounded-xl font-semibold text-lg transition-colors hover:shadow-lg flex items-center justify-center gap-3 ${
                        isOutOfStock || isMaxQuantityReached
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 cursor-pointer text-white"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={24} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    className={`p-4 border-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                      isInWishlist
                        ? "border-red-300 bg-red-50 hover:bg-red-100"
                        : "border-gray-300 hover:border-[var(--main-primary)] hover:bg-gray-50"
                    } ${
                      wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Heart
                      size={24}
                      className={
                        isInWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }
                    />
                  </button>
                </div>
                {cartError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span className="font-medium">{cartError}</span>
                      </div>
                      <button
                        onClick={handleRetry}
                        className="flex items-center gap-1 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                      >
                        <RefreshCw size={14} />
                        Retry
                      </button>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                      {cartError.includes("fetch")
                        ? "Please check your internet connection and try again."
                        : "Please try again or contact support if the problem persists."}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuickViewModal;
