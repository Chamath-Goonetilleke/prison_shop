const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../config/database");
const { auth, adminAuth, superAdminAuth } = require("../middleware/auth");

// User registration
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;

    // Check if user already exists
    const [existingUser] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO users (email, password, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
        [email, hashedPassword, firstName, lastName, phone, address]
      );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.insertId,
        email,
        firstName,
        lastName,
        phone,
        address,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Check if user is blocked
    if (user.is_blocked) {
      return res.status(401).json({ message: "Account is blocked" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Admin login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const [admins] = await connection
      .promise()
      .query("SELECT * FROM admins WHERE email = ?", [email]);

    if (admins.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = admins[0];

    // Check if admin is active
    if (!admin.is_active) {
      return res.status(401).json({ message: "Account is inactive" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role,
        prisonId: admin.prison_id,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const [user] = await connection
      .promise()
      .query(
        "SELECT id, email, first_name, last_name, phone, address FROM users WHERE id = ?",
        [req.user.id]
      );

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user[0].id,
      email: user[0].email,
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      phone: user[0].phone,
      address: user[0].address,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Get current admin
router.get("/admin/me", adminAuth, async (req, res) => {
  try {
    const [admin] = await connection
      .promise()
      .query(
        "SELECT id, email, first_name, last_name, role, prison_id FROM admins WHERE id = ?",
        [req.admin.id]
      );

    if (!admin.length) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      id: admin[0].id,
      email: admin[0].email,
      firstName: admin[0].first_name,
      lastName: admin[0].last_name,
      role: admin[0].role,
      prisonId: admin[0].prison_id,
    });
  } catch (error) {
    console.error("Get admin error:", error);
    res.status(500).json({ message: "Error fetching admin" });
  }
});

module.exports = router;
