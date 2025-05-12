const Product = require("../model/Product");
const fs = require("fs");
const path = require("path");
const db = require("../config/database");
const {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} = require("../util/imageUpload");

// Create and Save a new Product
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.nameEn || !req.body.price || !req.body.category_id) {
    return res.status(400).send({
      message: "Product name, price, and category are required!",
    });
  }

  // Check if a main image was uploaded
  if (!req.files || !req.files.mainImage) {
    return res.status(400).send({
      message: "Main product image is required!",
    });
  }

  try {
    // Prepare product object
    const product = {
      productCode: "", // Will be auto-generated
      nameEn: req.body.nameEn,
      nameSi: req.body.nameSi,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: req.body.stock ? parseInt(req.body.stock) : 0,
      status: req.body.status || "In Stock",
      active: req.body.active || "Yes",
      category_id: req.body.category_id,
      subCategory_id: req.body.subCategory_id || null,
      prison_id: req.body.prison_id || null,
    };

    // Upload main image to Cloudinary
    try {
      const mainImageResult = await uploadToCloudinary(
        req.files.mainImage[0].buffer,
        { folder: "products" }
      );
      product.mainImage = mainImageResult.secure_url;
    } catch (uploadError) {
      console.error("Error uploading main image to Cloudinary:", uploadError);
      return res.status(500).send({
        message: "Error uploading main image: " + uploadError.message,
      });
    }

    // Parse attributes if provided
    if (req.body.attributes) {
      try {
        product.attributes = JSON.parse(req.body.attributes);
      } catch (parseError) {
        console.error("Error parsing attributes JSON:", parseError);
        product.attributes = {};
      }
    } else {
      product.attributes = {};
    }

    // Handle additional images
    const additionalImages = [];
    if (req.files.additionalImages && req.files.additionalImages.length > 0) {
      // Upload each additional image to Cloudinary
      for (const file of req.files.additionalImages) {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            folder: "products/additional",
          });
          additionalImages.push(result.secure_url);
        } catch (uploadError) {
          console.error(
            "Error uploading additional image to Cloudinary:",
            uploadError
          );
          // Continue with the next image even if one fails
        }
      }
    }
    product.additionalImages = additionalImages;

    // Log the product data for debugging
    console.log("Product data being sent to model:", {
      ...product,
      attributes: JSON.stringify(product.attributes),
      additionalImages: product.additionalImages.length,
    });

    // Save Product in the database
    Product.create(product, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating the Product.",
        });
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    console.error("Error processing product data:", error);
    res.status(500).send({
      message: "Error processing product data: " + error.message,
    });
  }
};

// Retrieve all Products from the database
exports.findAll = (req, res) => {
  Product.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving products.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single Product with a productId
exports.findOne = (req, res) => {
  Product.findById(req.params.productId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Product with id ${req.params.productId} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Product with id " + req.params.productId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Find Products by category
exports.findByCategory = (req, res) => {
  Product.findByCategory(req.params.categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving products.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find Products by subcategory
exports.findBySubCategory = (req, res) => {
  Product.findBySubCategory(req.params.subCategoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving products.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find Products by prison
exports.findByPrison = (req, res) => {
  Product.findByPrison(req.params.prisonId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving products.",
      });
    } else {
      res.send(data);
    }
  });
};

// Update a Product identified by the productId in the request
exports.update = async (req, res) => {
  // Validate Request
  if (!req.body.nameEn || !req.body.price || !req.body.category_id) {
    return res.status(400).send({
      message: "Product name, price, and category are required!",
    });
  }

  try {
    // Prepare product object
    const product = {
      // Do not modify product code during updates
      // productCode: req.body.productCode,
      nameEn: req.body.nameEn,
      nameSi: req.body.nameSi,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: req.body.stock ? parseInt(req.body.stock) : 0,
      status: req.body.status || "In Stock",
      active: req.body.active || "Yes",
      category_id: req.body.category_id,
      subCategory_id: req.body.subCategory_id || null,
      prison_id: req.body.prison_id || null,
      attributes: req.body.attributes ? JSON.parse(req.body.attributes) : {},
    };

    // Handle main image if a new one was uploaded
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      try {
        const result = await uploadToCloudinary(req.files.mainImage[0].buffer, {
          folder: "products",
        });
        product.mainImage = result.secure_url;

        // Delete old main image from Cloudinary if it exists
        if (req.body.existingMainImage) {
          const publicId = getPublicIdFromUrl(req.body.existingMainImage);
          if (publicId) {
            await deleteFromCloudinary(publicId).catch((err) =>
              console.error(
                "Error deleting old main image from Cloudinary:",
                err
              )
            );
          }
        }
      } catch (uploadError) {
        console.error("Error uploading main image to Cloudinary:", uploadError);
        return res.status(500).send({
          message: "Error uploading main image: " + uploadError.message,
        });
      }
    } else {
      // Keep existing main image
      product.mainImage = req.body.existingMainImage;
    }

    // Handle additional images
    const additionalImages = [];

    // Keep existing additional images that weren't removed
    if (req.body.existingAdditionalImages) {
      const existingImages = JSON.parse(req.body.existingAdditionalImages);
      additionalImages.push(...existingImages);
    }

    // Add newly uploaded additional images
    if (
      req.files &&
      req.files.additionalImages &&
      req.files.additionalImages.length > 0
    ) {
      for (const file of req.files.additionalImages) {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            folder: "products/additional",
          });
          additionalImages.push(result.secure_url);
        } catch (uploadError) {
          console.error(
            "Error uploading additional image to Cloudinary:",
            uploadError
          );
          // Continue with the next image even if one fails
        }
      }
    }

    product.additionalImages = additionalImages;

    // Update the Product
    Product.update(req.params.productId, product, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Product with id ${req.params.productId} not found.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Product with id " + req.params.productId,
          });
        }
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "Error processing product data: " + error.message,
    });
  }
};

