import axios from "axios";

const ADMIN_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/management/admins"
    : "http://localhost:8080/api/management/admins";

const PRISON_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://prison-shop.vercel.app/api/prisons"
    : "http://localhost:8080/api/prisons";

const adminService = {
  // Get all admins
  getAllAdmins: async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(ADMIN_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  },

  // Get all prisons for dropdown
  getAllPrisons: async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(PRISON_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching prisons:", error);
      throw error;
    }
  },

  // Create a new admin
  createAdmin: async (adminData) => {
    try {
      const token = localStorage.getItem("adminToken");

      // Format the data for the API
      const requestData = {
        email: adminData.email,
        password: adminData.password,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: adminData.role,
        prisonId: adminData.prisonId || null,
        isActive: adminData.isActive !== undefined ? adminData.isActive : true, // Default to true if not specified
      };

      const response = await axios.post(ADMIN_BASE_URL, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating admin:", error);
      throw error;
    }
  },

  // Update an existing admin
  updateAdmin: async (adminId, adminData) => {
    try {
      const token = localStorage.getItem("adminToken");

      // Format the data for the API
      const requestData = {
        email: adminData.email,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: adminData.role,
        prisonId: adminData.prisonId || null,
        isActive: adminData.isActive,
      };

      // Only include password if it's provided
      if (adminData.password) {
        requestData.password = adminData.password;
      }

      const response = await axios.patch(
        `${ADMIN_BASE_URL}/${adminId}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating admin ${adminId}:`, error);
      throw error;
    }
  },

  // Delete an admin
  deleteAdmin: async (adminId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(`${ADMIN_BASE_URL}/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting admin ${adminId}:`, error);
      throw error;
    }
  },
};

export default adminService;
