const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.post("/", categoryController.createCategory); // create
router.get("/", categoryController.getCategories); // list
router.get("/:id", categoryController.getCategoryById); // single
router.put("/:id", categoryController.updateCategory); // update
router.delete("/:id", categoryController.deleteCategory); // delete

module.exports = router;
