const db = require("../config/database");

// Model for BankDetails
class BankDetails {
  constructor(bankDetails) {
    this.id = bankDetails.id;
    this.bank_name = bankDetails.bank_name;
    this.account_name = bankDetails.account_name;
    this.account_number = bankDetails.account_number;
    this.branch = bankDetails.branch;
    this.instructions = bankDetails.instructions || null;
    this.active = bankDetails.active || true;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  // Create a new bank details entry
  static create(newBankDetails, result) {
    db.query("INSERT INTO bank_details SET ?", newBankDetails, (err, res) => {
      if (err) {
        console.error("Error creating bank details:", err);
        result(err, null);
        return;
      }

      console.log("Created bank details:", {
        id: res.insertId,
        ...newBankDetails,
      });
      result(null, { id: res.insertId, ...newBankDetails });
    });
  }

  // Get all bank details
  static getAll(result) {
    db.query("SELECT * FROM bank_details ORDER BY id DESC", (err, res) => {
      if (err) {
        console.error("Error retrieving bank details:", err);
        result(err, null);
        return;
      }

      result(null, res);
    });
  }

  // Get active bank details (for checkout page)
  static getActive(result) {
    db.query(
      "SELECT * FROM bank_details WHERE active = true ORDER BY id DESC",
      (err, res) => {
        if (err) {
          console.error("Error retrieving active bank details:", err);
          result(err, null);
          return;
        }

        result(null, res);
      }
    );
  }

  // Find bank details by ID
  static findById(id, result) {
    db.query("SELECT * FROM bank_details WHERE id = ?", id, (err, res) => {
      if (err) {
        console.error("Error retrieving bank details:", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
      } else {
        result({ kind: "not_found" }, null);
      }
    });
  }

  // Update bank details
  static update(id, bankDetails, result) {
    db.query(
      "UPDATE bank_details SET bank_name = ?, account_name = ?, account_number = ?, branch = ?, instructions = ?, active = ?, updated_at = ? WHERE id = ?",
      [
        bankDetails.bank_name,
        bankDetails.account_name,
        bankDetails.account_number,
        bankDetails.branch,
        bankDetails.instructions,
        bankDetails.active,
        new Date(),
        id,
      ],
      (err, res) => {
        if (err) {
          console.error("Error updating bank details:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Bank details entry not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Updated bank details:", { id: id, ...bankDetails });
        result(null, { id: id, ...bankDetails });
      }
    );
  }

  // Delete bank details
  static delete(id, result) {
    db.query("DELETE FROM bank_details WHERE id = ?", id, (err, res) => {
      if (err) {
        console.error("Error deleting bank details:", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // Bank details entry not found
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Deleted bank details with id:", id);
      result(null, { id: id });
    });
  }
}

module.exports = BankDetails;
