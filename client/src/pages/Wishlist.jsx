import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/rtk/slices/wishlistSlice";
import { selectCartItems } from "@/rtk/slices/cartSlice";
import { selectIsAuthenticated } from "@/rtk/slices/authSlice";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import WishlistHeader from "../components/wishlist/WishlistHeader";
import WishlistEmpty from "../components/wishlist/WishlistEmpty";
import WishlistTable from "../components/wishlist/WishlistTable";
import WishlistCard from "../components/wishlist/WishlistCard";
import WishlistMobileCard from "../components/wishlist/WishlistMobileCard";

const Wishlist = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector(selectCartItems);
  const loading = useSelector((state) => state.wishlist.loading);
  const [processingItems, setProcessingItems] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

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
          <WishlistHeader productsCount={products.length} />

          <CardContent className="p-0">
            {products.length === 0 ? (
              <WishlistEmpty />
            ) : (
              <div className="overflow-hidden">
                <WishlistTable
                  products={products}
                  cartItems={cartItems}
                  processingItems={processingItems}
                  setProcessingItems={setProcessingItems}
                />
                <WishlistCard
                  products={products}
                  cartItems={cartItems}
                  processingItems={processingItems}
                  setProcessingItems={setProcessingItems}
                />
                <WishlistMobileCard
                  products={products}
                  cartItems={cartItems}
                  processingItems={processingItems}
                  setProcessingItems={setProcessingItems}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Wishlist;
