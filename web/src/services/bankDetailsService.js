import axios from "axios";

// Define base API URL based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/bank-details"
    : "http://localhost:8080/api/bank-details";

const bankDetailsService = {
  // Get active bank details for checkout
  getActiveBankDetails: async () => {
    try {
      const response = await axios.get(`${API_URL}/active`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bank details:", error);
      throw error;
    }
  },
};

export default bankDetailsService;
