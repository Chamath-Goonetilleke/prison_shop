const express = require("express");
const router = express.Router();
const bankDetailsController = require("../controller/bankDetailsController");

// Create a new bank details entry
router.post("/", bankDetailsController.create);

// Retrieve all bank details
router.get("/", bankDetailsController.findAll);

// Retrieve active bank details for checkout
router.get("/active", bankDetailsController.findActive);

// Retrieve a single bank details entry with id
router.get("/:id", bankDetailsController.findOne);

// Update a bank details entry with id
router.put("/:id", bankDetailsController.update);

// Delete a bank details entry with id
router.delete("/:id", bankDetailsController.delete);

module.exports = router;
