const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Create category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      res.status(400);
      throw new Error("name and slug are required");
    }

    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      res.status(400);
      throw new Error("Category with same name or slug already exists");
    }

    const category = new Category({ name, slug });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Get counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
        });
        return {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          productCount,
        };
      }),
    );

    // Filter out categories with 0 products
    const filteredCategories = categoriesWithCounts.filter(
      (cat) => cat.productCount > 0,
    );

    res.json(filteredCategories);
  } catch (err) {
    next(err);
  }
};

// Get single category
exports.getCategoryById = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.json(cat);
  } catch (err) {
    next(err);
  }
};

// Update category
exports.updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      res.status(404);
      throw new Error("Category not found");
    }
    const { name, slug } = req.body;
    if (name) cat.name = name;
    if (slug) cat.slug = slug;
    const updated = await cat.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete category
exports.deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      res.status(404);
      throw new Error("Category not found");
    }
    await cat.remove();
    res.json({ message: "Category removed" });
  } catch (err) {
    next(err);
  }
};
