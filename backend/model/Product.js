const db = require("../config/database");

// Product types and their specific attributes
const PRODUCT_TYPES = {
  WORKSHOP: "workshop",
  CARPENTRY: "carpentry",
  TEXTILES: "textiles",
  TAILORING: "tailoring",
  BROOMS: "brooms",
  BAKERY: "bakery",
  MASONRY: "masonry",
  STATIONERY: "stationery",
};

// Model for Product
class Product {
  constructor(product) {
    this.id = product.id;
    this.productCode = product.productCode;
    this.nameEn = product.nameEn;
    this.nameSi = product.nameSi;
    this.description = product.description || null;
    this.price = product.price;
    this.stock = product.stock || 0;
    this.status = product.status || "In Stock";
    this.active = product.active || "Yes";
    this.category_id = product.category_id;
    this.subCategory_id = product.subCategory_id || null;
    this.prison_id = product.prison_id || null;
    this.mainImage = product.mainImage;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Generate product code based on category code
  static async generateProductCode(categoryId) {
    return new Promise((resolve, reject) => {
      // First get the category code
      db.query(
        "SELECT code FROM categories WHERE id = ?",
        [categoryId],
        (err, results) => {
          if (err) {
            console.error("Error fetching category code:", err);
            reject(err);
            return;
          }

          if (results.length === 0) {
            reject(new Error(`Category with ID ${categoryId} not found`));
            return;
          }

          const categoryCode = results[0].code;
          // Generate a random 4-digit number
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          // Create the product code
          const productCode = `P-${categoryCode}-${randomNum}`;
          resolve(productCode);
        }
      );
    });
  }

  // Create a new product
  static create(newProduct, result) {
    // Create a copy of the product data without additionalImages
    const productData = { ...newProduct };

    // Store additionalImages separately
    const additionalImages = productData.additionalImages || [];

    // Remove additionalImages from the data to be inserted into products table
    delete productData.additionalImages;

    // Ensure attributes is not included in the main INSERT query
    const attributes = productData.attributes || {};
    delete productData.attributes;

    // Generate product code if not provided
    const createProductWithCode = (productCodeToUse) => {
      // Add the product code to the data
      productData.productCode = productCodeToUse;

      db.query("INSERT INTO products SET ?", productData, (err, res) => {
        if (err) {
          console.error("Error creating product:", err);
          result(err, null);
          return;
        }

        const productId = res.insertId;
        let attributesAdded = false;
        let imagesAdded = false;

        // After creating the product, add attributes
        if (Object.keys(attributes).length > 0) {
          const attributeValues = Object.entries(attributes).map(
            ([key, value]) => [
              productId,
              key,
              typeof value === "object" ? JSON.stringify(value) : value,
            ]
          );

          const attributeQuery =
            "INSERT INTO product_attributes (product_id, attribute_key, attribute_value) VALUES ?";

          db.query(attributeQuery, [attributeValues], (attrErr) => {
            if (attrErr) {
              console.error("Error saving product attributes:", attrErr);
              // Don't fail the entire operation if attributes fail
            }
            attributesAdded = true;
            if (
              attributesAdded &&
              (imagesAdded || additionalImages.length === 0)
            ) {
              console.log("Created product:", { id: productId, ...newProduct });
              result(null, {
                id: productId,
                ...newProduct,
                productCode: productCodeToUse,
              });
            }
          });
        } else {
          attributesAdded = true;
        }

        // After creating the product, add additional images
        if (additionalImages.length > 0) {
          const imageValues = additionalImages.map((image, index) => [
            productId,
            image,
            index + 1,
          ]);

          const imageQuery =
            "INSERT INTO product_images (product_id, image_path, display_order) VALUES ?";

          db.query(imageQuery, [imageValues], (imgErr) => {
            if (imgErr) {
              console.error("Error saving product images:", imgErr);
              // Don't fail the entire operation if images fail
            }
            imagesAdded = true;
            if (attributesAdded && imagesAdded) {
              console.log("Created product:", { id: productId, ...newProduct });
              result(null, {
                id: productId,
                ...newProduct,
                productCode: productCodeToUse,
              });
            }
          });
        } else {
          imagesAdded = true;
        }

        // If no attributes or images to add, return immediately
        if (attributesAdded && imagesAdded) {
          console.log("Created product:", { id: productId, ...newProduct });
          result(null, {
            id: productId,
            ...newProduct,
            productCode: productCodeToUse,
          });
        }
      });
    };

    // If product code is provided, use it; otherwise generate one
    if (productData.productCode) {
      createProductWithCode(productData.productCode);
    } else {
      // Generate product code based on category
      this.generateProductCode(productData.category_id)
        .then((productCode) => {
          createProductWithCode(productCode);
        })
        .catch((err) => {
          console.error("Error generating product code:", err);
          result(err, null);
        });
    }
  }

  // Get all products
  static getAll(result) {
    db.query(
      `
      SELECT p.*, 
             c.nameEn as categoryName, c.code as categoryCode,
             s.nameEn as subCategoryName,
             pr.nameEn as prisonName, pr.nameSi as prisonNameSi,
             GROUP_CONCAT(DISTINCT pi.image_path) AS additional_images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subCategory_id = s.id
      LEFT JOIN prisons pr ON p.prison_id = pr.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
      (err, res) => {
        if (err) {
          console.error("Error retrieving products:", err);
          result(err, null);
          return;
        }

        // Process each product to handle additional images and attributes
        const productsWithDetails = res.map((product) => {
          // Convert additional_images string to array
          if (product.additional_images) {
            product.additionalImages = product.additional_images.split(",");
            delete product.additional_images;
          } else {
            product.additionalImages = [];
          }

          return product;
        });

        // Fetch attributes for all products
        const productIds = res.map((p) => p.id);
        if (productIds.length > 0) {
          db.query(
            "SELECT product_id, attribute_key, attribute_value FROM product_attributes WHERE product_id IN (?)",
            [productIds],
            (attrErr, attrRes) => {
              if (attrErr) {
                console.error("Error retrieving product attributes:", attrErr);
                // Return products without attributes
                result(null, productsWithDetails);
                return;
              }

              // Group attributes by product_id
              const attributesByProduct = {};
              attrRes.forEach((attr) => {
                if (!attributesByProduct[attr.product_id]) {
                  attributesByProduct[attr.product_id] = {};
                }

                // Try to parse JSON for array/object values
                try {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    JSON.parse(attr.attribute_value);
                } catch (e) {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    attr.attribute_value;
                }
              });

              // Add attributes to each product
              productsWithDetails.forEach((product) => {
                product.attributes = attributesByProduct[product.id] || {};
              });

              result(null, productsWithDetails);
            }
          );
        } else {
          result(null, productsWithDetails);
        }
      }
    );
  }

  // Find product by ID
  static findById(productId, result) {
    db.query(
      `
      SELECT p.*, 
             c.nameEn as categoryName, c.code as categoryCode,
             s.nameEn as subCategoryName,
             pr.nameEn as prisonName, pr.nameSi as prisonNameSi,
             GROUP_CONCAT(DISTINCT pi.image_path) AS additional_images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subCategory_id = s.id
      LEFT JOIN prisons pr ON p.prison_id = pr.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `,
      productId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving product:", err);
          result(err, null);
          return;
        }

        if (res.length) {
          const product = res[0];

          // Convert additional_images string to array
          if (product.additional_images) {
            product.additionalImages = product.additional_images.split(",");
            delete product.additional_images;
          } else {
            product.additionalImages = [];
          }

          // Get product attributes
          db.query(
            "SELECT attribute_key, attribute_value FROM product_attributes WHERE product_id = ?",
            [productId],
            (attrErr, attrRes) => {
              if (attrErr) {
                console.error("Error retrieving product attributes:", attrErr);
                // Return product without attributes
                result(null, product);
                return;
              }

              // Build attributes object
              product.attributes = {};
              attrRes.forEach((attr) => {
                // Try to parse JSON for array/object values
                try {
                  product.attributes[attr.attribute_key] = JSON.parse(
                    attr.attribute_value
                  );
                } catch (e) {
                  product.attributes[attr.attribute_key] = attr.attribute_value;
                }
              });

              result(null, product);
            }
          );
        } else {
          result({ kind: "not_found" }, null);
        }
      }
    );
  }

  // Update product
  static update(productId, product, result) {
    // Create a copy of the product data without additionalImages and attributes
    const productData = { ...product };

    // Store additionalImages and attributes separately
    const additionalImages = productData.additionalImages || [];
    const attributes = productData.attributes || {};

    // Remove additionalImages and attributes from the data to be updated
    delete productData.additionalImages;
    delete productData.attributes;

    db.query(
      "UPDATE products SET nameEn = ?, nameSi = ?, description = ?, price = ?, stock = ?, status = ?, active = ?, category_id = ?, subCategory_id = ?, prison_id = ?, mainImage = ?, updated_at = ? WHERE id = ?",
      [
        productData.nameEn,
        productData.nameSi,
        productData.description,
        productData.price,
        productData.stock,
        productData.status,
        productData.active,
        productData.category_id,
        productData.subCategory_id,
        productData.prison_id,
        productData.mainImage,
        new Date(),
        productId,
      ],
      (err, res) => {
        if (err) {
          console.error("Error updating product:", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Product not found
          result({ kind: "not_found" }, null);
          return;
        }

        let attributesUpdated = false;
        let imagesUpdated = false;

        // Update product attributes (delete old ones and insert new ones)
        if (Object.keys(attributes).length > 0) {
          // First delete existing attributes
          db.query(
            "DELETE FROM product_attributes WHERE product_id = ?",
            [productId],
            (delErr) => {
              if (delErr) {
                console.error("Error deleting old product attributes:", delErr);
                // Don't fail the entire operation if attribute deletion fails
              }

              // Then insert new attributes
              const attributeValues = Object.entries(attributes).map(
                ([key, value]) => [
                  productId,
                  key,
                  typeof value === "object" ? JSON.stringify(value) : value,
                ]
              );

              const attributeQuery =
                "INSERT INTO product_attributes (product_id, attribute_key, attribute_value) VALUES ?";

              db.query(attributeQuery, [attributeValues], (attrErr) => {
                if (attrErr) {
                  console.error(
                    "Error saving updated product attributes:",
                    attrErr
                  );
                  // Don't fail the entire operation if attributes fail
                }

                attributesUpdated = true;
                if (
                  attributesUpdated &&
                  (imagesUpdated || additionalImages.length === 0)
                ) {
                  console.log("Updated product:", {
                    id: productId,
                    ...product,
                  });
                  result(null, { id: productId, ...product });
                }
              });
            }
          );
        } else {
          // No attributes to update
          attributesUpdated = true;
        }

        // Update product images
        if (additionalImages.length > 0) {
          // First delete existing additional images
          db.query(
            "DELETE FROM product_images WHERE product_id = ?",
            [productId],
            (delErr) => {
              if (delErr) {
                console.error("Error deleting old product images:", delErr);
                // Don't fail the entire operation if image deletion fails
              }

              // Then insert new images
              const imageValues = additionalImages.map((image, index) => [
                productId,
                image,
                index + 1,
              ]);

              const imageQuery =
                "INSERT INTO product_images (product_id, image_path, display_order) VALUES ?";

              db.query(imageQuery, [imageValues], (imgErr) => {
                if (imgErr) {
                  console.error("Error saving updated product images:", imgErr);
                  // Don't fail the entire operation if images fail
                }

                imagesUpdated = true;
                if (attributesUpdated && imagesUpdated) {
                  console.log("Updated product:", {
                    id: productId,
                    ...product,
                  });
                  result(null, { id: productId, ...product });
                }
              });
            }
          );
        } else {
          // No images to update
          imagesUpdated = true;
        }

        // If no attributes or images to update, return immediately
        if (attributesUpdated && imagesUpdated) {
          console.log("Updated product:", { id: productId, ...product });
          result(null, { id: productId, ...product });
        }
      }
    );
  }

  // Delete product
  static delete(productId, result) {
    // Start a transaction to ensure all related data is deleted
    db.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        result(err, null);
        return;
      }

      // Delete product attributes
      db.query(
        "DELETE FROM product_attributes WHERE product_id = ?",
        [productId],
        (attrErr) => {
          if (attrErr) {
            return db.rollback(() => {
              console.error("Error deleting product attributes:", attrErr);
              result(attrErr, null);
            });
          }

          // Delete product images
          db.query(
            "DELETE FROM product_images WHERE product_id = ?",
            [productId],
            (imgErr) => {
              if (imgErr) {
                return db.rollback(() => {
                  console.error("Error deleting product images:", imgErr);
                  result(imgErr, null);
                });
              }

              // Delete product
              db.query(
                "DELETE FROM products WHERE id = ?",
                productId,
                (prodErr, res) => {
                  if (prodErr) {
                    return db.rollback(() => {
                      console.error("Error deleting product:", prodErr);
                      result(prodErr, null);
                    });
                  }

                  if (res.affectedRows == 0) {
                    // Product not found
                    return db.rollback(() => {
                      result({ kind: "not_found" }, null);
                    });
                  }

                  // Commit the transaction
                  db.commit((commitErr) => {
                    if (commitErr) {
                      return db.rollback(() => {
                        console.error(
                          "Error committing transaction:",
                          commitErr
                        );
                        result(commitErr, null);
                      });
                    }

                    console.log("Deleted product with id:", productId);
                    result(null, { id: productId });
                  });
                }
              );
            }
          );
        }
      );
    });
  }

  // Get products by category
  static findByCategory(categoryId, result) {
    db.query(
      `
      SELECT p.*, 
             c.nameEn as categoryName, c.code as categoryCode,
             s.nameEn as subCategoryName,
             pr.nameEn as prisonName, pr.nameSi as prisonNameSi,
             GROUP_CONCAT(DISTINCT pi.image_path) AS additional_images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subCategory_id = s.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN prisons pr ON p.prison_id = pr.id
      WHERE p.category_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
      categoryId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving products by category:", err);
          result(err, null);
          return;
        }

        const productsWithDetails = res.map((product) => {
          // Convert additional_images string to array
          if (product.additional_images) {
            product.additionalImages = product.additional_images.split(",");
            delete product.additional_images;
          } else {
            product.additionalImages = [];
          }

          return product;
        });

        // Fetch attributes for these products
        const productIds = res.map((p) => p.id);
        if (productIds.length > 0) {
          db.query(
            "SELECT product_id, attribute_key, attribute_value FROM product_attributes WHERE product_id IN (?)",
            [productIds],
            (attrErr, attrRes) => {
              if (attrErr) {
                console.error("Error retrieving product attributes:", attrErr);
                // Return products without attributes
                result(null, productsWithDetails);
                return;
              }

              // Group attributes by product_id
              const attributesByProduct = {};
              attrRes.forEach((attr) => {
                if (!attributesByProduct[attr.product_id]) {
                  attributesByProduct[attr.product_id] = {};
                }

                // Try to parse JSON for array/object values
                try {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    JSON.parse(attr.attribute_value);
                } catch (e) {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    attr.attribute_value;
                }
              });

              // Add attributes to each product
              productsWithDetails.forEach((product) => {
                product.attributes = attributesByProduct[product.id] || {};
              });

              result(null, productsWithDetails);
            }
          );
        } else {
          result(null, productsWithDetails);
        }
      }
    );
  }

  // Get products by subcategory
  static findBySubCategory(subCategoryId, result) {
    db.query(
      `
      SELECT p.*, 
             c.nameEn as categoryName, c.code as categoryCode,
             s.nameEn as subCategoryName,
             GROUP_CONCAT(DISTINCT pi.image_path) AS additional_images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subCategory_id = s.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.subCategory_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
      subCategoryId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving products by subcategory:", err);
          result(err, null);
          return;
        }

        const productsWithDetails = res.map((product) => {
          // Convert additional_images string to array
          if (product.additional_images) {
            product.additionalImages = product.additional_images.split(",");
            delete product.additional_images;
          } else {
            product.additionalImages = [];
          }

          return product;
        });

        // Fetch attributes for these products
        const productIds = res.map((p) => p.id);
        if (productIds.length > 0) {
          db.query(
            "SELECT product_id, attribute_key, attribute_value FROM product_attributes WHERE product_id IN (?)",
            [productIds],
            (attrErr, attrRes) => {
              if (attrErr) {
                console.error("Error retrieving product attributes:", attrErr);
                // Return products without attributes
                result(null, productsWithDetails);
                return;
              }

              // Group attributes by product_id
              const attributesByProduct = {};
              attrRes.forEach((attr) => {
                if (!attributesByProduct[attr.product_id]) {
                  attributesByProduct[attr.product_id] = {};
                }

                // Try to parse JSON for array/object values
                try {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    JSON.parse(attr.attribute_value);
                } catch (e) {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    attr.attribute_value;
                }
              });

              // Add attributes to each product
              productsWithDetails.forEach((product) => {
                product.attributes = attributesByProduct[product.id] || {};
              });

              result(null, productsWithDetails);
            }
          );
        } else {
          result(null, productsWithDetails);
        }
      }
    );
  }

  // Get products by prison
  static findByPrison(prisonId, result) {
    db.query(
      `
      SELECT p.*, 
             c.nameEn as categoryName, c.code as categoryCode,
             s.nameEn as subCategoryName,
             pr.nameEn as prisonName, pr.nameSi as prisonNameSi,
             GROUP_CONCAT(DISTINCT pi.image_path) AS additional_images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subCategory_id = s.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN prisons pr ON p.prison_id = pr.id
      WHERE p.prison_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
      prisonId,
      (err, res) => {
        if (err) {
          console.error("Error retrieving products by prison:", err);
          result(err, null);
          return;
        }

        const productsWithDetails = res.map((product) => {
          // Convert additional_images string to array
          if (product.additional_images) {
            product.additionalImages = product.additional_images.split(",");
            delete product.additional_images;
          } else {
            product.additionalImages = [];
          }

          return product;
        });

        // Fetch attributes for these products
        const productIds = res.map((p) => p.id);
        if (productIds.length > 0) {
          db.query(
            "SELECT product_id, attribute_key, attribute_value FROM product_attributes WHERE product_id IN (?)",
            [productIds],
            (attrErr, attrRes) => {
              if (attrErr) {
                console.error("Error retrieving product attributes:", attrErr);
                // Return products without attributes
                result(null, productsWithDetails);
                return;
              }

              // Group attributes by product_id
              const attributesByProduct = {};
              attrRes.forEach((attr) => {
                if (!attributesByProduct[attr.product_id]) {
                  attributesByProduct[attr.product_id] = {};
                }

                // Try to parse JSON for array/object values
                try {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    JSON.parse(attr.attribute_value);
                } catch (e) {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    attr.attribute_value;
                }
              });

              // Add attributes to each product
              productsWithDetails.forEach((product) => {
                product.attributes = attributesByProduct[product.id] || {};
              });

              result(null, productsWithDetails);
            }
          );
        } else {
          result(null, productsWithDetails);
        }
      }
    );
  }

  // Search products
  static search(searchTerm, result) {
    const searchPattern = `%${searchTerm}%`;
    db.query(
      `
      SELECT p.*, 
             c.nameEn as categoryName, c.code as categoryCode,
             s.nameEn as subCategoryName,
             pr.nameEn as prisonName, pr.nameSi as prisonNameSi,
             GROUP_CONCAT(DISTINCT pi.image_path) AS additional_images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subCategory_id = s.id
      LEFT JOIN prisons pr ON p.prison_id = pr.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.nameEn LIKE ? 
         OR p.nameSi LIKE ? 
         OR p.description LIKE ? 
         OR p.productCode LIKE ?
         OR c.nameEn LIKE ?
         OR c.nameSi LIKE ?
         OR s.nameEn LIKE ?
         OR s.nameSi LIKE ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
      [
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
      ],
      (err, res) => {
        if (err) {
          console.error("Error searching products:", err);
          result(err, null);
          return;
        }

        const productsWithDetails = res.map((product) => {
          // Convert additional_images string to array
          if (product.additional_images) {
            product.additionalImages = product.additional_images.split(",");
            delete product.additional_images;
          } else {
            product.additionalImages = [];
          }

          return product;
        });

        // Fetch attributes for these products
        const productIds = res.map((p) => p.id);
        if (productIds.length > 0) {
          db.query(
            "SELECT product_id, attribute_key, attribute_value FROM product_attributes WHERE product_id IN (?)",
            [productIds],
            (attrErr, attrRes) => {
              if (attrErr) {
                console.error("Error retrieving product attributes:", attrErr);
                // Return products without attributes
                result(null, productsWithDetails);
                return;
              }

              // Group attributes by product_id
              const attributesByProduct = {};
              attrRes.forEach((attr) => {
                if (!attributesByProduct[attr.product_id]) {
                  attributesByProduct[attr.product_id] = {};
                }

                // Try to parse JSON for array/object values
                try {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    JSON.parse(attr.attribute_value);
                } catch (e) {
                  attributesByProduct[attr.product_id][attr.attribute_key] =
                    attr.attribute_value;
                }
              });

              // Add attributes to each product
              productsWithDetails.forEach((product) => {
                product.attributes = attributesByProduct[product.id] || {};
              });

              result(null, productsWithDetails);
            }
          );
        } else {
          result(null, productsWithDetails);
        }
      }
    );
  }
}

module.exports = Product;
