import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, X, Minus, Plus, ShoppingCart } from "lucide-react";
import WishlistItemActions from "./WishlistItemActions";

const WishlistCard = ({
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
    <div className="hidden md:block lg:hidden">
      <div className="space-y-4 p-4">
        {products.map((product) => {
          const isInCart = getCartStatus(product._id);
          const isProcessing = processingItems[product._id];
          const isOutOfStock = product.countInStock === 0;

          return (
            <Card key={product._id} className="p-4">
              <div className="flex gap-4">
                <ProductImage product={product} />
                <div className="flex-1 min-w-0">
                  <ProductHeader product={product} />
                  <ProductDetails product={product} />
                  <ProductBadges
                    isOutOfStock={isOutOfStock}
                    isInCart={isInCart}
                  />
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

const ProductHeader = ({ product }) => (
  <div className="flex justify-between items-start mb-2">
    <h3 className="font-medium text-gray-900 text-lg line-clamp-2 flex-1">
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
    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer ml-2 flex-shrink-0"
  >
    <X className="w-4 h-4" />
  </Button>
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

const ProductBadges = ({ isOutOfStock, isInCart }) => (
  <div className="flex gap-2 mb-4">
    <Badge
      variant={isOutOfStock ? "destructive" : "default"}
      className={
        !isOutOfStock ? "bg-green-100 text-green-800 border-0" : "border-0"
      }
    >
      {isOutOfStock ? "Out of Stock" : "In Stock"}
    </Badge>
    <Badge
      variant={isInCart ? "default" : "secondary"}
      className={isInCart ? "bg-green-100 text-green-800 border-0" : "border-0"}
    >
      {isInCart ? "In Cart" : "Not in Cart"}
    </Badge>
  </div>
);

export default WishlistCard;
