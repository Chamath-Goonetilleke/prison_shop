import axios from "axios";

// Define base API URL based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/orders"
    : "http://localhost:8080/api/orders";

const orderService = {
  // Create a new order
  createOrder: async (orderData, token) => {
    try {
      // Create form data for payment slip upload
      const formData = new FormData();

      // Add payment slip if provided
      if (orderData.payment_slip) {
        formData.append("payment_slip", orderData.payment_slip);
      }

      // Add customer information
      formData.append("customer_name", orderData.customer_name);
      formData.append("customer_email", orderData.customer_email);
      formData.append("customer_phone", orderData.customer_phone);
      formData.append("delivery_address", orderData.delivery_address);
      formData.append("total_amount", orderData.total_amount);

      // Add customer_id if available
      if (orderData.customer_id) {
        formData.append("customer_id", orderData.customer_id);
      }

      // Convert cart items to JSON and add to form data
      if (orderData.items) {
        formData.append("items", JSON.stringify(orderData.items));
      }

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      // Add authentication token if provided
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(API_URL, formData, { headers });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Get orders by customer email
  getOrdersByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/customer/${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id, token) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_URL}/${id}`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },

  // Get all orders for the logged-in user
  getUserOrders: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },
};

export default orderService;
