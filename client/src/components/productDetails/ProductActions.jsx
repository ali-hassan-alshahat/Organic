import React from "react";
import { Heart, Plus, Minus, ShoppingBag } from "lucide-react";

const ProductActions = ({
  product,
  quantity,
  handleQuantityChange,
  handleAddToCart,
  handleBuyNow,
  handleWishlistToggle,
  isInWishlist,
  addingToWishlist,
  addingToCart,
  cartLoading,
  canAddToCart,
}) => {
  const isOutOfStock = product.countInStock === 0;
  const isMaxQuantityReached = !canAddToCart;
  const isLoading = addingToCart || cartLoading;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Quantity:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center border cursor-pointer border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-semibold text-lg">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.countInStock}
              className="w-10 h-10 flex items-center justify-center border cursor-pointer border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <button
          onClick={handleWishlistToggle}
          disabled={addingToWishlist}
          className={`p-3 border-2 rounded-lg transition-colors ${
            isInWishlist
              ? "border-red-300 bg-red-50 hover:bg-red-100 text-red-600"
              : "border-gray-300 hover:border-[var(--main-primary)] hover:bg-gray-50 text-gray-600"
          } ${
            addingToWishlist
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          <Heart size={20} className={isInWishlist ? "fill-current" : ""} />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={handleAddToCart}
          disabled={isLoading || isOutOfStock || isMaxQuantityReached}
          className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
            isOutOfStock || isMaxQuantityReached
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 cursor-pointer text-white hover:shadow-lg"
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
        <button
          onClick={handleBuyNow}
          disabled={isLoading || isOutOfStock || isMaxQuantityReached}
          className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
            isOutOfStock || isMaxQuantityReached
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[var(--main-primary)] hover:bg-[var(--hard-primary)] cursor-pointer text-white hover:shadow-lg"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Buy Now
        </button>
      </div>
      {isMaxQuantityReached && !isOutOfStock && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg">
          Maximum quantity ({product.countInStock}) reached in cart
        </div>
      )}
    </div>
  );
};

export default ProductActions;
