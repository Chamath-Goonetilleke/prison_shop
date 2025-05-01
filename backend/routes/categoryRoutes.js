const express = require("express");
const router = express.Router();
const categories = require("../controller/categoryController.js");

// Create a new Category with image upload
router.post("/", categories.uploadCategoryImage, categories.create);

// Retrieve all Categories
router.get("/", categories.findAll);

// Retrieve a single Category with categoryId
router.get("/:categoryId", categories.findOne);

// Update a Category with categoryId
router.put("/:categoryId", categories.uploadCategoryImage, categories.update);

// Delete a Category with categoryId
router.delete("/:categoryId", categories.delete);

// Add a new attribute to a category
router.post("/:categoryId/attributes", categories.addAttribute);

// Get all attributes for a category
router.get("/:categoryId/attributes", categories.getCategoryAttributes);

// Update an attribute
router.put("/attributes/:attributeId", categories.updateAttribute);

// Delete an attribute
router.delete("/attributes/:attributeId", categories.deleteAttribute);

module.exports = router;
