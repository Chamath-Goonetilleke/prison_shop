const express = require("express");
const router = express.Router();
const customOrderController = require("../controller/customOrderController");
const {
  verifyToken,
  verifyUserToken,
} = require("../middleware/authMiddleware");

// Create a new custom order - public route as it's accessed by website customers
router.post("/", customOrderController.create);

// Get all custom orders - admin only
router.get("/", verifyToken, customOrderController.findAll);

// Get custom orders for authenticated user
router.get(
  "/user",
  verifyUserToken,
  customOrderController.findCustomOrdersForUser
);

// Get customer orders by email - can be accessed by both customers and admins
router.get("/customer/:email", customOrderController.findByCustomerEmail);

// Get customer orders by customer ID
router.get("/customer-id/:customerId", customOrderController.findByCustomerId);

// Get custom order by ID - admin only
router.get("/:id", verifyToken, customOrderController.findOne);

// Update custom order status - admin only
router.put("/:id/status", verifyToken, customOrderController.updateStatus);

module.exports = router;
