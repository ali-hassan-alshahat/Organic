import { apiService } from "./api.service";

export const authService = {
  async register(userData) {
    try {
      const response = await apiService("/users/register", {
        method: "POST",
        body: userData,
      });
      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async login(userData) {
    try {
      const response = await apiService("/users/login", {
        method: "POST",
        body: userData,
      });
      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
