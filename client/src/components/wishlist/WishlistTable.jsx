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
import { Eye, ShoppingCart } from "lucide-react";
import WishlistItemActions from "./WishlistItemActions";

const WishlistTable = ({
  products,
  cartItems,
  processingItems,
  setProcessingItems,
}) => {
  const getCartStatus = (productId) => {
    return cartItems.some((item) => {
      return item._id === productId || item.product?._id === productId;
    });
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
              Stock
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-900">
              Cart Status
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-900">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isInCart = getCartStatus(product._id);
            const isProcessing = processingItems[product._id];
            const isOutOfStock = product.countInStock === 0;

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
                  <StockBadge isOutOfStock={isOutOfStock} />
                </TableCell>
                <TableCell>
                  <CartStatusBadge isInCart={isInCart} />
                </TableCell>
                <TableCell>
                  <WishlistItemActions
                    product={product}
                    isInCart={isInCart}
                    isProcessing={isProcessing}
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
      <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1">
        {product.category?.name || "Uncategorized"}
      </p>
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

const StockBadge = ({ isOutOfStock }) => (
  <div className="flex justify-center">
    <Badge
      variant={isOutOfStock ? "destructive" : "default"}
      className={
        !isOutOfStock
          ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
          : "border-0"
      }
    >
      {isOutOfStock ? "Out of Stock" : "In Stock"}
    </Badge>
  </div>
);

const CartStatusBadge = ({ isInCart }) => (
  <div className="flex justify-center">
    <Badge
      variant={isInCart ? "default" : "secondary"}
      className={
        isInCart
          ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
          : "border-0"
      }
    >
      <ShoppingCart className="w-3 h-3 mr-1" />
      {isInCart ? "In Cart" : "Not in Cart"}
    </Badge>
  </div>
);

export default WishlistTable;
