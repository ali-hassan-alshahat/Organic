const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");

// Public
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Admin (unprotected for now so we need to add auth middleware later)
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
