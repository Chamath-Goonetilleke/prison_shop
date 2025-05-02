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
      mainImage VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      FOREIGN KEY (subCategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
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

  // Execute table creation queries
  connection.query(productsTable, (err) => {
    if (err) {
      console.error("Error creating products table: ", err);
      return;
    }
    console.log("Products table created or already exists");

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

        // Create categories table after product tables
        connection.query(categoriesTable, (err) => {
          if (err) {
            console.error("Error creating categories table: ", err);
            return;
          }
          console.log("Categories table created or already exists");

          // Create category attributes table after categories table
          connection.query(categoryAttributesTable, (err) => {
            if (err) {
              console.error("Error creating category_attributes table: ", err);
              return;
            }
            console.log("Category attributes table created or already exists");

            // Create subcategories table after category tables
            connection.query(subcategoriesTable, (err) => {
              if (err) {
                console.error("Error creating subcategories table: ", err);
                return;
              }
              console.log("Subcategories table created or already exists");
            });
          });
        });
      });
    });
  });
}

module.exports = connection;
