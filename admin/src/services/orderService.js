import axios from "axios";

// Define base API URL based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/orders"
    : "http://localhost:8080/api/orders";

const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id, status, adminNotes) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/status`, {
        status: status,
        admin_notes: adminNotes,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order status:`, error);
      throw error;
    }
  },
};

export default orderService;
