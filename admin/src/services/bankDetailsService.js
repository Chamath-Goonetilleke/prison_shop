import axios from "axios";

// Define base API URL based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/bank-details"
    : "http://localhost:8080/api/bank-details";

const bankDetailsService = {
  // Get all bank details
  getAllBankDetails: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching bank details:", error);
      throw error;
    }
  },

  // Get bank details by ID
  getBankDetailsById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bank details ${id}:`, error);
      throw error;
    }
  },

  // Create new bank details
  createBankDetails: async (bankDetailsData) => {
    try {
      const response = await axios.post(API_URL, bankDetailsData);
      return response.data;
    } catch (error) {
      console.error("Error creating bank details:", error);
      throw error;
    }
  },

  // Update bank details
  updateBankDetails: async (id, bankDetailsData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, bankDetailsData);
      return response.data;
    } catch (error) {
      console.error(`Error updating bank details ${id}:`, error);
      throw error;
    }
  },

  // Delete bank details
  deleteBankDetails: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting bank details ${id}:`, error);
      throw error;
    }
  },
};

export default bankDetailsService;
