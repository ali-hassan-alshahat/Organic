import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Minus, Plus } from "lucide-react";
import CartActions from "./CartActions";

const CartCard = ({
  products,
  cartItems,
  setProcessingItems,
  onQuantityChange,
}) => {
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
    <div className="hidden md:block lg:hidden">
      <div className="space-y-4 p-4">
        {products.map((product) => {
          const cartItem = getCartItem(product._id);
          const isInCart = !!cartItem;
          const isOutOfStock = product.countInStock === 0;
          const subtotal = calculateSubtotal(product, cartItem);

          return (
            <Card key={product._id} className="p-4">
              <div className="flex gap-4">
                <ProductImage product={product} />
                <div className="flex-1 min-w-0">
                  <ProductDetails product={product} />
                  <ProductBadges
                    isOutOfStock={isOutOfStock}
                    isInCart={isInCart}
                    quantity={cartItem?.quantity}
                    subtotal={subtotal}
                  />
                  <StockQuantity
                    product={product}
                    isInCart={isInCart}
                    cartItem={cartItem}
                    onQuantityChange={onQuantityChange}
                  />
                  <CartActions
                    product={product}
                    setProcessingItems={setProcessingItems}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const ProductImage = ({ product }) => (
  <div className="relative flex-shrink-0">
    <img
      src={product.image}
      alt={product.name}
      className="w-24 h-24 object-cover rounded-lg border"
    />
    <Button
      asChild
      size="icon"
      variant="secondary"
      className="absolute top-1 right-1 w-7 h-7 cursor-pointer rounded-full bg-white/90 backdrop-blur-sm border shadow-sm"
    >
      <Link to={`/product/${product._id}`}>
        <Eye className="w-3.5 h-3.5" />
      </Link>
    </Button>
  </div>
);

const ProductDetails = ({ product }) => (
  <>
    <p className="text-sm text-gray-500 mb-3">
      {product.category?.name || "Uncategorized"}
    </p>
    <div className="flex items-center justify-between mb-4">
      <ProductPrice product={product} />
    </div>
  </>
);

const ProductPrice = ({ product }) => (
  <div className="flex flex-col">
    <span
      className={`font-semibold text-lg ${
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
);

const ProductBadges = ({ isOutOfStock, isInCart, quantity, subtotal }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    <Badge
      variant={isOutOfStock ? "destructive" : "default"}
      className={
        !isOutOfStock ? "bg-green-100 text-green-800 border-0" : "border-0"
      }
    >
      {isOutOfStock ? "Out of Stock" : "In Stock"}
    </Badge>
    {isInCart && quantity && (
      <Badge className="bg-blue-100 text-blue-800 border-0">
        Qty: {quantity}
      </Badge>
    )}
    <Badge
      variant={isInCart ? "default" : "secondary"}
      className={isInCart ? "bg-green-100 text-green-800 border-0" : "border-0"}
    >
      {isInCart ? "In Cart" : "Not in Cart"}
    </Badge>
    {isInCart && subtotal > 0 && (
      <Badge className="bg-purple-100 text-purple-800 border-0">
        Subtotal: ${subtotal.toFixed(2)}
      </Badge>
    )}
  </div>
);

const StockQuantity = ({ product, isInCart, cartItem, onQuantityChange }) => {
  if (!isInCart || !cartItem) return null;

  const currentQuantity = cartItem.quantity;
  const maxStock = product.countInStock;

  const handleQuantityChange = (change) => {
    if (onQuantityChange) {
      onQuantityChange(product._id, change);
    }
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-gray-700 font-medium">Quantity:</span>
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
      <div className="text-sm text-gray-500">Max: {maxStock}</div>
    </div>
  );
};

export default CartCard;
