import axios from "axios";

const API_URL = "http://localhost:8080/api/custom-orders";

// Get all custom orders
const getAllCustomOrders = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get custom order by ID
const getCustomOrderById = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update custom order status
const updateCustomOrderStatus = async (id, statusData) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.put(`${API_URL}/${id}/status`, statusData, {
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
  getAllCustomOrders,
  getCustomOrderById,
  updateCustomOrderStatus,
};

export default customOrderService;
