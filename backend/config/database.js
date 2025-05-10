const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create a connection to the database
const connection = mysql.createConnection({
  host:
    process.env.DB_HOST || "cellmade.c7soaooksm06.us-west-2.rds.amazonaws.com",
  port: 3306,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "kavindya123",
  database: process.env.DB_NAME || "prison_shop",
});

// Open the MySQL connection
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database: ", error);
    return;
  }
  console.log("Successfully connected to the MySQL database.");

  // Create the necessary tables if they don't exist
  createTables();
});

// Function to create the necessary tables
function createTables() {
  // Products table
  const productsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      productCode VARCHAR(50),
      nameEn VARCHAR(255) NOT NULL,
      nameSi VARCHAR(255),
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock INT DEFAULT 0,
      status ENUM('In Stock', 'Out of Stock') DEFAULT 'In Stock',
      active ENUM('Yes', 'No') DEFAULT 'Yes',
      category_id INT NOT NULL,
      subCategory_id INT,
      prison_id INT,
      mainImage VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      FOREIGN KEY (subCategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
      FOREIGN KEY (prison_id) REFERENCES prisons(id) ON DELETE SET NULL
    )
  `;

  // Prison table
  const prisonsTable = `
    CREATE TABLE IF NOT EXISTS prisons (
      id INT PRIMARY KEY AUTO_INCREMENT,
      prison_no VARCHAR(50) NOT NULL,
      nameEn VARCHAR(255) NOT NULL,
      nameSi VARCHAR(255),
      location TEXT,
      contact VARCHAR(50),
      status ENUM('Active', 'Inactive') DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Product attributes table (for dynamic attributes based on product type)
  const attributesTable = `
    CREATE TABLE IF NOT EXISTS product_attributes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      product_id INT NOT NULL,
      attribute_key VARCHAR(50) NOT NULL,
      attribute_value TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      INDEX (product_id)
    )
  `;

  // Product images table (for additional images)
  const imagesTable = `
    CREATE TABLE IF NOT EXISTS product_images (
      id INT PRIMARY KEY AUTO_INCREMENT,
      product_id INT NOT NULL,
      image_path VARCHAR(255) NOT NULL,
      display_order INT DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      INDEX (product_id)
    )
  `;

  // Categories table
  const categoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT NOT NULL AUTO_INCREMENT,
      code VARCHAR(50) NOT NULL,
      nameEn VARCHAR(255) NOT NULL,
      nameSi VARCHAR(255),
      description TEXT,
      image VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY code (code)
    )
  `;

  // Category attributes table
  const categoryAttributesTable = `
    CREATE TABLE IF NOT EXISTS category_attributes (
      id INT NOT NULL AUTO_INCREMENT,
      category_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      options TEXT,
      PRIMARY KEY (id),
      KEY category_id (category_id),
      CONSTRAINT fk_category_attribute FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    )
  `;

  // Subcategories table
  const subcategoriesTable = `
    CREATE TABLE IF NOT EXISTS subcategories (
      id INT NOT NULL AUTO_INCREMENT,
      category_id INT NOT NULL,
      nameEn VARCHAR(255) NOT NULL,
      nameSi VARCHAR(255),
      description TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY category_id (category_id),
      CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    )
  `;

  // Orders table
  const ordersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      orderNumber VARCHAR(50) NOT NULL,
      customer_id INT,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      delivery_address TEXT NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      status ENUM('pending', 'approved', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      payment_slip VARCHAR(255),
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `;

  // Order items table
  const orderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      subtotal DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    )
  `;

  // Custom orders table
  const customOrdersTable = `
    CREATE TABLE IF NOT EXISTS custom_orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      orderNumber VARCHAR(50) NOT NULL,
      customer_id INT,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      delivery_address TEXT NOT NULL,
      category_id INT NOT NULL,
      subcategory_id INT,
      requirements TEXT NOT NULL,
      status ENUM('pending', 'reviewed', 'approved', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
      FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `;

  // Bank details table
  const bankDetailsTable = `
    CREATE TABLE IF NOT EXISTS bank_details (
      id INT PRIMARY KEY AUTO_INCREMENT,
      bank_name VARCHAR(255) NOT NULL,
      account_name VARCHAR(255) NOT NULL,
      account_number VARCHAR(50) NOT NULL,
      branch VARCHAR(255) NOT NULL,
      instructions TEXT,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Users table (for customers)
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      is_blocked BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Admins table
  const adminsTable = `
    CREATE TABLE IF NOT EXISTS admins (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role ENUM('super_admin', 'prison_admin') NOT NULL,
      prison_id INT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (prison_id) REFERENCES prisons(id) ON DELETE SET NULL
    )
  `;

  // Execute table creation queries
  connection.query(categoriesTable, (err) => {
    if (err) {
      console.error("Error creating categories table: ", err);
      return;
    }
    console.log("Categories table created or already exists");

    // Create subcategories table after categories table
    connection.query(subcategoriesTable, (err) => {
      if (err) {
        console.error("Error creating subcategories table: ", err);
        return;
      }
      console.log("Subcategories table created or already exists");

      // Create prisons table
      connection.query(prisonsTable, (err) => {
        if (err) {
          console.error("Error creating prisons table: ", err);
          return;
        }
        console.log("Prisons table created or already exists");

        // Create category attributes table
        connection.query(categoryAttributesTable, (err) => {
          if (err) {
            console.error("Error creating category_attributes table: ", err);
            return;
          }
          console.log("Category attributes table created or already exists");

          // Now create products table after the tables it references
          connection.query(productsTable, (err) => {
            if (err) {
              console.error("Error creating products table: ", err);
              return;
            }
            console.log("Products table created or already exists");

            // Create product-related tables after products table
            connection.query(attributesTable, (err) => {
              if (err) {
                console.error("Error creating product_attributes table: ", err);
                return;
              }
              console.log("Product attributes table created or already exists");

              connection.query(imagesTable, (err) => {
                if (err) {
                  console.error("Error creating product_images table: ", err);
                  return;
                }
                console.log("Product images table created or already exists");

                // Create orders table
                connection.query(ordersTable, (err) => {
                  if (err) {
                    console.error("Error creating orders table: ", err);
                    return;
                  }
                  console.log("Orders table created or already exists");

                  // Create order items table after orders table
                  connection.query(orderItemsTable, (err) => {
                    if (err) {
                      console.error("Error creating order_items table: ", err);
                      return;
                    }
                    console.log("Order items table created or already exists");
                  });

                  // Create custom orders table
                  connection.query(customOrdersTable, (err) => {
                    if (err) {
                      console.error(
                        "Error creating custom_orders table: ",
                        err
                      );
                      return;
                    }
                    console.log(
                      "Custom orders table created or already exists"
                    );
                  });

                  // Create bank details table
                  connection.query(bankDetailsTable, (err) => {
                    if (err) {
                      console.error("Error creating bank_details table: ", err);
                      return;
                    }
                    console.log("Bank details table created or already exists");
                  });

                  // Create users table
                  connection.query(usersTable, (err) => {
                    if (err) {
                      console.error("Error creating users table: ", err);
                      return;
                    }
                    console.log("Users table created or already exists");
                  });

                  // Create admins table
                  connection.query(adminsTable, (err) => {
                    if (err) {
                      console.error("Error creating admins table: ", err);
                      return;
                    }
                    console.log("Admins table created or already exists");

                    // Insert super admin account
                    const superAdminPassword = require("bcryptjs").hashSync(
                      "admin123",
                      10
                    );
                    const superAdminQuery = `
                      INSERT IGNORE INTO admins (email, password, first_name, last_name, role)
                      VALUES ('superadmin@cellmade.com', '${superAdminPassword}', 'Super', 'Admin', 'super_admin')
                    `;
                    connection.query(superAdminQuery, (err) => {
                      if (err) {
                        console.error(
                          "Error creating super admin account: ",
                          err
                        );
                        return;
                      }
                      console.log(
                        "Super admin account created or already exists"
                      );
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

module.exports = connection;
