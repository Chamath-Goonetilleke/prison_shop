import axios from "axios";

const API_URL = "http://localhost:8080/api/subcategories";

const subCategoryService = {
  getAllSubCategories: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  },

  getSubCategoriesByCategory: async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching subcategories for category ${categoryId}:`,
        error
      );
      throw error;
    }
  },

  getSubCategory: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subcategory ${id}:`, error);
      throw error;
    }
  },

  createSubCategory: async (subCategoryData) => {
    try {
      const response = await axios.post(API_URL, subCategoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      throw error;
    }
  },

  updateSubCategory: async (id, subCategoryData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, subCategoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating subcategory ${id}:`, error);
      throw error;
    }
  },

  deleteSubCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting subcategory ${id}:`, error);
      throw error;
    }
  },
};

export default subCategoryService;
