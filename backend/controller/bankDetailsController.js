const BankDetails = require("../model/BankDetails");

// Create and Save a new BankDetails entry
exports.create = (req, res) => {
  // Validate request
  if (
    !req.body.bank_name ||
    !req.body.account_name ||
    !req.body.account_number ||
    !req.body.branch
  ) {
    return res.status(400).send({
      message:
        "Bank name, account name, account number, and branch are required!",
    });
  }

  // Create a BankDetails object
  const bankDetails = new BankDetails({
    bank_name: req.body.bank_name,
    account_name: req.body.account_name,
    account_number: req.body.account_number,
    branch: req.body.branch,
    instructions: req.body.instructions,
    active: req.body.active !== undefined ? req.body.active : true,
  });

  // Save BankDetails in the database
  BankDetails.create(bankDetails, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "An error occurred while creating the bank details.",
      });
    } else {
      res.status(201).send(data);
    }
  });
};

// Retrieve all BankDetails
exports.findAll = (req, res) => {
  BankDetails.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving bank details.",
      });
    } else {
      res.send(data);
    }
  });
};

// Retrieve active BankDetails for checkout page
exports.findActive = (req, res) => {
  BankDetails.getActive((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "An error occurred while retrieving active bank details.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single BankDetails with id
exports.findOne = (req, res) => {
  BankDetails.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Bank details with id ${req.params.id} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving bank details with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Update a BankDetails identified by the id
exports.update = (req, res) => {
  // Validate Request
  if (
    !req.body.bank_name ||
    !req.body.account_name ||
    !req.body.account_number ||
    !req.body.branch
  ) {
    return res.status(400).send({
      message:
        "Bank name, account name, account number, and branch are required!",
    });
  }

  BankDetails.update(
    req.params.id,
    {
      bank_name: req.body.bank_name,
      account_name: req.body.account_name,
      account_number: req.body.account_number,
      branch: req.body.branch,
      instructions: req.body.instructions,
      active: req.body.active !== undefined ? req.body.active : true,
    },
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Bank details with id ${req.params.id} not found.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating bank details with id " + req.params.id,
          });
        }
      } else {
        res.send(data);
      }
    }
  );
};

// Delete a BankDetails with the specified id
exports.delete = (req, res) => {
  BankDetails.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Bank details with id ${req.params.id} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete bank details with id " + req.params.id,
        });
      }
    } else {
      res.send({ message: "Bank details deleted successfully!" });
    }
  });
};
