import React from "react";

const ProductImageGallery = ({ product, selectedImage, setSelectedImage }) => {
  return (
    <div className="flex flex-col md:flex-row lg:flex-row gap-6">
      <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 justify-center md:justify-start">
        {[product.image, product.image, product.image, product.image].map(
          (img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-20 h-20 rounded-lg border-2 p-1 cursor-pointer transition-all ${
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
      <div className="flex-1 order-1 lg:order-2">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 sm:h-80 md:h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
