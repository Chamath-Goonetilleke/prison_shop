const db = require("../config/database");

// Custom Order status values
const CUSTOM_ORDER_STATUS = {
  PENDING: "pending", // Just submitted, not reviewed yet
  REVIEWED: "reviewed", // Reviewed by admin but no decision yet
  APPROVED: "approved", // Approved, waiting to be started
  IN_PROGRESS: "in_progress", // Being worked on
  COMPLETED: "completed", // Finished
  CANCELLED: "cancelled", // Cancelled
};

// Model for Custom Order
class CustomOrder {
  constructor(order) {
    this.id = order.id;
    this.orderNumber = order.orderNumber;
    this.customer_id = order.customer_id || null;
    this.customer_name = order.customer_name;
    this.customer_email = order.customer_email;
    this.customer_phone = order.customer_phone;
    this.delivery_address = order.delivery_address;
    this.category_id = order.category_id;
    this.subcategory_id = order.subcategory_id || null;
    this.requirements = order.requirements;
    this.status = order.status || CUSTOM_ORDER_STATUS.PENDING;
    this.admin_notes = order.admin_notes || null;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  // Generate a unique order number
  static generateOrderNumber() {
    const prefix = "CUSTOM";
    const timestamp = Date.now().toString().substr(-6);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${prefix}-${timestamp}-${random}`;
  }

  // Create a new custom order
  static create(newOrder, result) {
    // Generate order number
    const orderNumber = this.generateOrderNumber();
    newOrder.orderNumber = orderNumber;

    // Insert custom order into database
    db.query("INSERT INTO custom_orders SET ?", newOrder, (err, res) => {
      if (err) {
        console.error("Error creating custom order:", err);
        result(err, null);
        return;
      }

      console.log("Created custom order:", { id: res.insertId, orderNumber });
      result(null, {
        id: res.insertId,
        orderNumber,
        ...newOrder,
      });
    });
  }

  // Get all custom orders
  static getAll(result) {
    db.query(
      `
      SELECT co.*, 
        c.nameEn as category_name, 
        sc.nameEn as subcategory_name
      FROM custom_orders co
      LEFT JOIN categories c ON co.category_id = c.id
      LEFT JOIN subcategories sc ON co.subcategory_id = sc.id
      ORDER BY co.created_at DESC
    `,
      (err, res) => {
        if (err) {
          console.error("Error retrieving custom orders:", err);
          result(err, null);
          return;
        }

        result(null, res);
      }
    );
  }

  // Find custom order by ID
  static findById(orderId, result) {
    db.query(
      `
      SELECT co.*, 
        c.nameEn as category_name, 
        sc.nameEn as subcategory_name
      FROM custom_orders co
      LEFT JOIN categories c ON co.category_id = c.id
      LEFT JOIN subcategories sc ON co.subcategory_id = sc.id
      WHERE co.id = ?
    `,
      orderId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving custom order:", err);
          result(err, null);
          return;
        }

        if (res.length) {
          result(null, res[0]);
        } else {
          result({ kind: "not_found" }, null);
        }
      }
    );
  }

  // Update custom order status
  static updateStatus(orderId, status, adminNotes, result) {
    db.query(
      "UPDATE custom_orders SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?",
      [status, adminNotes, new Date(), orderId],
      (err, res) => {
        if (err) {
          console.error("Error updating custom order status:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows === 0) {
          // No custom order found with the given ID
          result({ kind: "not_found" }, null);
          return;
        }

        // Get updated custom order
        this.findById(orderId, (err, data) => {
          if (err) {
            result(err, null);
            return;
          }
          result(null, data);
        });
      }
    );
  }

  // Get custom orders by customer email
  static findByCustomerEmail(email, result) {
    db.query(
      `
      SELECT co.*, 
        c.nameEn as category_name, 
        sc.nameEn as subcategory_name
      FROM custom_orders co
      LEFT JOIN categories c ON co.category_id = c.id
      LEFT JOIN subcategories sc ON co.subcategory_id = sc.id
      WHERE co.customer_email = ?
      ORDER BY co.created_at DESC
    `,
      email,
      (err, res) => {
        if (err) {
          console.error("Error retrieving custom orders:", err);
          result(err, null);
          return;
        }

        result(null, res);
      }
    );
  }

  // Get custom orders by customer ID
  static findByCustomerId(customerId, result) {
    db.query(
      `
      SELECT co.*, 
        c.nameEn as category_name, 
        sc.nameEn as subcategory_name
      FROM custom_orders co
      LEFT JOIN categories c ON co.category_id = c.id
      LEFT JOIN subcategories sc ON co.subcategory_id = sc.id
      WHERE co.customer_id = ?
      ORDER BY co.created_at DESC
    `,
      customerId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving custom orders by customer ID:", err);
          result(err, null);
          return;
        }

        result(null, res);
      }
    );
  }
}

module.exports = CustomOrder;
