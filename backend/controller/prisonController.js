const Prison = require("../model/Prison");

// Create and Save a new Prison
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nameEn || !req.body.prison_no) {
    return res.status(400).send({
      message: "Prison name and number are required!",
    });
  }

  // Create a Prison
  const prison = new Prison({
    prison_no: req.body.prison_no,
    nameEn: req.body.nameEn,
    nameSi: req.body.nameSi,
    location: req.body.location,
    contact: req.body.contact,
    status: req.body.status || "Active",
  });

  // Save Prison in the database
  Prison.create(prison, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while creating the Prison.",
      });
    } else {
      res.status(201).send(data);
    }
  });
};

// Retrieve all Prisons from the database
exports.findAll = (req, res) => {
  Prison.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving prisons.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single Prison with a prisonId
exports.findOne = (req, res) => {
  Prison.findById(req.params.prisonId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Prison with id ${req.params.prisonId} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Prison with id " + req.params.prisonId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Update a Prison identified by the prisonId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.nameEn || !req.body.prison_no) {
    return res.status(400).send({
      message: "Prison name and number are required!",
    });
  }

  Prison.update(req.params.prisonId, new Prison(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Prison with id ${req.params.prisonId} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Prison with id " + req.params.prisonId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Delete a Prison with the specified prisonId in the request
exports.delete = (req, res) => {
  Prison.delete(req.params.prisonId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Prison with id ${req.params.prisonId} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Prison with id " + req.params.prisonId,
        });
      }
    } else {
      res.send({ message: "Prison was deleted successfully!" });
    }
  });
};

// Get all active prisons
exports.findActive = (req, res) => {
  Prison.getActive((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving active prisons.",
      });
    } else {
      res.send(data);
    }
  });
};
