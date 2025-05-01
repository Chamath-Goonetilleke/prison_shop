const SubCategory = require("../model/SubCategory");

// Create and Save a new SubCategory
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nameEn || !req.body.category_id) {
    return res.status(400).send({
      message: "SubCategory name and category ID are required!",
    });
  }

  try {
    // Prepare subcategory object
    const subCategory = {
      category_id: req.body.category_id,
      nameEn: req.body.nameEn,
      nameSi: req.body.nameSi,
      description: req.body.description,
    };

    // Save SubCategory in the database
    SubCategory.create(subCategory, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating the SubCategory.",
        });
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    console.error("Error processing subcategory data:", error);
    res.status(500).send({
      message: "Error processing subcategory data: " + error.message,
    });
  }
};

// Retrieve all SubCategories from the database
exports.findAll = (req, res) => {
  SubCategory.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving subcategories.",
      });
    } else {
      res.send(data);
    }
  });
};

// Retrieve SubCategories by category ID
exports.findByCategory = (req, res) => {
  SubCategory.getByCategoryId(req.params.categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving subcategories.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single SubCategory with a subCategoryId
exports.findOne = (req, res) => {
  SubCategory.findById(req.params.subCategoryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `SubCategory with id ${req.params.subCategoryId} not found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving SubCategory with id " + req.params.subCategoryId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Update a SubCategory identified by the subCategoryId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.nameEn || !req.body.category_id) {
    return res.status(400).send({
      message: "SubCategory name and category ID are required!",
    });
  }

  try {
    // Prepare subcategory object
    const subCategory = {
      category_id: req.body.category_id,
      nameEn: req.body.nameEn,
      nameSi: req.body.nameSi,
      description: req.body.description,
    };

    // Update the SubCategory
    SubCategory.update(req.params.subCategoryId, subCategory, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `SubCategory with id ${req.params.subCategoryId} not found.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error updating SubCategory with id " + req.params.subCategoryId,
          });
        }
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "Error processing subcategory data: " + error.message,
    });
  }
};

// Delete a SubCategory with the specified subCategoryId in the request
exports.delete = (req, res) => {
  SubCategory.delete(req.params.subCategoryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `SubCategory with id ${req.params.subCategoryId} not found.`,
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete SubCategory with id " + req.params.subCategoryId,
        });
      }
    } else {
      res.send({ message: "SubCategory was deleted successfully!" });
    }
  });
};
