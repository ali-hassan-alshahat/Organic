import React from "react";
import ProductSection from "@/components/common/ProductSection";
import QuickViewModal from "@/components/common/QuickViewModal";

const RelatedProducts = ({
  relatedProducts,
  loading,
  quickView,
  onQuickView,
  onCloseQuickView,
}) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;
  return (
    <div className="mt-16">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
        Related Products
      </h2>
      <ProductSection
        data={relatedProducts}
        loading={loading}
        onQuickView={onQuickView}
      />
      <QuickViewModal quickView={quickView} onClose={onCloseQuickView} />
    </div>
  );
};

export default RelatedProducts;
