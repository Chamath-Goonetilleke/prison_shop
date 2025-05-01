const express = require("express");
const router = express.Router();
const subCategories = require("../controller/subCategoryController.js");

// Create a new SubCategory
router.post("/", subCategories.create);

// Retrieve all SubCategories
router.get("/", subCategories.findAll);

// Retrieve all SubCategories for a specific category
router.get("/category/:categoryId", subCategories.findByCategory);

// Retrieve a single SubCategory with subCategoryId
router.get("/:subCategoryId", subCategories.findOne);

// Update a SubCategory with subCategoryId
router.put("/:subCategoryId", subCategories.update);

// Delete a SubCategory with subCategoryId
router.delete("/:subCategoryId", subCategories.delete);

module.exports = router;
