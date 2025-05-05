const db = require("../config/database");

// Model for Category
class Category {
  constructor(category) {
    this.id = category.id;
    this.code = category.code;
    this.nameEn = category.nameEn;
    this.nameSi = category.nameSi;
    this.description = category.description || null;
    this.image = category.image || null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Create a new category
  static create(newCategory, result) {
    db.query("INSERT INTO categories SET ?", newCategory, (err, res) => {
      if (err) {
        console.error("Error creating category:", err);
        result(err, null);
        return;
      }

      console.log("Created category:", { id: res.insertId, ...newCategory });
      result(null, { id: res.insertId, ...newCategory });
    });
  }

  // Get all categories
  static getAll(result) {
    db.query(
      `
      SELECT c.*, 
             GROUP_CONCAT(DISTINCT ca.id) AS attribute_ids,
             GROUP_CONCAT(DISTINCT ca.name) AS attribute_names,
             GROUP_CONCAT(DISTINCT ca.type) AS attribute_types,
             GROUP_CONCAT(DISTINCT ca.options) AS attribute_options
      FROM categories c
      LEFT JOIN category_attributes ca ON c.id = ca.category_id
      GROUP BY c.id
      ORDER BY c.nameEn ASC
    `,
      (err, res) => {
        if (err) {
          console.error("Error retrieving categories:", err);
          result(err, null);
          return;
        }

        // Process each category to handle attributes
        const categoriesWithAttributes = res.map((category) => {
          const processedCategory = { ...category, attributes: [] };

          // If category has attributes, process them
          if (category.attribute_ids) {
            const ids = category.attribute_ids.split(",");
            const names = category.attribute_names.split(",");
            const types = category.attribute_types.split(",");
            const options = category.attribute_options
              ? category.attribute_options.split(",")
              : [];

            for (let i = 0; i < ids.length; i++) {
              let attributeOptions = null;

              // Try to parse JSON for options if available
              if (options[i] && options[i] !== "null") {
                try {
                  attributeOptions = JSON.parse(options[i]);
                } catch (e) {
                  attributeOptions = options[i].split("|");
                }
              }

              processedCategory.attributes.push({
                id: parseInt(ids[i]),
                name: names[i],
                type: types[i],
                options: attributeOptions,
              });
            }
          }

          // Clean up the raw concatenated fields
          delete processedCategory.attribute_ids;
          delete processedCategory.attribute_names;
          delete processedCategory.attribute_types;
          delete processedCategory.attribute_options;

          return processedCategory;
        });

        result(null, categoriesWithAttributes);
      }
    );
  }

  // Find category by ID with its attributes
  static findById(categoryId, result) {
    db.query(
      `
      SELECT c.*, 
             GROUP_CONCAT(DISTINCT ca.id) AS attribute_ids,
             GROUP_CONCAT(DISTINCT ca.name) AS attribute_names,
             GROUP_CONCAT(DISTINCT ca.type) AS attribute_types,
             GROUP_CONCAT(DISTINCT ca.options) AS attribute_options
      FROM categories c
      LEFT JOIN category_attributes ca ON c.id = ca.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `,
      categoryId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving category:", err);
          result(err, null);
          return;
        }

        if (res.length) {
          const category = res[0];
          const processedCategory = { ...category, attributes: [] };

          // If category has attributes, process them
          if (category.attribute_ids) {
            const ids = category.attribute_ids.split(",");
            const names = category.attribute_names.split(",");
            const types = category.attribute_types.split(",");
            const options = category.attribute_options
              ? category.attribute_options.split(",")
              : [];

            for (let i = 0; i < ids.length; i++) {
              let attributeOptions = null;

              // Try to parse JSON for options if available
              if (options[i] && options[i] !== "null") {
                try {
                  attributeOptions = JSON.parse(options[i]);
                } catch (e) {
                  attributeOptions = options[i].split("|");
                }
              }

              processedCategory.attributes.push({
                id: parseInt(ids[i]),
                name: names[i],
                type: types[i],
                options: attributeOptions,
              });
            }
          }

          // Clean up the raw concatenated fields
          delete processedCategory.attribute_ids;
          delete processedCategory.attribute_names;
          delete processedCategory.attribute_types;
          delete processedCategory.attribute_options;

          result(null, processedCategory);
        } else {
          result({ kind: "not_found" }, null);
        }
      }
    );
  }

  // Update category
  static update(categoryId, category, result) {
    db.query(
      "UPDATE categories SET code = ?, nameEn = ?, nameSi = ?, description = ?, image = ?, updatedAt = ? WHERE id = ?",
      [
        category.code,
        category.nameEn,
        category.nameSi,
        category.description,
        category.image,
        new Date(),
        categoryId,
      ],
      (err, res) => {
        if (err) {
          console.error("Error updating category:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Category not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Updated category:", { id: categoryId, ...category });
        result(null, { id: categoryId, ...category });
      }
    );
  }

  // Delete category
  static delete(categoryId, result) {
    // Start a transaction to ensure all related data is deleted
    db.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        result(err, null);
        return;
      }

      // First delete category attributes
      db.query(
        "DELETE FROM category_attributes WHERE category_id = ?",
        [categoryId],
        (attrErr) => {
          if (attrErr) {
            return db.rollback(() => {
              console.error("Error deleting category attributes:", attrErr);
              result(attrErr, null);
            });
          }

          // Then delete the category
          db.query(
            "DELETE FROM categories WHERE id = ?",
            categoryId,
            (catErr, res) => {
              if (catErr) {
                return db.rollback(() => {
                  console.error("Error deleting category:", catErr);
                  result(catErr, null);
                });
              }

              if (res.affectedRows == 0) {
                // Category not found
                return db.rollback(() => {
                  result({ kind: "not_found" }, null);
                });
              }

              // Commit the transaction
              db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() => {
                    console.error("Error committing transaction:", commitErr);
                    result(commitErr, null);
                  });
                }

                console.log("Deleted category with id:", categoryId);
                result(null, { id: categoryId });
              });
            }
          );
        }
      );
    });
  }

  // Add attribute to category
  static addAttribute(categoryId, attribute, result) {
    // Convert options array to JSON string if it exists
    const attributeData = { ...attribute, category_id: categoryId };
    if (attributeData.options && Array.isArray(attributeData.options)) {
      attributeData.options = JSON.stringify(attributeData.options);
    }

    db.query(
      "INSERT INTO category_attributes SET ?",
      attributeData,
      (err, res) => {
        if (err) {
          console.error("Error adding attribute to category:", err);
          result(err, null);
          return;
        }

        console.log("Added attribute:", { id: res.insertId, ...attribute });
        result(null, { id: res.insertId, ...attribute });
      }
    );
  }

  // Update attribute
  static updateAttribute(attributeId, attribute, result) {
    // Convert options array to JSON string if it exists
    let options = attribute.options;
    if (options && Array.isArray(options)) {
      options = JSON.stringify(options);
    }

    db.query(
      "UPDATE category_attributes SET name = ?, type = ?, options = ? WHERE id = ?",
      [attribute.name, attribute.type, options, attributeId],
      (err, res) => {
        if (err) {
          console.error("Error updating attribute:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Attribute not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Updated attribute:", { id: attributeId, ...attribute });
        result(null, { id: attributeId, ...attribute });
      }
    );
  }

  // Delete attribute
  static deleteAttribute(attributeId, result) {
    db.query(
      "DELETE FROM category_attributes WHERE id = ?",
      attributeId,
      (err, res) => {
        if (err) {
          console.error("Error deleting attribute:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Attribute not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Deleted attribute with id:", attributeId);
        result(null, { id: attributeId });
      }
    );
  }

  // Get attributes for a category
  static getAttributes(categoryId, result) {
    db.query(
      "SELECT * FROM category_attributes WHERE category_id = ?",
      categoryId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving category attributes:", err);
          result(err, null);
          return;
        }

        result(null, res);
      }
    );
  }

  // Get categories that have at least one product
  static getCategoriesWithProducts(result) {
    db.query(
      `
      SELECT DISTINCT c.*, 
             GROUP_CONCAT(DISTINCT ca.id) AS attribute_ids,
             GROUP_CONCAT(DISTINCT ca.name) AS attribute_names,
             GROUP_CONCAT(DISTINCT ca.type) AS attribute_types,
             GROUP_CONCAT(DISTINCT ca.options) AS attribute_options,
             COUNT(DISTINCT p.id) AS product_count
      FROM categories c
      INNER JOIN products p ON c.id = p.category_id
      LEFT JOIN category_attributes ca ON c.id = ca.category_id
      WHERE p.active = 'Yes'
      GROUP BY c.id
      HAVING COUNT(DISTINCT p.id) > 0
      ORDER BY c.nameEn ASC
    `,
      (err, res) => {
        if (err) {
          console.error("Error retrieving categories with products:", err);
          result(err, null);
          return;
        }

        // Process each category to handle attributes
        const categoriesWithAttributes = res.map((category) => {
          const processedCategory = { ...category, attributes: [] };

          // If category has attributes, process them
          if (category.attribute_ids) {
            const ids = category.attribute_ids.split(",");
            const names = category.attribute_names.split(",");
            const types = category.attribute_types.split(",");
            const options = category.attribute_options
              ? category.attribute_options.split(",")
              : [];

            for (let i = 0; i < ids.length; i++) {
              let attributeOptions = null;

              // Try to parse JSON for options if available
              if (options[i] && options[i] !== "null") {
                try {
                  attributeOptions = JSON.parse(options[i]);
                } catch (e) {
                  attributeOptions = options[i].split("|");
                }
              }

              processedCategory.attributes.push({
                id: parseInt(ids[i]),
                name: names[i],
                type: types[i],
                options: attributeOptions,
              });
            }
          }

          // Clean up the raw concatenated fields
          delete processedCategory.attribute_ids;
          delete processedCategory.attribute_names;
          delete processedCategory.attribute_types;
          delete processedCategory.attribute_options;

          return processedCategory;
        });

        result(null, categoriesWithAttributes);
      }
    );
  }
}

module.exports = Category;
