import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Minus, Plus } from "lucide-react";
import CartActions from "./CartActions";

const CartTable = ({
  products,
  cartItems,
  setProcessingItems,
  onQuantityChange,
}) => {
  const getCartStatus = (productId) => {
    return cartItems.some((item) => {
      return item._id === productId || item.product?._id === productId;
    });
  };

  const getCartItem = (productId) => {
    return cartItems.find(
      (item) => item._id === productId || item.product?._id === productId,
    );
  };

  const calculateSubtotal = (product, cartItem) => {
    if (!cartItem) return 0;
    const price = product.salePrice || product.price;
    return price * cartItem.quantity;
  };

  return (
    <div className="hidden lg:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-[400px] font-semibold text-gray-900">
              Product
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-900">
              Price
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-900">
              Quantity
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-900">
              SubTotal
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-900">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const cartItem = getCartItem(product._id);
            const isInCart = getCartStatus(product._id);
            const subtotal = calculateSubtotal(product, cartItem);
            return (
              <TableRow
                key={product._id}
                className="group hover:bg-gray-50/50 border-b"
              >
                <TableCell>
                  <ProductInfo product={product} />
                </TableCell>
                <TableCell>
                  <ProductPrice product={product} />
                </TableCell>
                <TableCell>
                  <StockQuantity
                    product={product}
                    isInCart={isInCart}
                    cartItem={cartItem}
                    onQuantityChange={onQuantityChange}
                  />
                </TableCell>
                <TableCell>
                  <CartSubtotal isInCart={isInCart} subtotal={subtotal} />
                </TableCell>
                <TableCell>
                  <CartActions
                    product={product}
                    setProcessingItems={setProcessingItems}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const ProductInfo = ({ product }) => (
  <div className="flex items-center gap-4">
    <div className="relative flex-shrink-0">
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-lg border"
      />
      <Button
        asChild
        size="icon"
        variant="secondary"
        className="absolute top-1 right-1 w-6 h-6 cursor-pointer rounded-full bg-white/90 backdrop-blur-sm border shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
      >
        <Link to={`/product/${product._id}`}>
          <Eye className="w-3 h-3" />
        </Link>
      </Button>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {product.category?.name || "Uncategorized"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ProductPrice = ({ product }) => (
  <div className="text-center">
    <div className="flex flex-col items-center gap-1">
      <span
        className={`font-semibold ${
          product.salePrice ? "text-green-600" : "text-gray-900"
        }`}
      >
        ${(product.salePrice || product.price).toFixed(2)}
      </span>
      {product.salePrice && (
        <span className="text-sm text-gray-500 line-through">
          ${product.price.toFixed(2)}
        </span>
      )}
    </div>
  </div>
);

const StockQuantity = ({ product, isInCart, cartItem, onQuantityChange }) => {
  if (!isInCart || !cartItem) {
    return (
      <div className="flex justify-center">
        <Badge variant="secondary" className="border-0">
          Not in Cart
        </Badge>
      </div>
    );
  }

  const currentQuantity = cartItem.quantity;
  const maxStock = product.countInStock;

  const handleQuantityChange = (change) => {
    if (onQuantityChange) {
      onQuantityChange(product._id, change);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={currentQuantity <= 1}
              className="w-10 h-10 flex items-center justify-center border cursor-pointer border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-semibold text-lg">
              {currentQuantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={currentQuantity >= maxStock}
              className="w-10 h-10 flex items-center justify-center border cursor-pointer border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          Max: {maxStock} in stock
        </div>
      </div>
    </div>
  );
};

const CartSubtotal = ({ isInCart, subtotal }) => (
  <div className="flex justify-center">
    {isInCart && subtotal > 0 ? (
      <div className="text-center">
        <div className="font-semibold text-gray-900">
          ${subtotal.toFixed(2)}
        </div>
      </div>
    ) : (
      <Badge variant="outline" className="text-gray-500">
        -
      </Badge>
    )}
  </div>
);

export default CartTable;