// Delete a Product with the specified productId in the request
exports.delete = (req, res) => {
  Product.findById(req.params.productId, (err, product) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Product with id ${req.params.productId} not found.`,
        });
        return;
      }
      res.status(500).send({
        message: "Error retrieving Product with id " + req.params.productId,
      });
      return;
    }

    // Store image URLs for deletion after the database record is removed
    const imagesToDelete = [];
    if (product.mainImage) {
      imagesToDelete.push(product.mainImage);
    }
    if (product.additionalImages && product.additionalImages.length > 0) {
      imagesToDelete.push(...product.additionalImages);
    }

    // Delete the product from the database
    Product.delete(req.params.productId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Product with id ${req.params.productId} not found.`,
          });
        } else {
          res.status(500).send({
            message: "Could not delete Product with id " + req.params.productId,
          });
        }
      } else {
        // Delete image files from Cloudinary
        imagesToDelete.forEach((imageUrl) => {
          const publicId = getPublicIdFromUrl(imageUrl);
          if (publicId) {
            deleteFromCloudinary(publicId).catch((err) =>
              console.error("Error deleting image from Cloudinary:", err)
            );
          }
        });

        res.send({ message: "Product was deleted successfully!" });
      }
    });
  });
};

// Search products
exports.search = (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).send({
      message: "Search term is required",
    });
  }

  console.log(`[Search] Searching products with term: "${searchTerm}"`);

  Product.search(searchTerm, (err, data) => {
    if (err) {
      console.error(`[Search] Error searching for "${searchTerm}":`, err);
      res.status(500).send({
        message: err.message || "An error occurred while searching products.",
      });
    } else {
      console.log(
        `[Search] Found ${data.length} products matching "${searchTerm}"`
      );
      res.send(data);
    }
  });
};

// Check stock availability for multiple products
exports.checkStockAvailability = (req, res) => {
  // Validate request
  if (!req.body.items || !Array.isArray(req.body.items)) {
    return res.status(400).send({
      message: "Items array is required!",
    });
  }

  const items = req.body.items;

  // Extract product IDs and quantities
  const productChecks = items.map((item) => ({
    id: item.product_id,
    requestedQuantity: item.quantity,
  }));

  if (productChecks.length === 0) {
    return res.status(400).send({
      message: "No items to check",
    });
  }

  // Get all product IDs to check
  const productIds = productChecks.map((item) => item.id);

  // Query the database for current stock levels
  const query = `
    SELECT id, nameEn, stock, status 
    FROM products 
    WHERE id IN (${productIds.map(() => "?").join(",")})
  `;

  db.query(query, productIds, (err, results) => {
    if (err) {
      console.error("Error checking stock availability:", err);
      return res.status(500).send({
        message: "Error checking stock availability",
      });
    }

    // Check each requested item against available stock
    const stockStatus = {
      allAvailable: true,
      unavailableItems: [],
      availableItems: [],
    };

    productChecks.forEach((check) => {
      const product = results.find((p) => p.id === check.id);

      if (!product) {
        // Product not found
        stockStatus.allAvailable = false;
        stockStatus.unavailableItems.push({
          product_id: check.id,
          reason: "Product not found",
          requested: check.requestedQuantity,
          available: 0,
        });
      } else if (
        product.status === "Out of Stock" ||
        product.stock < check.requestedQuantity
      ) {
        // Not enough stock
        stockStatus.allAvailable = false;
        stockStatus.unavailableItems.push({
          product_id: check.id,
          product_name: product.nameEn,
          reason: product.stock === 0 ? "Out of stock" : "Insufficient stock",
          requested: check.requestedQuantity,
          available: product.stock,
        });
      } else {
        // Item available
        stockStatus.availableItems.push({
          product_id: check.id,
          product_name: product.nameEn,
          requested: check.requestedQuantity,
          available: product.stock,
        });
      }
    });

    // Return the stock status
    res.send(stockStatus);
  });
};

// Middleware for handling file uploads
exports.uploadProductImages = (req, res, next) => {
  const uploadFields = [
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ];

  const uploadHandler = upload.fields(uploadFields);

  uploadHandler(req, res, (err) => {
    if (err) {
      // Handle multer error or other upload error
      return res.status(400).send({
        message: `Upload error: ${err.message}`,
      });
    }
    // Everything went fine, proceed
    next();
  });
};
