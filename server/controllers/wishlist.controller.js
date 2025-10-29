const User = require("../models/users.model");
const Product = require("../models/product.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return errorResponse(res, "Product ID is required", 400);
    }
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    const user = await User.findById(req.user._id);
    const alreadyInWishlist = user.wishlist.some(
      (item) => item.productId.toString() === productId,
    );
    if (alreadyInWishlist) {
      return errorResponse(res, "Product already in wishlist", 400);
    }
    user.wishlist.push({ productId });
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist.productId",
      "name price image isOnSale salePrice",
    );
    return successResponse(
      res,
      { wishlist: updatedUser.wishlist },
      "Product added to wishlist successfully",
    );
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return errorResponse(res, "Server error while adding to wishlist", 500);
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate(
        "wishlist.productId",
        "name price image isOnSale salePrice category",
      )
      .populate("wishlist.productId.category", "name slug");
    return successResponse(
      res,
      { wishlist: user.wishlist },
      "Wishlist retrieved successfully",
    );
  } catch (error) {
    console.error("Get wishlist error:", error);
    return errorResponse(res, "Server error while fetching wishlist", 500);
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    const itemExists = user.wishlist.some(
      (item) => item.productId.toString() === productId,
    );
    if (!itemExists) {
      return errorResponse(res, "Product not found in wishlist", 404);
    }
    user.wishlist = user.wishlist.filter(
      (item) => item.productId.toString() !== productId,
    );
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist.productId",
      "name price image isOnSale salePrice",
    );
    return successResponse(
      res,
      { wishlist: updatedUser.wishlist },
      "Product removed from wishlist successfully",
    );
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return errorResponse(res, "Server error while removing from wishlist", 500);
  }
};

// Clear entire wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();
    return successResponse(
      res,
      { wishlist: [] },
      "Wishlist cleared successfully",
    );
  } catch (error) {
    console.error("Clear wishlist error:", error);
    return errorResponse(res, "Server error while clearing wishlist", 500);
  }
};

// Move wishlist item to cart
exports.moveToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return errorResponse(res, "Product ID is required", 400);
    }
    const user = await User.findById(req.user._id);
    const wishlistItem = user.wishlist.find(
      (item) => item.productId.toString() === productId,
    );
    if (!wishlistItem) {
      return errorResponse(res, "Product not found in wishlist", 404);
    }
    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId,
    );

    if (cartItem) {
      // If already in cart, just remove from wishlist
      user.wishlist = user.wishlist.filter(
        (item) => item.productId.toString() !== productId,
      );
      await user.save();
      return successResponse(
        res,
        { message: "Product already in cart, removed from wishlist" },
        "Product moved successfully",
      );
    }
    // Add to cart and remove from wishlist
    user.cart.push({
      productId,
      quantity: 1,
    });
    user.wishlist = user.wishlist.filter(
      (item) => item.productId.toString() !== productId,
    );
    await user.save();
    const updatedUser = await User.findById(req.user._id)
      .populate("cart.productId", "name price image")
      .populate("wishlist.productId", "name price image");
    return successResponse(
      res,
      {
        cart: updatedUser.cart,
        wishlist: updatedUser.wishlist,
      },
      "Product moved to cart successfully",
    );
  } catch (error) {
    console.error("Move to cart error:", error);
    return errorResponse(res, "Server error while moving to cart", 500);
  }
};
