import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import {
  addItemToCart,
  addToCart,
  selectCanAddToCart,
} from "@/rtk/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  addToGuestWishlist,
  removeFromGuestWishlist,
} from "@/rtk/slices/wishlistSlice";
import { selectIsAuthenticated } from "@/rtk/slices/authSlice";
import toast from "react-hot-toast";
import { useQuickView } from "@/hooks/useQuickView";
import ProductImageGallery from "@/components/productDetails/ProductImageGallery";
import ProductInfo from "@/components/productDetails/ProductInfo";
import ProductActions from "@/components/productDetails/ProductActions";
import ProductReviews from "@/components/productDetails/ProductReviews";
import ProductSidebar from "@/components/productDetails/ProductSidebar";
import RelatedProducts from "@/components/productDetails/RelatedProducts";

const ProductDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { quickView, openQuickView, closeQuickView } = useQuickView();
  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];
  const isInWishlist = wishlistItems.some(
    (item) => item.productId?._id === id || item._id === id,
  );
  const canAddToCart = useSelector((state) =>
    product ? selectCanAddToCart(product._id, quantity)(state) : false,
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:8000/api/products/${id}`,
        );
        if (response.data.success) {
          setData(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch product");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err.response?.data?.message || "Product not found");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (addingToCart) return;
    if (quantity > product.countInStock) {
      toast.error(`Only ${product.countInStock} items available in stock`);
      return;
    }

    setAddingToCart(true);
    try {
      if (isAuthenticated) {
        await dispatch(
          addToCart({ productId: product._id, quantity: quantity }),
        ).unwrap();
        toast.success(`Added ${quantity} ${product.name} to cart successfully`);
      } else {
        const productWithQuantity = { ...product, quantity: quantity };
        dispatch(addItemToCart(productWithQuantity));
        toast.success(`Added ${quantity} ${product.name} to cart successfully`);
      }
      setQuantity(1); // Reset to 1 after adding
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error(
        error.payload || error.message || "Failed to add item to cart",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (addingToWishlist) return;

    setAddingToWishlist(true);
    try {
      if (!isAuthenticated) {
        if (isInWishlist) {
          dispatch(removeFromGuestWishlist(product._id));
          toast.success(`${product.name} removed from wishlist`);
        } else {
          dispatch(addToGuestWishlist(product));
          toast.success(`${product.name} added to wishlist`);
        }
      } else {
        if (isInWishlist) {
          await dispatch(removeFromWishlist(product._id)).unwrap();
          toast.success(`${product.name} removed from wishlist`);
        } else {
          await dispatch(addToWishlist(product._id)).unwrap();
          toast.success(`${product.name} added to wishlist`);
        }
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error(error.payload || "Something went wrong");
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (product && newQuantity >= 1 && newQuantity <= product.countInStock) {
      setQuantity(newQuantity);
    } else if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > product.countInStock) {
      setQuantity(product.countInStock);
      toast.error(`Maximum ${product.countInStock} items available`);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (product?.countInStock > 0) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[var(--main-primary)]"></div>
        <p className="text-gray-600 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="text-red-500 text-xl font-semibold">
          {error || "Product not found"}
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[var(--main-primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--hard-primary)] transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name, href: `/product/${product._id}` },
        ]}
      />
      <div className="w-full max-w-[100vw] py-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start py-4 mx-auto max-w-7xl">
          <ProductImageGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <div className="w-full">
            <ProductInfo product={product} />
            <ProductActions
              product={product}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              handleWishlistToggle={handleWishlistToggle}
              isInWishlist={isInWishlist}
              addingToWishlist={addingToWishlist}
              addingToCart={addingToCart}
              cartLoading={cartLoading}
              canAddToCart={canAddToCart}
            />
          </div>
        </div>
        <hr className="mx-auto max-w-7xl" />
        <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-8">
            <div>
              <ProductReviews reviews={product.reviews} />
            </div>
            <div>
              <ProductSidebar />
            </div>
          </div>
        </div>
        <RelatedProducts
          relatedProducts={relatedProducts}
          loading={loading}
          quickView={quickView}
          onQuickView={openQuickView}
          onCloseQuickView={closeQuickView}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
