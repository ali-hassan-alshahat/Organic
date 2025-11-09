import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CartSummary = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((acc, item) => {
    const price =
      item.productId?.salePrice ?? item.productId?.price ?? item.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <Card className="p-5 shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Cart Total</h3>
      <div className="space-y-4 text-gray-700">
        <div className="flex justify-between border-b pb-2">
          <span>Subtotal:</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>Shipping:</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
      <Button
        asChild
        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white h-12 text-base"
      >
        <Link to="/checkout">Proceed to checkout</Link>
      </Button>
    </Card>
  );
};

export default CartSummary;
