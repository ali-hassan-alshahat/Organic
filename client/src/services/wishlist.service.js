import { apiService } from "./api.service";

export const wishlistService = {
  async addToWishlist(productId) {
    try {
      const response = await apiService("/users/wishlist", {
        method: "POST",
        body: { productId },
      });
      return response;
    } catch (error) {
      console.error("Add to wishlist service error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async removeFromWishlist(productId) {
    try {
      const response = await apiService(`/users/wishlist/${productId}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error("Remove from wishlist service error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async getWishlist() {
    try {
      const response = await apiService("/users/wishlist", {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Get wishlist service error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async clearWishlist() {
    try {
      const response = await apiService("/users/wishlist", {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error("Clear wishlist service error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async moveToCart(productId) {
    try {
      const response = await apiService("/users/wishlist/move-to-cart", {
        method: "POST",
        body: { productId },
      });
      return response;
    } catch (error) {
      console.error("Move to cart service error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
};
