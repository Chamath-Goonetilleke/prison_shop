import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/users"
    : "http://localhost:8080/api/users";

const userService = {
  // Get current user profile
  getUserProfile: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData, token) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Change user password
  changePassword: async (passwordData, token) => {
    try {
      const response = await axios.put(
        `${API_URL}/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },
};

export default userService;
