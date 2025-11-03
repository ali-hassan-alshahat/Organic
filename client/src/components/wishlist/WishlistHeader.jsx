import React from "react";
import { Link } from "react-router-dom";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

const WishlistHeader = ({ productsCount }) => {
  return (
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
            {productsCount > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({productsCount} {productsCount === 1 ? "item" : "items"})
              </span>
            )}
          </CardTitle>
        </div>
        {productsCount > 0 && (
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
  );
};

export default WishlistHeader;
