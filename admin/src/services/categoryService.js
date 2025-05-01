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

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(API_URL, categoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, categoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  // Get category attributes
  getCategoryAttributes: async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/${categoryId}/attributes`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching attributes for category ${categoryId}:`,
        error
      );
      throw error;
    }
  },

  // Add attribute to category
  addAttribute: async (categoryId, attributeData) => {
    try {
      const response = await axios.post(
        `${API_URL}/${categoryId}/attributes`,
        attributeData
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding attribute to category ${categoryId}:`, error);
      throw error;
    }
  },

  // Update attribute
  updateAttribute: async (attributeId, attributeData) => {
    try {
      const response = await axios.put(
        `${API_URL}/attributes/${attributeId}`,
        attributeData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating attribute ${attributeId}:`, error);
      throw error;
    }
  },

  // Delete attribute
  deleteAttribute: async (attributeId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/attributes/${attributeId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting attribute ${attributeId}:`, error);
      throw error;
    }
  },
};

export default categoryService;
