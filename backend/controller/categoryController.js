const Category = require("../model/Category");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Configure storage for category images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/categories");
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
    cb(null, "category-" + uniqueSuffix + ext);
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

// Create and Save a new Category
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nameEn || !req.body.code) {
    return res.status(400).send({
      message: "Category name and code are required!",
    });
  }

  try {
    // Prepare category object
    const category = {
      code: req.body.code,
      nameEn: req.body.nameEn,
      nameSi: req.body.nameSi,
      description: req.body.description,
    };

    // Add image if uploaded
    if (req.file) {
      category.image = req.file.path.replace(/\\/g, "/");
    }

    // Save Category in the database
    Category.create(category, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating the Category.",
        });
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    console.error("Error processing category data:", error);
    res.status(500).send({
      message: "Error processing category data: " + error.message,
    });
  }
};

// Retrieve all Categories from the database
exports.findAll = (req, res) => {
  Category.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving categories.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single Category with a categoryId
exports.findOne = (req, res) => {
  Category.findById(req.params.categoryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Category with id ${req.params.categoryId} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Category with id " + req.params.categoryId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Update a Category identified by the categoryId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.nameEn || !req.body.code) {
    return res.status(400).send({
      message: "Category name and code are required!",
    });
  }

  try {
    // Prepare category object
    const category = {
      code: req.body.code,
      nameEn: req.body.nameEn,
      nameSi: req.body.nameSi,
      description: req.body.description,
      image: req.body.existingImage, // Default to existing image
    };

    // Update image if a new one was uploaded
    if (req.file) {
      category.image = req.file.path.replace(/\\/g, "/");
    }

    // Update the Category
    Category.update(req.params.categoryId, category, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Category with id ${req.params.categoryId} not found.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Category with id " + req.params.categoryId,
          });
        }
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "Error processing category data: " + error.message,
    });
  }
};

// Delete a Category with the specified categoryId in the request
exports.delete = (req, res) => {
  Category.findById(req.params.categoryId, (err, category) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Category with id ${req.params.categoryId} not found.`,
        });
        return;
      }
      res.status(500).send({
        message: "Error retrieving Category with id " + req.params.categoryId,
      });
      return;
    }

    // Store image path for deletion after the database record is removed
    const imagePath = category.image;

    // Delete the category from the database
    Category.delete(req.params.categoryId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Category with id ${req.params.categoryId} not found.`,
          });
        } else {
          res.status(500).send({
            message:
              "Could not delete Category with id " + req.params.categoryId,
          });
        }
      } else {
        // Delete image file from storage if it exists
        if (imagePath) {
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
        }

        res.send({ message: "Category was deleted successfully!" });
      }
    });
  });
};

// Add Attribute to a Category
exports.addAttribute = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.type) {
    return res.status(400).send({
      message: "Attribute name and type are required!",
    });
  }

  try {
    // Prepare attribute object
    const attribute = {
      name: req.body.name,
      type: req.body.type,
      options: req.body.options, // This can be null or an array
    };

    // Add attribute to the category
    Category.addAttribute(req.params.categoryId, attribute, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "An error occurred while adding the attribute.",
        });
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    console.error("Error processing attribute data:", error);
    res.status(500).send({
      message: "Error processing attribute data: " + error.message,
    });
  }
};

// Update a Category Attribute
exports.updateAttribute = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.type) {
    return res.status(400).send({
      message: "Attribute name and type are required!",
    });
  }

  try {
    // Prepare attribute object
    const attribute = {
      name: req.body.name,
      type: req.body.type,
      options: req.body.options, // This can be null or an array
    };

    // Update the attribute
    Category.updateAttribute(req.params.attributeId, attribute, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Attribute with id ${req.params.attributeId} not found.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error updating Attribute with id " + req.params.attributeId,
          });
        }
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "Error processing attribute data: " + error.message,
    });
  }
};

// Delete a Category Attribute
exports.deleteAttribute = (req, res) => {
  Category.deleteAttribute(req.params.attributeId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Attribute with id ${req.params.attributeId} not found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete Attribute with id " + req.params.attributeId,
        });
      }
    } else {
      res.send({ message: "Attribute was deleted successfully!" });
    }
  });
};

// Get all Attributes for a Category
exports.getCategoryAttributes = (req, res) => {
  Category.getAttributes(req.params.categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving attributes.",
      });
    } else {
      res.send(data);
    }
  });
};

// Middleware for handling file uploads
exports.uploadCategoryImage = upload.single("image");
