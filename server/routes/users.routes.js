const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.middleware");
const { validateRequest } = require("../middleware/validation.middleware");
const { loginSchema, registerSchema } = require("../schemas/auth.schemas");

router.post(
  "/register",
  validateRequest(registerSchema),
  userController.register,
);
router.post("/login", validateRequest(loginSchema), userController.signinUser);
router.get("/cart", protect, userController.getCart);
router.post("/cart", protect, userController.addToCart);
router.put("/cart/:productId", protect, userController.updateCartItem);
router.delete("/cart/:productId", protect, userController.removeFromCart);
router.delete("/cart", protect, userController.clearCart);

module.exports = router;
