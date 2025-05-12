import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/management/users"
    : "http://localhost:8080/api/management/users";
const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Block/unblock a user
  toggleUserBlockStatus: async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.patch(
        `${BASE_URL}/${userId}/block`,
        { isBlocked: !isBlocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  // Get user by ID (for future use)
  getUserById: async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${BASE_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },
};

export default userService;
