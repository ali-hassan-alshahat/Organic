import React from "react";
import { ShoppingBag, Leaf } from "lucide-react";

const ProductSidebar = () => {
  return (
    <div className="space-y-8 mt-8">
      <div>
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/a_0AgvcCQ20?autoplay=0&controls=1&modestbranding=1&rel=0"
            title="Fresh Organic Fruits"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-3 border rounded-lg p-4 bg-green-50">
          <div className="text-[var(--main-primary)]">
            <ShoppingBag size={36} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              64% Discount
            </h3>
            <p className="text-sm text-gray-600">Save your 64% money with us</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border rounded-lg p-4 bg-green-50">
          <div className="text-[var(--main-primary)]">
            <Leaf size={36} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              100% Organic Food
            </h3>
            <p className="text-sm text-gray-600">100% healthy & fresh food</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSidebar;
