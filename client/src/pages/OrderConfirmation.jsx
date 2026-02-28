import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Loader,
} from "lucide-react";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const result = await response.json();
        setOrder(result.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      fetchOrder();
    } else {
      setLoading(false);
      setError("Order ID or authentication missing");
    }
  }, [orderId, token]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Loading Order Details
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch your order information...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {error ? "Error Loading Order" : "Order Not Found"}
            </h2>
            <p className="text-gray-600 mb-4">
              {error ||
                "We couldn't find your order details. Please check your order history."}
            </p>
            <div className="space-y-2">
              <Link to="/orders">
                <Button className="w-full">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
              </Link>
              <Button
                onClick={() => navigate("/shop")}
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    orderNumber,
    billingInfo,
    items = [],
    subtotal = 0,
    shippingFee = 0,
    taxAmount = 0,
    totalAmount = 0,
    orderStatus = "pending",
    paymentMethod,
    paymentStatus,
    createdAt,
    shippingTracking,
  } = order;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      processing: { variant: "default", label: "Processing" },
      shipped: { variant: "default", label: "Shipped" },
      delivered: { variant: "success", label: "Delivered" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: "Cash on Delivery",
      paypal: "PayPal",
      card: "Credit/Debit Card",
    };
    return methods[method] || method;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      paid: { variant: "success", label: "Paid" },
      failed: { variant: "destructive", label: "Failed" },
      refunded: { variant: "destructive", label: "Refunded" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "My Orders", href: "/orders" },
          {
            label: "Order Confirmation",
            href: `/order-confirmation/${orderId}`,
          },
        ]}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="center">
          {/* Success Header */}
          <Card className="mb-8 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Order Confirmed!
                  </h1>
                  <p className="text-gray-600">
                    Thank you for your purchase. Your order has been received
                    and is being processed.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {orderNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={item.product?._id || index}
                        className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          {item.product?.category && (
                            <p className="text-xs text-gray-400">
                              {item.product.category.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${item.subtotal.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${(item.salePrice || item.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shippingFee === 0
                          ? "Free"
                          : `$${shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    {taxAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">
                          ${taxAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Order Placed
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(createdAt)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(orderStatus)}
                    </div>

                    {/* Shipping Tracking Info */}
                    {shippingTracking?.trackingNumber && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Tracking Information
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Carrier:</span>{" "}
                            {shippingTracking.carrier}
                          </p>
                          <p>
                            <span className="font-medium">
                              Tracking Number:
                            </span>{" "}
                            {shippingTracking.trackingNumber}
                          </p>
                          {shippingTracking.trackingUrl && (
                            <a
                              href={shippingTracking.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Track Your Package
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order & Shipping Info */}
            <div className="space-y-6">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">
                      {getPaymentMethodText(paymentMethod)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <div className="mt-1">
                      {getPaymentStatusBadge(paymentStatus)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <div className="mt-1">{getStatusBadge(orderStatus)}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {billingInfo.firstName} {billingInfo.lastName}
                    </p>
                    <p className="text-gray-600">{billingInfo.address}</p>
                    <p className="text-gray-600">
                      {billingInfo.state} {billingInfo.zipCode}
                    </p>
                    <p className="text-gray-600">{billingInfo.country}</p>
                    <p className="text-gray-600">{billingInfo.phone}</p>
                    <p className="text-gray-600">{billingInfo.email}</p>
                    {billingInfo.company && (
                      <p className="text-gray-600">
                        Company: {billingInfo.company}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/orders">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View All Orders
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/shop">
                      <Home className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Need help?{" "}
                      <Link
                        to="/contact"
                        className="text-green-600 hover:underline"
                      >
                        Contact Support
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
