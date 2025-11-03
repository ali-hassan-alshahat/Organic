import React from "react";
import { renderStars } from "@/utils/renderStars";

const ProductReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border-b border-gray-100 pb-6 last:border-b-0"
        >
          <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-lg">
              {review.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {review.name}
                </h4>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-2 text-base">
                {review.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
