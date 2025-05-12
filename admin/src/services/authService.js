import axios from "axios";

// Define base API URL based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/auth/admin"
    : "http://localhost:8080/api/auth/admin";

const authService = {
  // Login admin user
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

  // Check if admin is authenticated
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ensure we're returning all the admin data that might be needed
      return response.data;
    } catch (error) {
      console.error("Auth check error:", error);
      throw error;
    }
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem("adminToken");
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem("adminToken");
  },

  // Set auth token
  setToken: (token) => {
    localStorage.setItem("adminToken", token);
  },
};

export default authService;
