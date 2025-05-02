const Product = require("../model/Product");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Configure storage for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/uploads/products");
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "product-" + uniqueSuffix + ext);
  },
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Create and Save a new Product
exports.create = (req, res) => {
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
      mainImage: req.files.mainImage[0].path.replace(/\\/g, "/"),
    };

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
    if (req.files.additionalImages) {
      req.files.additionalImages.forEach((file) => {
        additionalImages.push(file.path.replace(/\\/g, "/"));
      });
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

// Update a Product identified by the productId in the request
exports.update = (req, res) => {
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
      attributes: req.body.attributes ? JSON.parse(req.body.attributes) : {},
    };

    // Handle main image if a new one was uploaded
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      product.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/");
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
    if (req.files && req.files.additionalImages) {
      req.files.additionalImages.forEach((file) => {
        additionalImages.push(file.path.replace(/\\/g, "/"));
      });
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

    // Store image paths for deletion after the database record is removed
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
        // Delete image files from storage
        imagesToDelete.forEach((imagePath) => {
          const fullPath = path.join(__dirname, "..", imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlink(fullPath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(
                  `Error deleting image file: ${fullPath}`,
                  unlinkErr
                );
              }
            });
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

  Product.search(searchTerm, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while searching products.",
      });
    } else {
      res.send(data);
    }
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
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      return res.status(400).send({
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).send({
        message: `Error during file upload: ${err.message}`,
      });
    }
    // Everything went fine, proceed
    next();
  });
};
