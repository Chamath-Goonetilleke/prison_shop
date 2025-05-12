const jwt = require("jsonwebtoken");
const connection = require("../config/database");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
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
    res.status(401).json({ message: "Please authenticate." });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
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
    res.status(401).json({ message: "Please authenticate as admin." });
  }
};

const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Check if admin exists, is active and is super admin
    const [admin] = await connection
      .promise()
      .query(
        'SELECT * FROM admins WHERE id = ? AND is_active = true AND role = "super_admin"',
        [decoded.id]
      );

    if (!admin.length) {
      throw new Error();
    }

    req.admin = admin[0];
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate as super admin." });
  }
};

module.exports = {
  auth,
  adminAuth,
  superAdminAuth,
};
