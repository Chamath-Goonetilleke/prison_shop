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

  // Check stock availability for cart items
  checkStockAvailability: async (cartItems) => {
    try {
      // Transform cart items to the format expected by the API
      const items = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const response = await axios.post(`${API_URL}/check-stock`, { items });
      return response.data;
    } catch (error) {
      console.error("Error checking stock availability:", error);
      throw error;
    }
  },
};

export default productService;
