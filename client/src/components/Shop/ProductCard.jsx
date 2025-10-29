import React from "react";
import { motion } from "motion/react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { renderStars } from "../../utils/renderStars";

const ProductCard = ({ product, onQuickView }) => {
  const discount =
    product.isOnSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <div className="group relative border border-gray-200 bg-white -m-[0.5px] transition-all duration-200 hover:border-[var(--soft-primary)] hover:shadow-[0_0_3px_1px_#84d187] hover:z-10 overflow-hidden">
      {product.isOnSale && (
        <span className="absolute top-0 left-0 bg-red-500 text-white text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 rounded-br-lg z-20">
          Sale {discount > 0 ? `${discount}%` : ""}
        </span>
      )}
      <div className="absolute top-2 right-2 flex flex-col gap-1 xs:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <button className="bg-white border border-gray-200 p-1.5 xs:p-2 rounded-full shadow-lg hover:bg-[var(--main-primary)] transition-colors cursor-pointer">
          <Heart className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
        <button
          onClick={() => onQuickView(product)}
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
        <button className="bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 xs:p-3 rounded-lg transition-colors flex-shrink-0">
          <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
