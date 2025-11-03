const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/wishlist", protect, wishlistController.addToWishlist);
router.get("/wishlist", protect, wishlistController.getWishlist);
router.delete(
  "/wishlist/:productId",
  protect,
  wishlistController.removeFromWishlist,
);
router.delete("/wishlist", protect, wishlistController.clearWishlist);
router.post("/wishlist/move-to-cart", protect, wishlistController.moveToCart);

module.exports = router;
