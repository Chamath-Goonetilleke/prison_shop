const db = require("../config/database");

// Model for Prison
class Prison {
  constructor(prison) {
    this.id = prison.id;
    this.prison_no = prison.prison_no;
    this.nameEn = prison.nameEn;
    this.nameSi = prison.nameSi || null;
    this.location = prison.location || null;
    this.contact = prison.contact || null;
    this.status = prison.status || "Active";
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  // Create a new prison
  static create(newPrison, result) {
    db.query("INSERT INTO prisons SET ?", newPrison, (err, res) => {
      if (err) {
        console.error("Error creating prison:", err);
        result(err, null);
        return;
      }

      console.log("Created prison:", { id: res.insertId, ...newPrison });
      result(null, { id: res.insertId, ...newPrison });
    });
  }

  // Get all prisons
  static getAll(result) {
    db.query("SELECT * FROM prisons ORDER BY id DESC", (err, res) => {
      if (err) {
        console.error("Error retrieving prisons:", err);
        result(err, null);
        return;
      }

      console.log("Retrieved prisons:", res);
      result(null, res);
    });
  }

  // Find prison by ID
  static findById(prisonId, result) {
    db.query("SELECT * FROM prisons WHERE id = ?", prisonId, (err, res) => {
      if (err) {
        console.error("Error retrieving prison:", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("Found prison:", res[0]);
        result(null, res[0]);
        return;
      }

      // Prison not found
      result({ kind: "not_found" }, null);
    });
  }

  // Update prison
  static update(prisonId, prison, result) {
    db.query(
      "UPDATE prisons SET prison_no = ?, nameEn = ?, nameSi = ?, location = ?, contact = ?, status = ?, updated_at = ? WHERE id = ?",
      [
        prison.prison_no,
        prison.nameEn,
        prison.nameSi,
        prison.location,
        prison.contact,
        prison.status,
        new Date(),
        prisonId,
      ],
      (err, res) => {
        if (err) {
          console.error("Error updating prison:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Prison not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Updated prison:", { id: prisonId, ...prison });
        result(null, { id: prisonId, ...prison });
      }
    );
  }

  // Delete prison
  static delete(prisonId, result) {
    db.query("DELETE FROM prisons WHERE id = ?", prisonId, (err, res) => {
      if (err) {
        console.error("Error deleting prison:", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // Prison not found
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Deleted prison with id:", prisonId);
      result(null, { id: prisonId });
    });
  }

  // Get all active prisons
  static getActive(result) {
    db.query(
      "SELECT * FROM prisons WHERE status = 'Active' ORDER BY nameEn",
      (err, res) => {
        if (err) {
          console.error("Error retrieving active prisons:", err);
          result(err, null);
          return;
        }

        console.log("Retrieved active prisons:", res);
        result(null, res);
      }
    );
  }
}

module.exports = Prison;
