import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { renderStars } from "../../utils/renderStars";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  selectCartItems,
  selectCanAddToCart,
  addToCart,
} from "@/rtk/slices/cartSlice";
import {
  addToGuestWishlist,
  addToWishlist,
  removeFromWishlist,
  removeFromGuestWishlist,
} from "@/rtk/slices/wishlistSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { selectIsAuthenticated } from "../../rtk/slices/authSlice";

const ProductCard = ({ product, onQuickView }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const { items: wishlistItems, loading: wishlistLoading } = useSelector(
    (state) => state.wishlist,
  );
  const [isInWishlist, setIsInWishlist] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [addingToCart, setAddingToCart] = useState(false);
  const canAddToCart = useSelector(selectCanAddToCart(product._id, 1));

  useEffect(() => {
    const inWishlist = wishlistItems.some(
      (item) => item.productId?._id === product._id || item._id === product._id,
    );
    setIsInWishlist(inWishlist);
  }, [wishlistItems, product._id]);
  const discount =
    product.isOnSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart) return;
    // Check stock before adding
    const existingCartItem = cartItems.find((item) => item._id === product._id);
    const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;
    if (currentQuantity >= product.countInStock) {
      toast.error(`Cannot add more ${product.name} - maximum quantity reached`);
      return;
    }
    setAddingToCart(true);
    try {
      if (isAuthenticated) {
        await dispatch(
          addToCart({ productId: product._id, quantity: 1 }),
        ).unwrap();
        toast.success(`Added ${product.name} to cart successfully`);
      } else {
        dispatch(addItemToCart(product));
        toast.success(`Added ${product.name} to cart successfully`);
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error(
        error.payload || error.message || "Failed to add item to cart",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isInWishlist) {
        // Remove from wishlist
        if (isAuthenticated) {
          await dispatch(removeFromWishlist(product._id)).unwrap();
          toast.success(`${product.name} removed from wishlist`);
        } else {
          dispatch(removeFromGuestWishlist(product._id));
          toast.success(`${product.name} removed from wishlist`);
        }
      } else {
        // Add to wishlist
        if (isAuthenticated) {
          await dispatch(addToWishlist(product._id)).unwrap();
          toast.success(`${product.name} added to wishlist`);
        } else {
          dispatch(addToGuestWishlist(product));
          toast.success(`${product.name} added to wishlist`);
        }
      }
    } catch (error) {
      toast.error(error.payload || "Something went wrong");
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };
  // Check if product is out of stock or max quantity reached
  const isOutOfStock = product.countInStock === 0;
  const isMaxQuantityReached = !canAddToCart;
  const isLoading = addingToCart || cartLoading;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative border bg-white transition-all duration-200 hover:shadow-[0_0_3px_1px_#84d187] z-0 hover:z-10  overflow-hidden"
    >
      {product.isOnSale && (
        <span className="absolute top-0 left-0 bg-red-500 text-white text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 rounded-br-lg z-20">
          Sale {discount > 0 ? `${discount}%` : ""}
        </span>
      )}
      {isOutOfStock && (
        <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 rounded-bl-lg z-20">
          Out of Stock
        </span>
      )}
      {isMaxQuantityReached && !isOutOfStock && (
        <span className="absolute top-0 left-0 bg-orange-500 text-white text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 rounded-bl-lg z-20">
          Max Quantity
        </span>
      )}
      <div className="absolute top-2 right-2 flex flex-col gap-1 xs:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className={`bg-white border border-gray-200 p-1.5 xs:p-2 rounded-full shadow-lg hover:bg-[var(--main-primary)] transition-colors cursor-pointer ${
            wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
          } ${isInWishlist ? "bg-red-50 border-red-200 hover:bg-red-100" : ""}`}
        >
          <Heart
            className={`w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 transition-colors ${
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
        <button
          onClick={handleQuickView}
          className="bg-white border border-gray-200 p-1.5 xs:p-2 rounded-full shadow-lg hover:bg-[var(--main-primary)] cursor-pointer transition-colors"
        >
          <Eye className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
      </div>
      <div className="w-full aspect-square overflow-hidden flex items-center justify-center p-3 xs:p-4">
        <img
          src={product.image}
          loading="lazy"
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-3 xs:p-4 flex justify-between items-start gap-2 xs:gap-3">
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm xs:text-base sm:text-lg font-medium text-gray-900 line-clamp-2 mb-1 xs:mb-2 leading-tight">
            {product.name}
          </p>
          {product.isOnSale && product.salePrice ? (
            <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2 mb-1 xs:mb-2">
              <p className="font-semibold text-green-600 text-base xs:text-lg sm:text-xl">
                ${product.salePrice.toFixed(2)}
              </p>
              <p className="line-through text-gray-500 text-sm xs:text-base">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="font-semibold text-gray-800 text-base xs:text-lg sm:text-xl mb-1 xs:mb-2">
              ${product.price.toFixed(2)}
            </p>
          )}
          <div className="flex items-center gap-1 xs:gap-2">
            <div className="flex items-center gap-0.5 xs:gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs xs:text-sm text-gray-500">
              ({product.numReviews})
            </span>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isLoading || isOutOfStock || isMaxQuantityReached}
          className={`${
            isOutOfStock || isMaxQuantityReached
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 cursor-pointer"
          } text-white p-2 rounded-lg transition-colors ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ShoppingBag className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="px-3 xs:px-4 pb-3 xs:pb-4">
        <div className="text-xs text-gray-500">
          {isOutOfStock ? (
            <span className="text-red-500">Out of stock</span>
          ) : (
            <span>
              {product.countInStock} in stock
              {isMaxQuantityReached && " • Max quantity in cart"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
