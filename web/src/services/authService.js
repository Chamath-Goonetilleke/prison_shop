import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/auth"
    : "http://localhost:8080/api/auth";

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  // Store token in localStorage
  setToken: (token) => {
    localStorage.setItem("userToken", token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem("userToken");
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem("userToken");
  },
};

export default authService;
