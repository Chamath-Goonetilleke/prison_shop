const db = require("../config/database");

// Order status values
const ORDER_STATUS = {
  PENDING: "pending", // Payment uploaded but not verified
  APPROVED: "approved", // Payment verified and order approved
  SHIPPED: "shipped", // Order has been shipped
  DELIVERED: "delivered", // Order has been delivered
  CANCELLED: "cancelled", // Order has been cancelled
};

// Model for Order
class Order {
  constructor(order) {
    this.id = order.id;
    this.orderNumber = order.orderNumber;
    this.customer_id = order.customer_id || null;
    this.customer_name = order.customer_name;
    this.customer_email = order.customer_email;
    this.customer_phone = order.customer_phone;
    this.delivery_address = order.delivery_address;
    this.total_amount = order.total_amount;
    this.status = order.status || ORDER_STATUS.PENDING;
    this.payment_slip = order.payment_slip;
    this.admin_notes = order.admin_notes || null;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  // Generate order number
  static generateOrderNumber() {
    // Create a unique order number with format ORD-YYYYMMDD-XXXX
    const date = new Date();
    const dateStr =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0");
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `ORD-${dateStr}-${randomNum}`;
  }

  // Create a new order
  static create(newOrder, orderItems, result) {
    // Start a transaction to ensure all operations succeed or fail together
    db.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return result(err, null);
      }

      // Generate order number
      const orderNumber = this.generateOrderNumber();
      newOrder.orderNumber = orderNumber;

      // Insert order into database
      db.query("INSERT INTO orders SET ?", newOrder, (err, res) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error creating order:", err);
            result(err, null);
          });
        }

        const orderId = res.insertId;

        // Format order items with orderId
        const orderItemsWithId = orderItems.map((item) => ({
          order_id: orderId,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        }));

        // Insert order items - use bulk insert
        const placeholders = orderItemsWithId
          .map(() => "(?, ?, ?, ?, ?, ?)")
          .join(", ");
        const values = orderItemsWithId.flatMap((item) => [
          item.order_id,
          item.product_id,
          item.product_name,
          item.quantity,
          item.price,
          item.subtotal,
        ]);

        const insertQuery = `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) VALUES ${placeholders}`;

        db.query(insertQuery, values, (err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error creating order items:", err);
              result(err, null);
            });
          }

          // Update product stock and status (if needed)
          const updatePromises = orderItems.map((item) => {
            return new Promise((resolve, reject) => {
              // First get current stock to determine if status needs updating
              db.query(
                "SELECT stock FROM products WHERE id = ?",
                [item.product_id],
                (err, results) => {
                  if (err) reject(err);
                  else if (results.length === 0) {
                    reject(
                      new Error(`Product with ID ${item.product_id} not found`)
                    );
                    return;
                  }

                  const currentStock = results[0].stock;
                  const newStock = Math.max(0, currentStock - item.quantity);

                  // If stock becomes 0, update status to "Out of Stock"
                  const newStatus =
                    newStock === 0 ? "Out of Stock" : "In Stock";

                  db.query(
                    "UPDATE products SET stock = ?, status = ? WHERE id = ?",
                    [newStock, newStatus, item.product_id],
                    (err) => {
                      if (err) reject(err);
                      else resolve();
                    }
                  );
                }
              );
            });
          });

          Promise.all(updatePromises)
            .then(() => {
              // Commit the transaction
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Error committing transaction:", err);
                    result(err, null);
                  });
                }

                console.log("Created order:", { id: orderId, orderNumber });
                result(null, {
                  id: orderId,
                  orderNumber,
                  ...newOrder,
                });
              });
            })
            .catch((err) => {
              return db.rollback(() => {
                console.error("Error updating product stock:", err);
                result(err, null);
              });
            });
        });
      });
    });
  }

  // Get all orders
  static getAll(result) {
    db.query(
      `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count 
      FROM orders o
      ORDER BY o.created_at DESC
    `,
      (err, res) => {
        if (err) {
          console.error("Error retrieving orders:", err);
          result(err, null);
          return;
        }

        result(null, res);
      }
    );
  }

  // Find order by ID with order items
  static findById(orderId, result) {
    db.query(`SELECT * FROM orders WHERE id = ?`, orderId, (err, res) => {
      if (err) {
        console.error("Error retrieving order:", err);
        result(err, null);
        return;
      }

      if (res.length) {
        const order = res[0];

        // Get order items with prison information
        db.query(
          `
          SELECT oi.*, 
                 p.prison_id,
                 pr.nameEn as prison_name,
                 pr.nameSi as prison_name_si
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          LEFT JOIN prisons pr ON p.prison_id = pr.id
          WHERE oi.order_id = ?
          `,
          orderId,
          (err, items) => {
            if (err) {
              console.error("Error retrieving order items:", err);
              result(err, null);
              return;
            }

            order.items = items;
            result(null, order);
          }
        );
      } else {
        result({ kind: "not_found" }, null);
      }
    });
  }

  // Update order status
  static updateStatus(orderId, status, adminNotes, result) {
    // Start transaction to handle status change and any stock updates
    db.beginTransaction(async (err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return result(err, null);
      }

      try {
        // First check current status
        const [orderResult] = await new Promise((resolve, reject) => {
          db.query(
            "SELECT status FROM orders WHERE id = ?",
            [orderId],
            (err, results) => {
              if (err) reject(err);
              else resolve(results);
            }
          );
        });

        if (!orderResult) {
          return db.rollback(() => {
            result({ kind: "not_found" }, null);
          });
        }

        const oldStatus = orderResult.status;

        // Update the order status
        await new Promise((resolve, reject) => {
          db.query(
            "UPDATE orders SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?",
            [status, adminNotes, new Date(), orderId],
            (err, res) => {
              if (err) reject(err);
              else if (res.affectedRows === 0)
                reject(new Error("Order not found"));
              else resolve();
            }
          );
        });

        // If order is being canceled, restore stock
        if (
          status === ORDER_STATUS.CANCELLED &&
          oldStatus !== ORDER_STATUS.CANCELLED
        ) {
          // Get order items
          const orderItems = await new Promise((resolve, reject) => {
            db.query(
              "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
              [orderId],
              (err, results) => {
                if (err) reject(err);
                else resolve(results);
              }
            );
          });

          // Restore stock for each product
          for (const item of orderItems) {
            // Get current product stock and status
            const [product] = await new Promise((resolve, reject) => {
              db.query(
                "SELECT stock, status FROM products WHERE id = ?",
                [item.product_id],
                (err, results) => {
                  if (err) reject(err);
                  else resolve(results);
                }
              );
            });

            if (product) {
              const newStock = product.stock + item.quantity;
              // If product was out of stock and now has stock, update status
              const newStatus = newStock > 0 ? "In Stock" : product.status;

              await new Promise((resolve, reject) => {
                db.query(
                  "UPDATE products SET stock = ?, status = ? WHERE id = ?",
                  [newStock, newStatus, item.product_id],
                  (err) => {
                    if (err) reject(err);
                    else resolve();
                  }
                );
              });
            }
          }
        }

        // Commit transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error committing transaction:", err);
              result(err, null);
            });
          }

          result(null, { id: orderId, status, admin_notes: adminNotes });
        });
      } catch (error) {
        db.rollback(() => {
          console.error("Error updating order status:", error);
          result(error, null);
        });
      }
    });
  }

  // Find orders by customer email
  static findByCustomerEmail(email, result) {
    db.query(
      `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count 
      FROM orders o
      WHERE o.customer_email = ?
      ORDER BY o.created_at DESC
    `,
      email,
      (err, res) => {
        if (err) {
          console.error("Error retrieving orders by email:", err);
          result(err, null);
          return;
        }

        result(null, res);
      }
    );
  }

  // Find orders by customer ID
  static findByCustomerId(customerId, result) {
    db.query(
      `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count 
      FROM orders o
      WHERE o.customer_id = ?
      ORDER BY o.created_at DESC
    `,
      customerId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving orders by customer ID:", err);
          result(err, null);
          return;
        }

        result(null, res);
      }
    );
  }
}

module.exports = Order;
