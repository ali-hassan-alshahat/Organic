import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";

const WishlistEmpty = () => {
  return (
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
          <Button asChild variant="outline" className="cursor-pointer">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistEmpty;
