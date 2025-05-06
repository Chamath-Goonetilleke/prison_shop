const Category = require("../model/Category");
const fs = require("fs");
const path = require("path");
const {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} = require("../util/imageUpload");

// Create and Save a new Category
exports.create = async (req, res) => {
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

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, {
          folder: "categories",
        });
        category.image = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).send({
          message: "Error uploading image: " + uploadError.message,
        });
      }
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
exports.update = async (req, res) => {
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

    // Upload new image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, {
          folder: "categories",
        });
        category.image = result.secure_url;

        // Delete old image from Cloudinary if exists
        if (req.body.existingImage) {
          const publicId = getPublicIdFromUrl(req.body.existingImage);
          if (publicId) {
            await deleteFromCloudinary(publicId).catch((err) =>
              console.error("Error deleting old image from Cloudinary:", err)
            );
          }
        }
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).send({
          message: "Error uploading image: " + uploadError.message,
        });
      }
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

    // Store image URL for deletion after the database record is removed
    const imageUrl = category.image;

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
        // Delete image from Cloudinary if it exists
        if (imageUrl) {
          const publicId = getPublicIdFromUrl(imageUrl);
          if (publicId) {
            deleteFromCloudinary(publicId).catch((err) =>
              console.error("Error deleting image from Cloudinary:", err)
            );
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
            "Could not delete attribute with id " + req.params.attributeId,
        });
      }
    } else {
      res.send({ message: "Attribute deleted successfully!" });
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

// Middleware for handling file uploads with Cloudinary
exports.uploadCategoryImage = upload.single("image");

// Get categories that have at least one product
exports.getCategoriesWithProducts = (req, res) => {
  Category.getCategoriesWithProducts((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "An error occurred while retrieving categories with products.",
      });
    } else {
      res.send(data);
    }
  });
};
