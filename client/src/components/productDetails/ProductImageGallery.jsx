import React from "react";

const ProductImageGallery = ({ product, selectedImage, setSelectedImage }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 lg:gap-6 w-full">
      <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1 justify-center md:justify-start overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {[product.image, product.image, product.image, product.image].map(
          (img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 p-1 cursor-pointer transition-all ${
                selectedImage === index
                  ? "border-[var(--main-primary)] shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ),
        )}
      </div>
      <div className="flex-1 order-1 md:order-2 w-full">
        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border border-gray-100 w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
