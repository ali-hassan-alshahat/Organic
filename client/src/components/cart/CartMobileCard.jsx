import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Minus, Plus, X } from "lucide-react";
import CartActions from "./CartActions";

const CartMobileCard = ({
  products,
  cartItems,
  onQuantityChange,
  setProcessingItems,
}) => {
  const getCartItem = (id) =>
    cartItems.find((item) => item._id === id || item.product?._id === id);

  const calcSubtotal = (product, item) =>
    (product.salePrice || product.price) * item.quantity;

  return (
    <div className="md:hidden">
      <div className="space-y-3 px-4 pb-6">
        {products.map((product, idx) => {
          const cartItem = getCartItem(product._id);
          if (!cartItem) return null;
          const subtotal = calcSubtotal(product, cartItem);
          return (
            <Card
              key={product._id}
              className="p-5 relative bg-white rounded-xl shadow-sm"
            >
              <CartActions
                product={product}
                setProcessingItems={setProcessingItems}
              />
              <div className="w-full flex justify-center mb-3">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                  <Button
                    asChild
                    size="icon"
                    variant="secondary"
                    className="absolute top-1 right-1 w-6 h-6 bg-white/90 shadow-sm rounded-full"
                  >
                    <Link to={`/product/${product._id}`}>
                      <Eye className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </div>
              <h3 className="text-center font-semibold text-gray-900 text-sm mb-1">
                {product.name}
              </h3>
              <div className="text-center mb-2">
                <span
                  className={`font-semibold ${
                    product.salePrice ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  ${(product.salePrice || product.price).toFixed(2)}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-gray-500 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex justify-center my-3">
                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full shadow-sm gap-4">
                  <button
                    onClick={() => onQuantityChange(product._id, -1)}
                    disabled={cartItem.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white disabled:opacity-40"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-semibold text-gray-800 text-lg">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => onQuantityChange(product._id, 1)}
                    disabled={cartItem.quantity >= product.countInStock}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="text-center font-semibold text-gray-900 text-base mb-4 flex flex-col">
                <span>${subtotal.toFixed(2)}</span>
                <span className="text-gray-600 text-sm">SubTotal</span>
              </div>
              {idx !== products.length - 1 && (
                <div className="border-t mt-1 pt-1 border-gray-200" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CartMobileCard;
