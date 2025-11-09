import CartCard from "@/components/cart/CartCard";
import CartEmpty from "@/components/cart/CartEmpty";
import CartHeader from "@/components/cart/CartHeader";
import CartMobileCard from "@/components/cart/CartMobileCard";
import CartTable from "@/components/cart/CartTable";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import {
  fetchCart,
  updateQuantity,
  removeFromCart,
} from "@/rtk/slices/cartSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CartSummary from "@/components/cart/CartSummary";

const Cart = () => {
  const [processingItems, setProcessingItems] = useState({});
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.cart.loading);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const products = cartItems
    .map((item) => {
      if (
        item.productId &&
        typeof item.productId === "object" &&
        item.productId._id
      ) {
        return item.productId;
      } else if (item._id) {
        return item;
      }
      return null;
    })
    .filter((product) => product && product._id);

  const handleQuantityChange = async (productId, change) => {
    try {
      const cartItem = cartItems.find(
        (item) =>
          item._id === productId ||
          item.product?._id === productId ||
          item.productId?._id === productId,
      );
      if (!cartItem) return;
      const currentQuantity = cartItem.quantity;
      const newQuantity = currentQuantity + change;
      const product = products.find((p) => p._id === productId);
      if (!product) return;
      if (newQuantity < 1) {
        await handleRemoveFromCart(productId);
        return;
      }
      if (newQuantity > product.countInStock) {
        toast.error(`Only ${product.countInStock} items available in stock`);
        return;
      }
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
      if (change > 0) {
        toast.success(`Quantity increased to ${newQuantity}`);
      } else {
        toast.success(`Quantity decreased to ${newQuantity}`);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      setProcessingItems((prev) => ({ ...prev, [productId]: true }));
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[var(--main-primary)]"></div>
        <p className="text-gray-600 font-medium">Loading Cart...</p>
      </div>
    );
  }

  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shopping Cart", href: "/cart" },
        ]}
      />
      <div className="center pt-8">
        <Card className="border-0 shadow-sm">
          <CartHeader productsCount={products.length} />
          <CardContent className="pt-6">
            {products.length === 0 ? (
              <CartEmpty />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <CartTable
                    products={products}
                    cartItems={cartItems}
                    processingItems={processingItems}
                    setProcessingItems={setProcessingItems}
                    onQuantityChange={handleQuantityChange}
                    onRemoveFromCart={handleRemoveFromCart}
                  />
                  <CartCard
                    products={products}
                    cartItems={cartItems}
                    processingItems={processingItems}
                    setProcessingItems={setProcessingItems}
                    onQuantityChange={handleQuantityChange}
                    onRemoveFromCart={handleRemoveFromCart}
                  />
                  <CartMobileCard
                    products={products}
                    cartItems={cartItems}
                    processingItems={processingItems}
                    setProcessingItems={setProcessingItems}
                    onQuantityChange={handleQuantityChange}
                    onRemoveFromCart={handleRemoveFromCart}
                  />
                </div>
                <div className="lg:col-span-4">
                  <CartSummary />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Cart;
