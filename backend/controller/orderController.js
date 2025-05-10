const Order = require("../model/Order");
const { uploadToCloudinary } = require("../util/imageUpload");
const multer = require("multer");
const db = require("../config/database");

// Configure multer for payment slip uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware for handling payment slip upload
exports.uploadPaymentSlip = upload.single("payment_slip");

// Create and Save a new Order
exports.create = async (req, res) => {
  // Validate request
  if (
    !req.body.customer_name ||
    !req.body.customer_email ||
    !req.body.items ||
    !req.body.total_amount
  ) {
    return res.status(400).send({
      message: "Customer information, items, and total amount are required!",
    });
  }

  try {
    // Parse order items
    let orderItems;
    try {
      orderItems =
        typeof req.body.items === "string"
          ? JSON.parse(req.body.items)
          : req.body.items;

      // Validate that each order item has a product_name
      for (const item of orderItems) {
        if (!item.product_name || item.product_name.trim() === "") {
          // If product_name is missing, fetch it from the database
          if (item.product_id) {
            try {
              const [product] = await new Promise((resolve, reject) => {
                db.query(
                  "SELECT nameEn FROM products WHERE id = ?",
                  [item.product_id],
                  (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                  }
                );
              });

              if (product && product.nameEn) {
                item.product_name = product.nameEn;
              } else {
                item.product_name = `Product #${item.product_id}`;
              }
            } catch (err) {
              console.error("Error fetching product name:", err);
              item.product_name = `Product #${item.product_id}`;
            }
          } else {
            item.product_name = "Unknown Product";
          }
        }
      }
    } catch (e) {
      return res.status(400).send({
        message: "Invalid order items format",
      });
    }

    // Prepare order object
    const order = {
      customer_id: req.body.customer_id || null,
      customer_name: req.body.customer_name,
      customer_email: req.body.customer_email,
      customer_phone: req.body.customer_phone,
      delivery_address: req.body.delivery_address,
      total_amount: parseFloat(req.body.total_amount),
      status: "pending", // Default status
    };

    // Handle payment slip upload if available
    if (req.file) {
      try {
        const slipResult = await uploadToCloudinary(req.file.buffer, {
          folder: "payment_slips",
        });
        order.payment_slip = slipResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading payment slip:", uploadError);
        return res.status(500).send({
          message: "Error uploading payment slip: " + uploadError.message,
        });
      }
    }

    // Save Order in the database
    Order.create(order, orderItems, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "An error occurred while creating the Order.",
        });
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    console.error("Error processing order data:", error);
    res.status(500).send({
      message: "Error processing order data: " + error.message,
    });
  }
};

// Retrieve all Orders
exports.findAll = (req, res) => {
  Order.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving orders.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single Order with order ID
exports.findOne = (req, res) => {
  Order.findById(req.params.orderId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Order with id ${req.params.orderId} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Order with id " + req.params.orderId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Update Order status
exports.updateStatus = (req, res) => {
  // Validate request
  if (!req.body.status) {
    res.status(400).send({
      message: "Status is required!",
    });
    return;
  }

  Order.updateStatus(
    req.params.orderId,
    req.body.status,
    req.body.admin_notes || null,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Order with id ${req.params.orderId} not found.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Order with id " + req.params.orderId,
          });
        }
      } else {
        res.send(data);
      }
    }
  );
};

// Find Orders by customer email
exports.findByCustomerEmail = (req, res) => {
  Order.findByCustomerEmail(req.params.email, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving orders.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find Orders by customer ID
exports.findByCustomerId = (req, res) => {
  // Check if user ID is provided
  if (!req.params.customerId) {
    return res.status(400).send({
      message: "Customer ID is required",
    });
  }

  Order.findByCustomerId(req.params.customerId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving orders.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find Orders for authenticated user
exports.findOrdersForUser = (req, res) => {
  // The user ID comes from the authenticated user in the request object
  if (!req.user || !req.user.id) {
    return res.status(401).send({
      message: "User not authenticated",
    });
  }

  Order.findByCustomerId(req.user.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving orders.",
      });
    } else {
      res.send(data);
    }
  });
};
