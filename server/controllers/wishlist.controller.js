const User = require("../models/users.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return errorResponse(res, "Product ID is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, "Invalid product ID", 400);
    }
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    const user = await User.findById(req.user._id);
    const alreadyInWishlist = user.wishlist.some(
      (item) => item.productId && item.productId.toString() === productId,
    );
    if (alreadyInWishlist) {
      return errorResponse(res, "Product already in wishlist", 400);
    }
    user.wishlist.push({ productId });
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist.productId",
      "name price image isOnSale salePrice category countInStock",
    );
    return successResponse(
      res,
      {
        wishlist: updatedUser.wishlist.filter(
          (item) => item.productId !== null,
        ),
      },
      "Product added to wishlist successfully",
    );
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return errorResponse(res, "Server error while adding to wishlist", 500);
  }
};
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "wishlist.productId",
        populate: {
          path: "category",
          select: "name slug",
        },
        select: "name price image isOnSale salePrice category countInStock",
      })
      .populate("wishlist.productId.category", "name slug");
    const validWishlist = user.wishlist.filter(
      (item) => item.productId !== null,
    );
    if (validWishlist.length !== user.wishlist.length) {
      user.wishlist = validWishlist;
      await user.save();
    }
    return successResponse(
      res,
      { wishlist: validWishlist },
      "Wishlist retrieved successfully",
    );
  } catch (error) {
    console.error("Get wishlist error:", error);
    return errorResponse(res, "Server error while fetching wishlist", 500);
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const itemExists = user.wishlist.some(
      (item) => item.productId && item.productId.toString() === productId,
    );
    if (!itemExists) {
      return errorResponse(res, "Product not found in wishlist", 404);
    }
    user.wishlist = user.wishlist.filter(
      (item) => !item.productId || item.productId.toString() !== productId,
    );
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist.productId",
      "name price image isOnSale salePrice category countInStock",
    );
    return successResponse(
      res,
      {
        wishlist: updatedUser.wishlist.filter(
          (item) => item.productId !== null,
        ),
      },
      "Product removed from wishlist successfully",
    );
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return errorResponse(res, "Server error while removing from wishlist", 500);
  }
};
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

exports.cleanWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "wishlist.productId",
    );

    // Filter out items with null productId
    const originalLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter((item) => item.productId !== null);

    if (user.wishlist.length !== originalLength) {
      await user.save();
      return successResponse(
        res,
        {
          wishlist: user.wishlist,
          removed: originalLength - user.wishlist.length,
        },
        "Wishlist cleaned successfully",
      );
    }

    return successResponse(
      res,
      { wishlist: user.wishlist },
      "No orphaned items found",
    );
  } catch (error) {
    console.error("Clean wishlist error:", error);
    return errorResponse(res, "Server error while cleaning wishlist", 500);
  }
};

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
