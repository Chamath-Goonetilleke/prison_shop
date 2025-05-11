const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

// Upload middleware - must be applied to routes that handle file uploads
const upload = productController.uploadProductImages;

// Create a new Product
router.post("/", upload, productController.create);

// Retrieve all Products
router.get("/", productController.findAll);

// Retrieve a single Product with productId
router.get("/:productId", productController.findOne);

// Retrieve Products by category
router.get("/category/:categoryId", productController.findByCategory);

// Retrieve Products by subcategory
router.get("/subcategory/:subCategoryId", productController.findBySubCategory);

// Retrieve Products by prison
router.get("/prison/:prisonId", productController.findByPrison);

// Search products
router.get("/search", productController.search);

// Check stock availability
router.post("/check-stock", productController.checkStockAvailability);

// Update a Product with productId
router.put("/:productId", upload, productController.update);

// Delete a Product with productId
router.delete("/:productId", productController.delete);

module.exports = router;
