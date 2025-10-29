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
        <span className="absolute top-0 left-0 bg-red-500 text-white text-[10px] xs:text-xs px-2 xs:px-3 py-1 xs:py-2 rounded-br-lg z-20">
          Sale {discount > 0 ? `${discount}%` : ""}
        </span>
      )}
      <div className="absolute top-2 right-2 flex flex-col gap-1 xs:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <button className="bg-white border border-gray-200 p-1 xs:p-2 rounded-full shadow-lg hover:bg-[var(--main-primary)] transition-colors cursor-pointer">
          <Heart size={22} className="xs:w-4 xs:h-4 text-gray-600" />
        </button>
        <button
          onClick={() => onQuickView(product)}
          className="bg-white border border-gray-200 p-1 xs:p-2 rounded-full shadow-lg hover:bg-[var(--main-primary)] cursor-pointer transition-colors"
        >
          <Eye size={22} className="xs:w-4 xs:h-4 text-gray-600" />
        </button>
      </div>
      <div className="w-full aspect-square overflow-hidden flex items-center justify-center p-2 xs:p-3">
        <img
          src={product.image}
          loading="lazy"
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-2 xs:p-3 flex justify-between items-start gap-1 xs:gap-2">
        <div className="text-left flex-1 min-w-0">
          <p className="text-xs xs:text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </p>
          {product.isOnSale && product.salePrice ? (
            <div className="flex flex-col xs:flex-row xs:gap-2 text-xs xs:text-sm items-start xs:items-center">
              <p className="font-semibold text-green-600">
                ${product.salePrice.toFixed(2)}
              </p>
              <p className="line-through text-gray-500 text-[10px] xs:text-xs">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="font-semibold text-gray-800 text-xs xs:text-sm">
              ${product.price.toFixed(2)}
            </p>
          )}
          <div className="flex items-center mt-1">
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating)}
            </div>
            <span className="text-[10px] xs:text-xs text-gray-500 ml-1">
              ({product.numReviews})
            </span>
          </div>
        </div>
        <button className="bg-green-500 hover:bg-green-600 cursor-pointer text-white p-1 xs:p-2 rounded-lg transition-colors flex-shrink-0">
          <ShoppingBag size={22} className="xs:w-4 xs:h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
