-- Create subcategories table
DROP TABLE IF EXISTS subcategories;
CREATE TABLE subcategories (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert some example subcategories
INSERT INTO subcategories (category_id, nameEn, nameSi, description) VALUES
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Kettles', 'කල්දේරම්', 'Various types of kettles'),
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Aluminum Spoons', 'ඇළුමිනියම් හැඳි', 'Spoons made of aluminum'),
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Buckets', 'බාල්දි', 'Metal buckets of various sizes'),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Wooden Beds', 'ලී ඇඳන්', 'Beds made of various types of wood'),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Chairs', 'පුටු', 'Chairs in different styles'),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Tables', 'මේස', 'Tables for various purposes'),
((SELECT id FROM categories WHERE code = 'TEXTILES'), 'Bed Sheets', 'බේඩ් ෂිට්', 'Cotton bed sheets'),
((SELECT id FROM categories WHERE code = 'TEXTILES'), 'Hand Towels', 'අත් පිස්නා', 'Small towels for hands'); 