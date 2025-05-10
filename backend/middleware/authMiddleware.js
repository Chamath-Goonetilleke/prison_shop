const jwt = require("jsonwebtoken");
const connection = require("../config/database");

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Check if admin exists and is active
    const [admin] = await connection
      .promise()
      .query("SELECT * FROM admins WHERE id = ? AND is_active = true", [
        decoded.id,
      ]);

    if (!admin.length) {
      throw new Error();
    }

    req.admin = admin[0];
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to verify user token
const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Check if user exists and is not blocked
    const [user] = await connection
      .promise()
      .query("SELECT * FROM users WHERE id = ? AND is_blocked = false", [
        decoded.id,
      ]);

    if (!user.length) {
      throw new Error();
    }

    req.user = user[0];
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to verify super admin token
const verifySuperAdminToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Check if admin exists, is active and is super admin
    const [admin] = await connection
      .promise()
      .query(
        "SELECT * FROM admins WHERE id = ? AND is_active = true AND role = 'super_admin'",
        [decoded.id]
      );

    if (!admin.length) {
      throw new Error();
    }

    req.admin = admin[0];
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = {
  verifyToken,
  verifyUserToken,
  verifySuperAdminToken,
};
