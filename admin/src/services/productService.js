import axios from "axios";

// Define base API URL based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/products"
    : "http://localhost:8080/api/products";

const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      // Create form data for file uploads
      const formData = new FormData();

      // Add main image (required)
      if (productData.mainImage) {
        formData.append("mainImage", productData.mainImage);
      }

      // Add additional images if any
      if (
        productData.additionalImages &&
        productData.additionalImages.length > 0
      ) {
        productData.additionalImages.forEach((image) => {
          formData.append("additionalImages", image);
        });
      }

      // Convert attributes object to JSON string
      if (productData.attributes) {
        formData.append("attributes", JSON.stringify(productData.attributes));
      }

      // Add all other product fields
      formData.append("nameEn", productData.nameEn);
      formData.append("nameSi", productData.nameSi);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock || 0);
      formData.append("status", productData.status || "In Stock");
      formData.append("active", productData.active || "Yes");
      formData.append("type", productData.type);
      // Find the category ID from the selected category or use the type directly
      formData.append(
        "category_id",
        productData.category_id || productData.category || ""
      );
      formData.append("subCategory_id", productData.subCategory || "");
      formData.append("prison_id", productData.prison_id || "");
      formData.append("description", productData.description || "");
      // Product code will be auto-generated on the server
      // formData.append("productCode", productData.productCode || "");

      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      // Create form data for file uploads
      const formData = new FormData();

      // Add main image if a new one is provided
      if (productData.mainImage && typeof productData.mainImage !== "string") {
        formData.append("mainImage", productData.mainImage);
      } else if (typeof productData.mainImage === "string") {
        // Pass existing image path
        formData.append("existingMainImage", productData.mainImage);
      }

      // Handle additional images
      if (
        productData.additionalImages &&
        productData.additionalImages.length > 0
      ) {
        const existingImages = [];
        const newImages = [];

        // Separate existing image paths from new File objects
        productData.additionalImages.forEach((image) => {
          if (typeof image === "string") {
            existingImages.push(image);
          } else {
            newImages.push(image);
          }
        });

        // Add existing image paths as JSON string
        if (existingImages.length > 0) {
          formData.append(
            "existingAdditionalImages",
            JSON.stringify(existingImages)
          );
        }

        // Add new images as files
        newImages.forEach((image) => {
          formData.append("additionalImages", image);
        });
      }

      // Convert attributes object to JSON string
      if (productData.attributes) {
        formData.append("attributes", JSON.stringify(productData.attributes));
      }

      // Add all other product fields
      formData.append("nameEn", productData.nameEn);
      formData.append("nameSi", productData.nameSi);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock || 0);
      formData.append("status", productData.status || "In Stock");
      formData.append("active", productData.active || "Yes");
      formData.append("type", productData.type);
      formData.append(
        "category_id",
        productData.category_id || productData.category || ""
      );
      formData.append("subCategory_id", productData.subCategory || "");
      formData.append("prison_id", productData.prison_id || "");
      formData.append("description", productData.description || "");
      // Product code will be auto-generated on the server
      // formData.append("productCode", productData.productCode || "");

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Get products by type
  getProductsByType: async (type) => {
    try {
      const response = await axios.get(`${API_URL}/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products of type ${type}:`, error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await axios.get(
        `${API_URL}/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching products:`, error);
      throw error;
    }
  },
};

export default productService;
