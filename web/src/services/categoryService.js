import axios from "axios";

const API_URL = "http://localhost:8080/api/categories";

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axios.get(API_URL);
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
        `http://localhost:8080/api/subcategories/category/${categoryId}`
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
      const response = await axios.get(
        "http://localhost:8080/api/subcategories"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all subcategories:", error);
      throw error;
    }
  },
};

export default categoryService;
