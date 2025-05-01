-- Create categories table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create category_attributes table
CREATE TABLE IF NOT EXISTS category_attributes (
  id INT NOT NULL AUTO_INCREMENT,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  options TEXT,
  PRIMARY KEY (id),
  KEY category_id (category_id),
  CONSTRAINT fk_category_attribute FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default category types (based on existing product types)
INSERT INTO categories (code, nameEn, nameSi, description) VALUES
('WORKSHOP', 'Workshop/Factory', 'කම්හල්', 'Workshop or factory produced items'),
('CARPENTRY', 'Carpentry', 'වඩු', 'Wooden and carpentry products'),
('TEXTILES', 'Textiles', 'පේෂ කර්ම', 'Textile products'),
('TAILORING', 'Tailoring', 'මැහුම්', 'Tailoring and sewing products'),
('BROOMS', 'Brooms/Brushes', 'කොසු/ඉදල්', 'Brooms and brushes'),
('BAKERY', 'Bakery', 'බේකරි', 'Bakery products'),
('MASONRY', 'Masonry', 'පෙදරේරු', 'Masonry products'),
('STATIONERY', 'Stationery', 'ලිපි කවර', 'Stationery products');

-- Insert default category attributes for Workshop category
INSERT INTO category_attributes (category_id, name, type, options) VALUES
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Sub Category', 'select', '["කල්දේරම් / පිහි වර්ග (Kettles / Types of Knives)","ඇළුමිනියම් හැඳි වර්ග (Aluminum Spoons)","බාල්දි වර්ග (Buckets)","කේක් තැටි (Cake Trays)","යකඩ ඇඳන් (Iron Beds)","අත් මුල්ලු (Hand Tools/Joints)","දුම් කබල් (Smoke Chambers/Stoves)","ඉටිපන්දම් රඳවන (Candle Holders)","රේක්ක (Rakes)","අත් සවල් (Hand Shovels)","ලියුම් පෙට්ටි (Letter Boxes)","විවිධ විසිතුරු භාණ්ඩ (Various Ornaments/Decorations)","වෙනත් නිර්මාණ (Other Creations)"]'),
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Material', 'text', NULL),
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Dimensions (cm)', 'text', NULL),
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Weight (kg)', 'number', NULL),
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Color', 'color', NULL),
((SELECT id FROM categories WHERE code = 'WORKSHOP'), 'Finish Type', 'text', NULL);

-- Insert default category attributes for Carpentry category
INSERT INTO category_attributes (category_id, name, type, options) VALUES
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Sub Category', 'select', '["ලී ඇඳන් (Wooden Beds)","පුටු (Chairs)","මේස (Tables)","හකුලන පුටු (Folding Chairs)","කණ්ණාඩි මේස (Dressing Tables/Mirror Tables)","අල්මාරි (Wardrobes/Cupboards)","විවිධ කැටයම් වර්ග (Various Carvings)","බුදු කුටි (Buddha Shrines)","අකුලන ස්ටුල් (Folding Stools)","පොල් කටු හැදි (Coconut Shell Spoons)","පාන් ලැලි (Bread Boards)","හැඳි පෙට්ටි (Spoon Boxes/Cutlery Holders)","ලුණු පොල්කටු (Salt Coconut Shells)","එළවළු කපන ලැලි (Vegetable Cutting Boards)","විදුරු කැබිනට් (Glass Cabinets)"]'),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Wood Type', 'text', NULL),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Dimensions (cm)', 'text', NULL),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Weight (kg)', 'number', NULL),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Color/Finish', 'text', NULL),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Has Carving', 'select', '["Yes","No"]'),
((SELECT id FROM categories WHERE code = 'CARPENTRY'), 'Assembly Required', 'select', '["Yes","No"]');

-- Add more attribute definitions for other categories as needed 