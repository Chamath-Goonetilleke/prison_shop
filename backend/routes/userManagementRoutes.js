const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const connection = require("../config/database");
const { adminAuth, superAdminAuth } = require("../middleware/auth");

// Get all users (for admin)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const [users] = await connection
      .promise()
      .query(
        "SELECT id, email, first_name, last_name, phone, address, is_blocked, created_at FROM users"
      );

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Block/Unblock user
router.patch("/users/:id/block", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    await connection
      .promise()
      .query("UPDATE users SET is_blocked = ? WHERE id = ?", [isBlocked, id]);

    res.json({
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
});

// Get all admins (super admin only)
router.get("/admins", superAdminAuth, async (req, res) => {
  try {
    const [admins] = await connection.promise().query(`
      SELECT a.*, p.nameEn as prison_name 
      FROM admins a 
      LEFT JOIN prisons p ON a.prison_id = p.id
    `);

    res.json(admins);
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({ message: "Error fetching admins" });
  }
});

// Add new admin (super admin only)
router.post("/admins", superAdminAuth, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, prisonId } = req.body;

    // Check if admin already exists
    const [existingAdmin] = await connection
      .promise()
      .query("SELECT * FROM admins WHERE email = ?", [email]);

    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO admins (email, password, first_name, last_name, role, prison_id) VALUES (?, ?, ?, ?, ?, ?)",
        [email, hashedPassword, firstName, lastName, role, prisonId]
      );

    res.status(201).json({
      message: "Admin added successfully",
      admin: {
        id: result.insertId,
        email,
        firstName,
        lastName,
        role,
        prisonId,
      },
    });
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({ message: "Error adding admin" });
  }
});

// Update admin (super admin only)
router.patch("/admins/:id", superAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, role, prisonId, isActive } = req.body;

    await connection
      .promise()
      .query(
        "UPDATE admins SET email = ?, first_name = ?, last_name = ?, role = ?, prison_id = ?, is_active = ? WHERE id = ?",
        [email, firstName, lastName, role, prisonId, isActive, id]
      );

    res.json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ message: "Error updating admin" });
  }
});

// Delete admin (super admin only)
router.delete("/admins/:id", superAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await connection.promise().query("DELETE FROM admins WHERE id = ?", [id]);

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ message: "Error deleting admin" });
  }
});

module.exports = router;
