import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "@/rtk/slices/wishlistSlice";
import {
  addToCart,
  addFromWishlist,
  removeFromCart,
  removeItem,
} from "@/rtk/slices/cartSlice";
import { selectIsAuthenticated } from "@/rtk/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const WishlistItemActions = ({
  product,
  isInCart,
  isProcessing,
  setProcessingItems,
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemove = async (productId, productName) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success(`${productName} removed from wishlist`);
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleCartToggle = async (product) => {
    const productId = product._id;
    const existingCartItem = cartItems.find(
      (item) => item._id === productId || item.product?._id === productId,
    );

    setProcessingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      if (existingCartItem) {
        if (isAuthenticated) {
          await dispatch(removeFromCart(productId)).unwrap();
        } else {
          const cartItemToRemove = cartItems.find(
            (item) => item._id === productId || item.product?._id === productId,
          );
          if (cartItemToRemove) {
            const cartItemId =
              cartItemToRemove._id || cartItemToRemove.cartItemId || productId;
            dispatch(removeItem(cartItemId));
          }
        }
        toast.success(`Removed ${product.name} from cart`);
      } else {
        if (product.countInStock === 0) {
          toast.error(`${product.name} is out of stock`);
          return;
        }
        if (isAuthenticated) {
          await dispatch(
            addToCart({ productId: productId, quantity: 1 }),
          ).unwrap();
          toast.success(`Added ${product.name} to cart successfully`);
        } else {
          const productToAdd = {
            _id: product._id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            image: product.image,
            countInStock: product.countInStock,
            category: product.category,
          };
          dispatch(addFromWishlist(productToAdd));
          toast.success(`Added ${product.name} to cart successfully`);
        }
      }
    } catch (error) {
      toast.error(error.payload || error.message || "Failed to update cart");
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={() => handleCartToggle(product)}
        disabled={isProcessing || product.countInStock === 0}
        variant={isInCart ? "destructive" : "default"}
        size="sm"
        className={`cursor-pointer ${
          isInCart
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isProcessing ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isInCart ? (
          <>
            <Minus className="w-4 h-4 mr-1" />
            Remove
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-1" />
            Add to Cart
          </>
        )}
      </Button>
      <Button
        onClick={() => handleRemove(product._id, product.name)}
        variant="outline"
        size="sm"
        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default WishlistItemActions;
