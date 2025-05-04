import axios from "axios";

// Define base API URL based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/prisons"
    : "http://localhost:8080/api/prisons";

const prisonService = {
  // Get all prisons
  getAllPrisons: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching prisons:", error);
      throw error;
    }
  },

  // Get active prisons
  getActivePrisons: async () => {
    try {
      const response = await axios.get(`${API_URL}/active`);
      return response.data;
    } catch (error) {
      console.error("Error fetching active prisons:", error);
      throw error;
    }
  },

  // Get prison by ID
  getPrisonById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prison ${id}:`, error);
      throw error;
    }
  },

  // Create new prison
  createPrison: async (prisonData) => {
    try {
      const response = await axios.post(API_URL, prisonData);
      return response.data;
    } catch (error) {
      console.error("Error creating prison:", error);
      throw error;
    }
  },

  // Update prison
  updatePrison: async (id, prisonData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, prisonData);
      return response.data;
    } catch (error) {
      console.error(`Error updating prison ${id}:`, error);
      throw error;
    }
  },

  // Delete prison
  deletePrison: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting prison ${id}:`, error);
      throw error;
    }
  },
};

export default prisonService;
