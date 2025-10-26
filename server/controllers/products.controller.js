const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// Helper function to resolve category by id, slug or name
async function resolveCategoryId(value) {
  if (!value) return null;

  if (mongoose.Types.ObjectId.isValid(value)) {
    const cat = await Category.findById(value);
    if (cat) return cat._id;
  }

  let cat = await Category.findOne({ slug: value.toString().toLowerCase() });
  if (cat) return cat._id;

  cat = await Category.findOne({ name: value });
  if (cat) return cat._id;

  return null;
}

// Create product (admin)
exports.createProduct = async (req, res) => {
  try {
    const body = req.body;
    const categoryId = await resolveCategoryId(body.category);
    if (!categoryId)
      return errorResponse(res, "Valid category is required", 400);
    const productObj = {
      name: body.name,
      description: body.description || "",
      price: body.price,
      salePrice: body.salePrice || undefined,
      isOnSale: !!body.isOnSale,
      category: categoryId,
      image: body.image || "",
      isFeatured: !!body.isFeatured,
      isPopular: !!body.isPopular,
      isHotDeal: !!body.isHotDeal,
      countInStock:
        typeof body.countInStock === "number" ? body.countInStock : 0,
      reviews: Array.isArray(body.reviews) ? body.reviews : [],
    };

    const created = await Product.create(productObj);
    return successResponse(res, { product: created }, "Product created", 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Get all products (with filters & pagination)
exports.getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      const categoryId = await resolveCategoryId(req.query.category);
      if (categoryId) filter.category = categoryId;
    }
    if (req.query.isHotDeal) filter.isHotDeal = req.query.isHotDeal === "true";
    if (req.query.isFeatured)
      filter.isFeatured = req.query.isFeatured === "true";
    if (req.query.isPopular) filter.isPopular = req.query.isPopular === "true";
    if (req.query.search) {
      const keyword = req.query.search.trim();
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
    if (!products.length) return errorResponse(res, "No products found", 404);
    return successResponse(
      res,
      { products },
      "All products fetched successfully",
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).populate(
      "category",
      "name slug",
    );
    if (!prod) return errorResponse(res, "Product not found", 404);
    const related = await Product.find({
      category: prod.category._id,
      _id: { $ne: prod._id },
    })
      .limit(6)
      .populate("category", "name slug");
    return successResponse(
      res,
      { product: prod, relatedProducts: related },
      "Product fetched successfully",
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return errorResponse(res, "Product not found", 404);
    const body = req.body;
    if (body.category) {
      const categoryId = await resolveCategoryId(body.category);
      if (!categoryId)
        return errorResponse(res, "Valid category required", 400);
      prod.category = categoryId;
    }
    const updatable = [
      "name",
      "description",
      "price",
      "salePrice",
      "isOnSale",
      "image",
      "isFeatured",
      "isPopular",
      "isHotDeal",
      "countInStock",
    ];
    updatable.forEach((field) => {
      if (body[field] !== undefined) prod[field] = body[field];
    });
    if (Array.isArray(body.reviews)) prod.reviews = body.reviews;
    const updated = await prod.save();
    return successResponse(res, { product: updated }, "Product updated");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return errorResponse(res, "Product not found", 404);
    await Product.deleteOne({ _id: prod._id });
    return successResponse(res, {}, "Product deleted");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
