import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import {
  fetchWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "@/rtk/slices/wishlistSlice";
import {
  addToCart,
  addFromWishlist,
  removeFromCart,
  selectCartItems,
} from "@/rtk/slices/cartSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { selectIsAuthenticated } from "@/rtk/slices/authSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Shadcn Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Wishlist = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
  const loading = useSelector((state) => state.wishlist.loading);
  const [processingItems, setProcessingItems] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

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
    const isInCart = !!existingCartItem;

    setProcessingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      if (isInCart) {
        if (isAuthenticated) {
          await dispatch(removeFromCart(productId)).unwrap();
        } else {
          const cartItemToRemove = cartItems.find(
            (item) => item._id === productId || item.product?._id === productId,
          );
          if (cartItemToRemove) {
            const cartItemId =
              cartItemToRemove._id || cartItemToRemove.cartItemId || productId;
            // Using removeItem from cartSlice
            import("@/rtk/slices/cartSlice").then(({ removeItem }) => {
              dispatch(removeItem(cartItemId));
            });
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

  const products = wishlistItems
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

  const getCartStatus = (productId) => {
    return cartItems.some((item) => {
      return item._id === productId || item.product?._id === productId;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[var(--main-primary)]"></div>
        <p className="text-gray-600 font-medium">Loading Wishlist...</p>
      </div>
    );
  }

  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wishlist", href: "/wishlist" },
        ]}
      />

      <div className="center py-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="md:hidden cursor-pointer"
                >
                  <Link to="/shop">
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
                <CardTitle className="text-2xl font-bold text-gray-900 flex flex-col items-center gap-2 sm:items-start">
                  <div>My Wishlist</div>
                  {products.length > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({products.length}{" "}
                      {products.length === 1 ? "item" : "items"})
                    </span>
                  )}
                </CardTitle>
              </div>
              {products.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="hidden md:flex cursor-pointer"
                  >
                    <Link to="/shop">
                      <Plus className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="md:hidden cursor-pointer"
                  >
                    <Link to="/shop">
                      <Plus className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {products.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start adding products you love to your wishlist
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      asChild
                      className="bg-[var(--main-primary)] hover:bg-[var(--hard-primary)] cursor-pointer"
                    >
                      <Link to="/shop">
                        <Plus className="w-4 h-4 mr-2" />
                        Start Shopping
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <Link to="/">Back to Home</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden">
                {/* Desktop Table */}
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
                                  <h3 className="font-medium text-gray-900 line-clamp-2">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {product.category?.name || "Uncategorized"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <span
                                    className={`font-semibold ${
                                      product.salePrice
                                        ? "text-green-600"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    $
                                    {(
                                      product.salePrice || product.price
                                    ).toFixed(2)}
                                  </span>
                                  {product.salePrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Badge
                                  variant={
                                    isOutOfStock ? "destructive" : "default"
                                  }
                                  className={
                                    !isOutOfStock
                                      ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
                                      : "border-0"
                                  }
                                >
                                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => handleCartToggle(product)}
                                  disabled={isProcessing || isOutOfStock}
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
                                  onClick={() =>
                                    handleRemove(product._id, product.name)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Tablet View */}
                <div className="hidden md:block lg:hidden">
                  <div className="space-y-4 p-4">
                    {products.map((product) => {
                      const isInCart = getCartStatus(product._id);
                      const isProcessing = processingItems[product._id];
                      const isOutOfStock = product.countInStock === 0;

                      return (
                        <Card key={product._id} className="p-4">
                          <div className="flex gap-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-lg border"
                              />
                              {/* FIXED: Eye button for tablet */}
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
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-gray-900 text-lg line-clamp-2 flex-1">
                                  {product.name}
                                </h3>
                                <Button
                                  onClick={() =>
                                    handleRemove(product._id, product.name)
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer ml-2 flex-shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500 mb-3">
                                {product.category?.name || "Uncategorized"}
                              </p>

                              <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col">
                                  <span
                                    className={`font-semibold text-lg ${
                                      product.salePrice
                                        ? "text-green-600"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    $
                                    {(
                                      product.salePrice || product.price
                                    ).toFixed(2)}
                                  </span>
                                  {product.salePrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Badge
                                    variant={
                                      isOutOfStock ? "destructive" : "default"
                                    }
                                    className={
                                      !isOutOfStock
                                        ? "bg-green-100 text-green-800 border-0"
                                        : "border-0"
                                    }
                                  >
                                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                                  </Badge>
                                  <Badge
                                    variant={isInCart ? "default" : "secondary"}
                                    className={
                                      isInCart
                                        ? "bg-green-100 text-green-800 border-0"
                                        : "border-0"
                                    }
                                  >
                                    {isInCart ? "In Cart" : "Not in Cart"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleCartToggle(product)}
                                  disabled={isProcessing || isOutOfStock}
                                  variant={isInCart ? "destructive" : "default"}
                                  className={`flex-1 cursor-pointer${
                                    isInCart
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {isProcessing ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : isInCart ? (
                                    <>
                                      <Minus className="w-4 h-4 mr-2" />
                                      Remove from Cart
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-4 h-4 mr-2" />
                                      Add to Cart
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="space-y-3 p-3">
                    {products.map((product) => {
                      const isInCart = getCartStatus(product._id);
                      const isProcessing = processingItems[product._id];
                      const isOutOfStock = product.countInStock === 0;

                      return (
                        <Card key={product._id} className="p-3 relative">
                          {/* FIXED: Better mobile layout with proper spacing */}
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg border"
                              />
                              {/* FIXED: Eye button for mobile */}
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
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium text-gray-900 text-base line-clamp-2 flex-1 pr-2">
                                  {product.name}
                                </h3>
                                <Button
                                  onClick={() =>
                                    handleRemove(product._id, product.name)
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer flex-shrink-0 p-1 h-7 w-7 min-w-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">
                                {product.category?.name || "Uncategorized"}
                              </p>

                              <div className="flex items-center justify-between mb-2">
                                <div className="flex flex-col">
                                  <span
                                    className={`font-semibold ${
                                      product.salePrice
                                        ? "text-green-600"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    $
                                    {(
                                      product.salePrice || product.price
                                    ).toFixed(2)}
                                  </span>
                                  {product.salePrice && (
                                    <span className="text-xs text-gray-500 line-through">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Badge
                                    variant={
                                      isOutOfStock ? "destructive" : "default"
                                    }
                                    className={`text-xs ${
                                      !isOutOfStock
                                        ? "bg-green-100 text-green-800 border-0"
                                        : "border-0"
                                    }`}
                                  >
                                    {isOutOfStock ? "Out" : "In Stock"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <Badge
                                  variant={isInCart ? "default" : "secondary"}
                                  className={`text-xs ${
                                    isInCart
                                      ? "bg-green-100 text-green-800 border-0"
                                      : "border-0"
                                  }`}
                                >
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  {isInCart ? "In Cart" : "Not in Cart"}
                                </Badge>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleCartToggle(product)}
                                  disabled={isProcessing || isOutOfStock}
                                  variant={isInCart ? "destructive" : "default"}
                                  size="sm"
                                  className={`flex-1 text-sm cursor-pointer ${
                                    isInCart
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {isProcessing ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : isInCart ? (
                                    <>
                                      <Minus className="w-3 h-3 mr-1" />
                                      Remove
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add to Cart
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Wishlist;
