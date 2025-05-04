const express = require("express");
const router = express.Router();
const prisonController = require("../controller/prisonController");

// Create a new Prison
router.post("/", prisonController.create);

// Retrieve all Prisons
router.get("/", prisonController.findAll);

// Retrieve all active Prisons
router.get("/active", prisonController.findActive);

// Retrieve a single Prison with prisonId
router.get("/:prisonId", prisonController.findOne);

// Update a Prison with prisonId
router.put("/:prisonId", prisonController.update);

// Delete a Prison with prisonId
router.delete("/:prisonId", prisonController.delete);

module.exports = router;
