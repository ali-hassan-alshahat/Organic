const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        // Generate order number as default value
        const date = new Date();
        const timestamp = date.getTime();
        const random = Math.floor(Math.random() * 1000);
        return `ECO-${timestamp}-${random}`;
      },
    },
    billingInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      company: { type: String, default: "" },
      address: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      orderNotes: { type: String, default: "" },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "paypal", "card"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    shippingTracking: {
      carrier: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

// Alternative pre-save middleware (more reliable)
orderSchema.pre("save", async function (next) {
  // Only generate order number if it's a new document and orderNumber doesn't exist
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000);
    this.orderNumber = `ECO-${timestamp}-${random}`;
  }

  // Calculate item subtotals
  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      const price = item.salePrice || item.price;
      item.subtotal = price * item.quantity;
    });

    // Calculate order totals
    this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.totalAmount =
      this.subtotal + (this.shippingFee || 0) + (this.taxAmount || 0);
  }

  next();
});

// Static method to generate order number
orderSchema.statics.generateOrderNumber = function () {
  const date = new Date();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 1000);
  return `ECO-${timestamp}-${random}`;
};

module.exports = mongoose.model("Order", orderSchema); // Fixed: changed orderModel to orderSchema
