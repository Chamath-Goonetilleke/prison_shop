import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/custom-orders"
    : "http://localhost:8080/api/custom-orders";
// Create a new custom order
const createCustomOrder = async (customOrderData, token) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(API_URL, customOrderData, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get custom order by ID
const getCustomOrderById = async (orderId, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/${orderId}`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get custom orders by customer email
const getCustomOrdersByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/customer/${email}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get all custom orders for the logged-in user
const getUserCustomOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

const customOrderService = {
  createCustomOrder,
  getCustomOrderById,
  getCustomOrdersByEmail,
  getUserCustomOrders,
};

export default customOrderService;
