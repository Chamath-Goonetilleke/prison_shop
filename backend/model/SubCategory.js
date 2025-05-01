const db = require("../config/database");

// Model for SubCategory
class SubCategory {
  constructor(subCategory) {
    this.id = subCategory.id;
    this.category_id = subCategory.category_id;
    this.nameEn = subCategory.nameEn;
    this.nameSi = subCategory.nameSi;
    this.description = subCategory.description || null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Create a new subcategory
  static create(newSubCategory, result) {
    db.query("INSERT INTO subcategories SET ?", newSubCategory, (err, res) => {
      if (err) {
        console.error("Error creating subcategory:", err);
        result(err, null);
        return;
      }

      console.log("Created subcategory:", {
        id: res.insertId,
        ...newSubCategory,
      });
      result(null, { id: res.insertId, ...newSubCategory });
    });
  }

  // Get all subcategories
  static getAll(result) {
    db.query(
      `
      SELECT s.*, c.nameEn as categoryNameEn, c.nameSi as categoryNameSi
      FROM subcategories s
      JOIN categories c ON s.category_id = c.id
      ORDER BY c.nameEn, s.nameEn ASC
    `,
      (err, res) => {
        if (err) {
          console.error("Error retrieving subcategories:", err);
          result(err, null);
          return;
        }
        result(null, res);
      }
    );
  }

  // Get subcategories by category ID
  static getByCategoryId(categoryId, result) {
    db.query(
      "SELECT * FROM subcategories WHERE category_id = ? ORDER BY nameEn ASC",
      categoryId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving subcategories:", err);
          result(err, null);
          return;
        }
        result(null, res);
      }
    );
  }

  // Find subcategory by ID
  static findById(subCategoryId, result) {
    db.query(
      `
      SELECT s.*, c.nameEn as categoryNameEn, c.nameSi as categoryNameSi
      FROM subcategories s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = ?
    `,
      subCategoryId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving subcategory:", err);
          result(err, null);
          return;
        }

        if (res.length) {
          result(null, res[0]);
        } else {
          result({ kind: "not_found" }, null);
        }
      }
    );
  }

  // Update subcategory
  static update(subCategoryId, subCategory, result) {
    db.query(
      "UPDATE subcategories SET category_id = ?, nameEn = ?, nameSi = ?, description = ?, updatedAt = ? WHERE id = ?",
      [
        subCategory.category_id,
        subCategory.nameEn,
        subCategory.nameSi,
        subCategory.description,
        new Date(),
        subCategoryId,
      ],
      (err, res) => {
        if (err) {
          console.error("Error updating subcategory:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // SubCategory not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Updated subcategory:", {
          id: subCategoryId,
          ...subCategory,
        });
        result(null, { id: subCategoryId, ...subCategory });
      }
    );
  }

  // Delete subcategory
  static delete(subCategoryId, result) {
    db.query(
      "DELETE FROM subcategories WHERE id = ?",
      subCategoryId,
      (err, res) => {
        if (err) {
          console.error("Error deleting subcategory:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // SubCategory not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Deleted subcategory with id:", subCategoryId);
        result(null, { id: subCategoryId });
      }
    );
  }
}

module.exports = SubCategory;
