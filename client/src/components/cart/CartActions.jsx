import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, removeItem } from "@/rtk/slices/cartSlice";
import { selectIsAuthenticated } from "@/rtk/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const CartActions = ({ product, setProcessingItems }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemoveFromCart = async () => {
    const productId = product._id;
    setProcessingItems((prev) => ({ ...prev, [productId]: true }));

    try {
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
    } catch (error) {
      toast.error(
        error.payload || error.message || "Failed to remove from cart",
      );
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={handleRemoveFromCart}
        variant="outline"
        size="sm"
        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CartActions;
