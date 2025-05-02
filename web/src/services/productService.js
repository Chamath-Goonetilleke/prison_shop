import axios from "axios";

const API_URL = "https://prison-shop.vercel.app/api/products";

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

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error
      );
      throw error;
    }
  },

  // Get products by subcategory
  getProductsBySubcategory: async (subcategoryId) => {
    try {
      const response = await axios.get(
        `${API_URL}/subcategory/${subcategoryId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching products for subcategory ${subcategoryId}:`,
        error
      );
      throw error;
    }
  },

  // Search products
  searchProducts: async (searchTerm) => {
    try {
      const response = await axios.get(
        `${API_URL}/search?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },
};

export default productService;
