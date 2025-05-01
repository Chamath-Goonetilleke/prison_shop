-- First, backup the current products data
CREATE TABLE products_backup AS SELECT * FROM products;

-- Drop constraints and relationships
ALTER TABLE product_attributes DROP FOREIGN KEY product_attributes_ibfk_1;
ALTER TABLE product_images DROP FOREIGN KEY product_images_ibfk_1;

-- Drop the current products table
DROP TABLE IF EXISTS products;

-- Create the new products table with updated structure
CREATE TABLE products (
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
);

-- Restore data from backup with transformation
-- We need to map the type field to appropriate category_id values
-- For each product in backup, we'll need to find a matching category_id based on type

-- First get the categories
SELECT id, code FROM categories;

-- Note: You will need to manually adjust the INSERT query below based on your specific data,
-- mapping each type value to an appropriate category_id value.
-- This is a template that assumes type values match category codes:

INSERT INTO products (
  id, productCode, nameEn, nameSi, description, price, stock, status, active, 
  category_id, mainImage, created_at, updated_at
)
SELECT 
  pb.id, 
  pb.productCode, 
  pb.nameEn, 
  pb.nameSi, 
  pb.description, 
  pb.price, 
  pb.stock, 
  pb.status, 
  pb.active,
  -- Map the type to a category_id using a subquery
  (SELECT id FROM categories WHERE LOWER(code) = LOWER(pb.type) LIMIT 1),
  pb.mainImage, 
  pb.created_at, 
  pb.updated_at
FROM products_backup pb;

-- Re-establish relationships
ALTER TABLE product_attributes ADD CONSTRAINT product_attributes_ibfk_1 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  
ALTER TABLE product_images ADD CONSTRAINT product_images_ibfk_1
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Clean up by dropping the backup table
-- Only uncomment this line after verifying that the migration worked correctly
-- DROP TABLE products_backup; 