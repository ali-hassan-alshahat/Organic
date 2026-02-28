const mongoose = require("mongoose"); // Added missing import
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/users.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// Create new order
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      billingInfo,
      paymentMethod,
      items,
      subtotal,
      totalAmount,
      orderNotes,
    } = req.body;

    // Validate required fields
    if (!billingInfo || !paymentMethod || !items || items.length === 0) {
      await session.abortTransaction();
      return errorResponse(res, "Missing required order information", 400);
    }

    // Validate billing info
    const requiredBillingFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "country",
      "state",
      "zipCode",
    ];
    const missingBillingFields = requiredBillingFields.filter(
      (field) => !billingInfo[field],
    );

    if (missingBillingFields.length > 0) {
      await session.abortTransaction();
      return errorResponse(
        res,
        `Missing billing fields: ${missingBillingFields.join(", ")}`,
        400,
      );
    }

    // Generate order number manually to ensure it exists
    const orderNumber = Order.generateOrderNumber();

    // Validate and process items
    const orderItems = [];
    for (const item of items) {
      const productId = item.productId?._id || item._id;
      const product = await Product.findById(productId).session(session);

      if (!product) {
        await session.abortTransaction();
        return errorResponse(res, `Product not found: ${productId}`, 404);
      }

      // Check stock availability
      if (product.countInStock < item.quantity) {
        await session.abortTransaction();
        return errorResponse(
          res,
          `Insufficient stock for ${product.name}. Available: ${product.countInStock}`,
          400,
        );
      }

      const itemPrice = product.salePrice || product.price;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        salePrice: product.salePrice,
        quantity: item.quantity,
        subtotal: itemPrice * item.quantity,
      });

      // Update product stock
      product.countInStock -= item.quantity;
      await product.save({ session });
    }

    // Calculate totals
    const calculatedSubtotal = orderItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );
    const calculatedTotal = calculatedSubtotal; // Add shipping/tax later if needed

    // Create order with explicit orderNumber
    const order = new Order({
      user: req.user._id,
      orderNumber: orderNumber, // Explicitly set order number
      billingInfo,
      items: orderItems,
      paymentMethod,
      subtotal: subtotal || calculatedSubtotal,
      totalAmount: totalAmount || calculatedTotal,
      orderNotes: billingInfo.orderNotes || orderNotes,
    });

    await order.save({ session });

    // Clear user's cart after successful order
    await User.findByIdAndUpdate(req.user._id, { cart: [] }, { session });

    await session.commitTransaction();

    // Populate the order with product details for response
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name image category");

    return successResponse(
      res,
      { order: populatedOrder },
      "Order created successfully",
      201,
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Create order error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, `Validation error: ${errors.join(", ")}`, 400);
    }

    return errorResponse(res, "Server error while creating order", 500);
  } finally {
    session.endSession();
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image category")
      .sort({ createdAt: -1 });

    return successResponse(res, { orders }, "Orders retrieved successfully");
  } catch (error) {
    console.error("Get orders error:", error);
    return errorResponse(res, "Server error while fetching orders", 500);
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name image category");

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return errorResponse(res, "Access denied", 403);
    }

    return successResponse(res, { order }, "Order retrieved successfully");
  } catch (error) {
    console.error("Get order error:", error);
    return errorResponse(res, "Server error while fetching order", 500);
  }
};

// Update order status (for admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, shippingTracking } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (shippingTracking) updates.shippingTracking = shippingTracking;

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("items.product", "name image category");

    return successResponse(
      res,
      { order: updatedOrder },
      "Order updated successfully",
    );
  } catch (error) {
    console.error("Update order error:", error);
    return errorResponse(res, "Server error while updating order", 500);
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { orderStatus: status } : {};

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    return successResponse(
      res,
      {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      },
      "Orders retrieved successfully",
    );
  } catch (error) {
    console.error("Get all orders error:", error);
    return errorResponse(res, "Server error while fetching orders", 500);
  }
};
