const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

// Create a new Order
router.post("/", orderController.uploadPaymentSlip, orderController.create);

// Retrieve all Orders
router.get("/", orderController.findAll);

// Retrieve a single Order with orderId
router.get("/:orderId", orderController.findOne);

// Update order status
router.put("/:orderId/status", orderController.updateStatus);

// Retrieve Orders by customer email
router.get("/customer/:email", orderController.findByCustomerEmail);

module.exports = router;
