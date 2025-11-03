import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, X, ShoppingCart } from "lucide-react";
import WishlistItemActions from "./WishlistItemActions";

const WishlistMobileCard = ({
  products,
  cartItems,
  processingItems,
  setProcessingItems,
}) => {
  const getCartStatus = (productId) => {
    return cartItems.some(
      (item) => item._id === productId || item.product?._id === productId,
    );
  };

  return (
    <div className="md:hidden">
      <div className="space-y-3 p-3">
        {products.map((product) => {
          const isInCart = getCartStatus(product._id);
          const isProcessing = processingItems[product._id];
          const isOutOfStock = product.countInStock === 0;

          return (
            <Card key={product._id} className="p-3 relative">
              <div className="flex gap-3">
                <ProductImage product={product} />
                <div className="flex-1 min-w-0">
                  <ProductHeader product={product} />
                  <ProductDetails product={product} />
                  <CartStatusBadge isInCart={isInCart} />
                  <WishlistItemActions
                    product={product}
                    isInCart={isInCart}
                    isProcessing={isProcessing}
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
      className="w-20 h-20 object-cover rounded-lg border"
    />
    <Button
      asChild
      size="icon"
      variant="secondary"
      className="absolute top-0.5 right-0.5 w-6 h-6 cursor-pointer rounded-full bg-white/90 backdrop-blur-sm border shadow-sm"
    >
      <Link to={`/product/${product._id}`}>
        <Eye className="w-3 h-3" />
      </Link>
    </Button>
  </div>
);

const ProductHeader = ({ product }) => (
  <div className="flex justify-between items-start mb-1">
    <h3 className="font-medium text-gray-900 text-base line-clamp-2 flex-1 pr-2">
      {product.name}
    </h3>
    <RemoveButton product={product} />
  </div>
);

const RemoveButton = ({ product, onRemove }) => (
  <Button
    onClick={() => {
      onRemove(product._id, product.name);
    }}
    variant="ghost"
    size="sm"
    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer flex-shrink-0 p-1 h-7 w-7 min-w-0"
  >
    <X className="w-3 h-3" />
  </Button>
);

const ProductDetails = ({ product }) => (
  <>
    <p className="text-xs text-gray-500 mb-2">
      {product.category?.name || "Uncategorized"}
    </p>
    <div className="flex items-center justify-between mb-2">
      <ProductPrice product={product} />
      <StockBadge isOutOfStock={product.countInStock === 0} />
    </div>
  </>
);

const ProductPrice = ({ product }) => (
  <div className="flex flex-col">
    <span
      className={`font-semibold ${
        product.salePrice ? "text-green-600" : "text-gray-900"
      }`}
    >
      ${(product.salePrice || product.price).toFixed(2)}
    </span>
    {product.salePrice && (
      <span className="text-xs text-gray-500 line-through">
        ${product.price.toFixed(2)}
      </span>
    )}
  </div>
);

const StockBadge = ({ isOutOfStock }) => (
  <Badge
    variant={isOutOfStock ? "destructive" : "default"}
    className={`text-xs ${
      !isOutOfStock ? "bg-green-100 text-green-800 border-0" : "border-0"
    }`}
  >
    {isOutOfStock ? "Out" : "In Stock"}
  </Badge>
);

const CartStatusBadge = ({ isInCart }) => (
  <div className="flex items-center justify-between mb-2">
    <Badge
      variant={isInCart ? "default" : "secondary"}
      className={`text-xs ${
        isInCart ? "bg-green-100 text-green-800 border-0" : "border-0"
      }`}
    >
      <ShoppingCart className="w-3 h-3 mr-1" />
      {isInCart ? "In Cart" : "Not in Cart"}
    </Badge>
  </div>
);

export default WishlistMobileCard;
