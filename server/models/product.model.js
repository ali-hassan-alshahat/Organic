const mongoose = require("mongoose");

// review sub-schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    isOnSale: { type: Boolean, default: false },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: { type: String, required: true },
    countInStock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isHotDeal: { type: Boolean, default: false },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// hook to recalculate rating & numReviews
productSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    this.numReviews = this.reviews.length;
    this.rating =
      this.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
      this.reviews.length;
  } else {
    this.numReviews = 0;
    this.rating = 0;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
