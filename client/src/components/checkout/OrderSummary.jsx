import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function OrderSummary({
  subtotal = 0,
  onPaymentMethodChange,
  onCheckout,
  isFormValid = false,
}) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const { token } = useSelector((state) => state.auth);

  // Use token to determine authentication
  const isAuthenticated = !!token;

  // Calculate real subtotal from cart items
  const calculatedSubtotal = cartItems.reduce((total, item) => {
    const price =
      item.productId?.salePrice || item.productId?.price || item.price || 0;
    return total + price * item.quantity;
  }, 0);

  const finalSubtotal = subtotal || calculatedSubtotal;
  const shipping = 0; // Free shipping
  const total = finalSubtotal + shipping;

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed with checkout");
      return;
    }

    if (!isFormValid) {
      toast.error("Please complete the billing information first");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      if (onCheckout) {
        // Prepare items data properly for the backend
        const checkoutData = {
          paymentMethod,
          subtotal: finalSubtotal,
          total,
          items: cartItems.map((item) => {
            // Extract product ID correctly
            const productId = item._id || item.productId?._id || item.productId;

            return {
              productId: {
                _id: productId,
                name: item.productId?.name || item.name || "Unknown Product",
                price: item.productId?.price || item.price || 0,
                salePrice: item.productId?.salePrice || item.salePrice,
                image: item.productId?.image || item.image || "",
              },
              name: item.productId?.name || item.name || "Unknown Product",
              price: item.productId?.price || item.price || 0,
              salePrice: item.productId?.salePrice || item.salePrice,
              image: item.productId?.image || item.image || "",
              quantity: item.quantity,
              subtotal:
                (item.productId?.salePrice ||
                  item.productId?.price ||
                  item.price ||
                  0) * item.quantity,
            };
          }),
        };

        await onCheckout(checkoutData);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = isFormValid && paymentMethod && cartItems.length > 0;

  return (
    <Card className="p-6 h-fit sticky top-20">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cart Items Preview */}
        {cartItems.length > 0 && (
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Items ({cartItems.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cartItems.map((item, index) => (
                <div
                  key={item._id || item.productId?._id || `cart-item-${index}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600 truncate max-w-[120px]">
                    {item.productId?.name || item.name || "Unknown Product"} ×{" "}
                    {item.quantity}
                  </span>
                  <span className="font-semibold">
                    $
                    {(
                      (item.productId?.salePrice ||
                        item.productId?.price ||
                        item.price ||
                        0) * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Price Details */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">${finalSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className="text-green-600 font-semibold">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {/* Payment Method */}
        <div className="pt-3">
          <h3 className="font-semibold mb-2">Payment Method *</h3>

          <RadioGroup
            value={paymentMethod}
            onValueChange={handlePaymentMethodChange}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="cursor-pointer">
                Cash On Delivery
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="cursor-pointer">
                PayPal
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="cursor-pointer">
                Credit/Debit Card
              </Label>
            </div>
          </RadioGroup>
        </div>
        {/* Dynamic Warning Box */}
        <div className="border border-orange-300 bg-orange-50 text-orange-700 p-4 rounded-md mt-4 text-sm">
          <strong>NOTE</strong>
          <p>
            {!isFormValid ? (
              <>
                Fill in the{" "}
                <span className="font-semibold text-orange-900">
                  Billing Information
                </span>
              </>
            ) : !paymentMethod ? (
              <>
                Select a{" "}
                <span className="font-semibold text-orange-900">
                  Payment method
                </span>
              </>
            ) : (
              <>Ready to complete your order</>
            )}
          </p>
        </div>
        {/* Dynamic Buttons */}
        {!isFormValid && (
          <Button
            className="w-full bg-red-100 text-red-700 hover:bg-red-200"
            disabled
          >
            Complete Billing Information First
          </Button>
        )}
        {isFormValid && !paymentMethod && (
          <Button
            className="w-full bg-red-100 text-red-700 hover:bg-red-200"
            disabled
          >
            Select Payment Method
          </Button>
        )}
        {canProceed && (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </Button>
        )}
        {!isFormValid || !paymentMethod ? null : (
          <Button
            className="w-full bg-gray-400 text-white h-12 text-base"
            disabled
          >
            Proceed to checkout
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
