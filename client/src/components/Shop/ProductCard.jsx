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
        <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-4 py-2 rounded-br-lg z-20">
          Sale {discount > 0 ? `${discount}%` : ""}
        </span>
      )}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <button className="bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-[var(--main-primary)] transition-colors cursor-pointer">
          <Heart size={18} className="text-gray-600" />
        </button>
        <button
          onClick={() => onQuickView(product)}
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
};

export default ProductCard;
