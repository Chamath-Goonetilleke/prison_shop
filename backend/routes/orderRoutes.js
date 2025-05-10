const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const { verifyUserToken } = require("../middleware/authMiddleware");

// Create a new Order
router.post("/", orderController.uploadPaymentSlip, orderController.create);

// Retrieve all Orders
router.get("/", orderController.findAll);

// Get orders for authenticated user
router.get("/user", verifyUserToken, orderController.findOrdersForUser);

// Retrieve Orders by customer email
router.get("/customer/:email", orderController.findByCustomerEmail);

// Retrieve Orders by customer ID
router.get("/customer-id/:customerId", orderController.findByCustomerId);

// Retrieve a single Order with orderId
router.get("/:orderId", orderController.findOne);

// Update order status
router.put("/:orderId/status", orderController.updateStatus);

module.exports = router;
