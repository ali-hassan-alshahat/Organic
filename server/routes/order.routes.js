const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");

// Protected routes (logged in users)
router.post("/", protect, orderController.createOrder);
router.get("/my-orders", protect, orderController.getUserOrders);
router.get("/:id", protect, orderController.getOrderById);

// Admin only routes
router.get("/", protect, orderController.getAllOrders);
router.put("/:id/status", protect, orderController.updateOrderStatus);

module.exports = router;
