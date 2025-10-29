import { apiService } from "./api.service";

export const wishlistService = {
  async addToWishlist(productId) {
    try {
      const response = await apiService("/wishlist", {
        method: "POST",
        body: { productId },
      });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async removeFromWishlist(productId) {
    try {
      const response = await apiService(`/wishlist/${productId}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async getWishlist() {
    try {
      const response = await apiService("/wishlist", {
        method: "GET",
      });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async clearWishlist() {
    try {
      const response = await apiService("/wishlist", {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async moveToCart(productId) {
    try {
      const response = await apiService("/wishlist/move-to-cart", {
        method: "POST",
        body: { productId },
      });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
};
