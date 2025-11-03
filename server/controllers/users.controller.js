const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generate.JWT");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "User not found", 400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid credentials", 400);
    }
    const token = await generateJWT({
      email: user.email,
      id: user._id,
    });
    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      "Login successful",
      200,
    );
  } catch (error) {
    console.error("Signin error:", error);
    return errorResponse(res, "Server error during login", 500);
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return errorResponse(res, "Name, email and password are required", 400);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "User already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const token = await generateJWT({ id: newUser._id });
    newUser.token = token;
    await newUser.save();
    return successResponse(
      res,
      {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      "User created successfully",
      201,
    );
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse(res, "Server error during registration", 500);
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cart.productId",
      populate: {
        path: "category",
        select: "name slug",
      },
      select: "name price image isOnSale salePrice category countInStock",
    });
    return successResponse(
      res,
      { cart: user.cart },
      "Cart retrieved successfully",
    );
  } catch (error) {
    console.error("Get cart error:", error);
    return errorResponse(res, "Server error while fetching cart", 500);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return errorResponse(res, "Product ID is required", 400);
    }
    const user = await User.findById(req.user._id);
    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += parseInt(quantity);
    } else {
      user.cart.push({
        productId,
        quantity: parseInt(quantity),
      });
    }
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate(
      "cart.productId",
    );
    return successResponse(
      res,
      { cart: updatedUser.cart },
      "Item added to cart successfully",
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    return errorResponse(res, "Server error while adding to cart", 500);
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) {
      return errorResponse(res, "Quantity must be at least 1", 400);
    }
    const user = await User.findById(req.user._id);
    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId,
    );
    if (!cartItem) {
      return errorResponse(res, "Item not found in cart", 404);
    }
    cartItem.quantity = parseInt(quantity);
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate(
      "cart.productId",
    );
    return successResponse(
      res,
      { cart: updatedUser.cart },
      "Cart item updated successfully",
    );
  } catch (error) {
    console.error("Update cart error:", error);
    return errorResponse(res, "Server error while updating cart", 500);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId,
    );
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate(
      "cart.productId",
    );
    return successResponse(
      res,
      { cart: updatedUser.cart },
      "Item removed from cart successfully",
    );
  } catch (error) {
    console.error("Remove from cart error:", error);
    return errorResponse(res, "Server error while removing from cart", 500);
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    return successResponse(res, { cart: [] }, "Cart cleared successfully");
  } catch (error) {
    console.error("Clear cart error:", error);
    return errorResponse(res, "Server error while clearing cart", 500);
  }
};
