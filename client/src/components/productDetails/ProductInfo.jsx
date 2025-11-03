import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { renderStars } from "@/utils/renderStars";

const ProductInfo = ({ product }) => {
  const socialIcons = [
    { icon: Facebook, platform: "facebook", color: "hover:text-blue-600" },
    { icon: Instagram, platform: "instagram", color: "hover:text-pink-600" },
    { icon: Twitter, platform: "twitter", color: "hover:text-blue-400" },
    { icon: Linkedin, platform: "linkedin", color: "hover:text-blue-700" },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 leading-tight break-words">
            {product.name}
          </h1>
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 w-full">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-600 text-sm sm:text-base">
              {product.rating?.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded text-sm font-medium w-fit ${
            product.countInStock > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.countInStock > 0
            ? `${product.countInStock} In Stock`
            : "Out of Stock"}
        </span>
      </div>
      <div className="flex items-center gap-3 py-3 sm:py-4 border-y border-gray-100">
        <span className="text-gray-600 font-medium text-sm sm:text-base">
          Share:
        </span>
        <div className="flex gap-2">
          {socialIcons.map(({ icon: Icon, platform, color }) => (
            <button
              key={platform}
              className={`p-2 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${color}`}
            >
              <Icon size={18} className="sm:w-5 sm:h-5" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
          {product.description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {product.isOnSale && product.salePrice ? (
          <>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
              ${product.salePrice.toFixed(2)}
            </span>
            <span className="text-xl sm:text-2xl line-through text-gray-400">
              ${product.price.toFixed(2)}
            </span>
            <span className="bg-red-100 text-red-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
              Save ${(product.price - product.salePrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-gray-600 text-sm sm:text-base">
        <span>Category:</span>
        <span className="font-semibold text-gray-900">
          {product.category?.name}
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
