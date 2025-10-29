const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, wishlistController.addToWishlist);
router.get("/", protect, wishlistController.getWishlist);
router.delete("/:productId", protect, wishlistController.removeFromWishlist);
router.delete("/", protect, wishlistController.clearWishlist);
router.post("/move-to-cart", protect, wishlistController.moveToCart);

module.exports = router;
