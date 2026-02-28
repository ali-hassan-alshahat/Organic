import { useState, useEffect } from "react";
import BillingForm from "@/components/checkout/BillingForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { clearCart } from "@/rtk/slices/cartSlice";

const Checkout = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [billingData, setBillingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const { user, token, isInitialized } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check authentication and cart
  useEffect(() => {
    if (isInitialized) {
      if (!token) {
        navigate("/login", { state: { from: "/checkout" } });
        return;
      }
    }
  }, [isInitialized, token, navigate, cartItems]);

  // Calculate subtotal from cart
  const subtotal = cartItems.reduce((total, item) => {
    const price =
      item.productId?.salePrice || item.productId?.price || item.price || 0;
    return total + price * item.quantity;
  }, 0);

  const handleFormValidation = (isValid, data) => {
    setIsFormValid(isValid);
    setBillingData(data);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCheckout = async (checkoutData) => {
    if (!token) {
      toast.error("Please login to complete your order");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (!billingData) {
      toast.error("Please complete billing information");
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data - SIMPLIFIED to match your backend
      const orderData = {
        billingInfo: billingData,
        paymentMethod: checkoutData.paymentMethod || paymentMethod,
        items: cartItems, // Send cart items directly as they are
        subtotal: checkoutData.subtotal || subtotal,
        totalAmount: checkoutData.total || subtotal,
        orderNotes: billingData.orderNotes || "",
      };

      console.log("Sending order to API:", orderData);

      // Call order API
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to create order");
      }

      if (!result.success) {
        throw new Error(result.message || "Order creation failed");
      }

      // Get order ID from response
      const orderId = result.data?.order?._id || result.data?._id;

      if (!orderId) {
        console.error("No order ID in response:", result);
        throw new Error("Order created but no order ID returned");
      }

      toast.success("Order placed successfully!");

      // Clear cart WITHOUT showing toast
      dispatch(clearCart());

      // Clear guest cart silently
      localStorage.removeItem("guestCart");

      // Navigate to order confirmation
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!token || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout", href: "/checkout" },
        ]}
      />
      <div className="center py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl w-full">
          {/* LEFT SIDE - BILLING FORM */}
          <BillingForm
            subtotal={subtotal}
            onFormValidation={handleFormValidation}
            onOrderSubmit={handleCheckout}
          />

          {/* RIGHT SIDE - SUMMARY */}
          <OrderSummary
            subtotal={subtotal}
            onPaymentMethodChange={handlePaymentMethodChange}
            onCheckout={handleCheckout}
            isFormValid={isFormValid}
          />
        </div>
      </div>
    </>
  );
};

export default Checkout;
