const CustomOrder = require("../model/CustomOrder");
const db = require("../config/database");

// Create a new custom order
exports.create = async (req, res) => {
  // Validate request
  if (
    !req.body.customer_name ||
    !req.body.customer_email ||
    !req.body.customer_phone ||
    !req.body.delivery_address ||
    !req.body.category_id ||
    !req.body.requirements
  ) {
    return res.status(400).send({
      message: "Required fields cannot be empty!",
    });
  }

  try {
    // Prepare custom order object
    const customOrder = {
      customer_id: req.body.customer_id || null,
      customer_name: req.body.customer_name,
      customer_email: req.body.customer_email,
      customer_phone: req.body.customer_phone,
      delivery_address: req.body.delivery_address,
      category_id: req.body.category_id,
      subcategory_id: req.body.subcategory_id || null,
      prison_id: req.body.prison_id || null,
      requirements: req.body.requirements,
      status: "pending", // Default status
    };

    // Save custom order in the database
    CustomOrder.create(customOrder, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the custom order.",
        });
      } else {
        res.status(201).send(data);
      }
    });
  } catch (e) {
    console.error("Error creating custom order:", e);
    res.status(500).send({
      message: "Error processing custom order request",
    });
  }
};

// Retrieve all custom orders
exports.findAll = (req, res) => {
  CustomOrder.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving custom orders.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single custom order by id
exports.findOne = (req, res) => {
  CustomOrder.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Custom order with id ${req.params.id} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving custom order with id ${req.params.id}`,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Update custom order status
exports.updateStatus = (req, res) => {
  // Validate Request
  if (!req.body.status) {
    return res.status(400).send({
      message: "Status can not be empty!",
    });
  }

  CustomOrder.updateStatus(
    req.params.id,
    req.body.status,
    req.body.admin_notes || null,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Custom order with id ${req.params.id} not found.`,
          });
        } else {
          res.status(500).send({
            message: `Error updating custom order status with id ${req.params.id}`,
          });
        }
      } else {
        res.send(data);
      }
    }
  );
};

// Get custom orders by customer email
exports.findByCustomerEmail = (req, res) => {
  if (!req.params.email) {
    return res.status(400).send({
      message: "Email is required!",
    });
  }

  CustomOrder.findByCustomerEmail(req.params.email, (err, data) => {
    if (err) {
      res.status(500).send({
        message: `Error retrieving custom orders for email ${req.params.email}`,
      });
    } else {
      res.send(data);
    }
  });
};

// Find custom orders by customer ID
exports.findByCustomerId = (req, res) => {
  if (!req.params.customerId) {
    return res.status(400).send({
      message: "Customer ID is required!",
    });
  }

  CustomOrder.findByCustomerId(req.params.customerId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: `Error retrieving custom orders for customer ID ${req.params.customerId}`,
      });
    } else {
      res.send(data);
    }
  });
};

// Find custom orders for authenticated user
exports.findCustomOrdersForUser = (req, res) => {
  // The user ID comes from the authenticated user in the request object
  if (!req.user || !req.user.id) {
    return res.status(401).send({
      message: "User not authenticated",
    });
  }

  CustomOrder.findByCustomerId(req.user.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "An error occurred while retrieving custom orders",
      });
    } else {
      res.send(data);
    }
  });
};
