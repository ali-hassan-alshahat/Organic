import { apiService } from "./api.service";

export const adminService = {
  async login(adminData) {
    try {
      const response = await apiService("/admin/login", {
        method: "POST",
        body: adminData,
      });
      if (response.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  getCurrentAdmin() {
    const admin = localStorage.getItem("adminUser");
    return admin ? JSON.parse(admin) : null;
  },

  isAdminAuthenticated() {
    return !!localStorage.getItem("adminToken");
  },
};
