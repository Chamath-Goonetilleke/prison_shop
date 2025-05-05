import axios from "axios";

// Define base API URLs based on environment
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api"
    : "http://localhost:8080/api";

const CATEGORY_API_URL = `${BASE_URL}/categories`;
const SUBCATEGORY_API_URL = `${BASE_URL}/subcategories`;

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  // Get all categories with products
  getAllProductCategories: async () => {
    try {
      const response = await axios.get(
        CATEGORY_API_URL + "/with-products/list"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get subcategories for a specific category
  getSubcategoriesByCategory: async (categoryId) => {
    try {
      const response = await axios.get(
        `${SUBCATEGORY_API_URL}/category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching subcategories for category ${categoryId}:`,
        error
      );
      throw error;
    }
  },

  // Get all subcategories
  getAllSubcategories: async () => {
    try {
      const response = await axios.get(SUBCATEGORY_API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching all subcategories:", error);
      throw error;
    }
  },
};

export default categoryService;
