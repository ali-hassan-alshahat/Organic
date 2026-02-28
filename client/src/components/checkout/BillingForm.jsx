import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function BillingForm({
  subtotal,
  onFormValidation,
  onOrderSubmit,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    country: "us",
    state: "",
    zipCode: "",
    email: "",
    phone: "",
    orderNotes: "",
  });
  const [isValid, setIsValid] = useState(false);

  // Use the correct selectors
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // FIX: Create a local isAuthenticated check since the selector might be broken
  const isAuthenticated = !!token;

  console.log("Auth state:", { user, token, isAuthenticated });

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    console.log("Auto-fill triggered:", { user, isAuthenticated });

    if (isAuthenticated && user) {
      // Extract first and last name from full name
      const nameParts = user.name?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      console.log("Setting form data with:", {
        firstName,
        lastName,
        email: user.email,
      });

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || "",
      }));
    }
  }, [user, isAuthenticated]);

  // Validate form whenever formData changes
  useEffect(() => {
    const formIsValid = validateFormSilent();
    setIsValid(formIsValid);
    if (onFormValidation) {
      onFormValidation(formIsValid, formData);
    }
  }, [formData]);

  const handleInputChange = (field, value) => {
    // Don't allow changing name and email if user is authenticated
    if (
      isAuthenticated &&
      (field === "firstName" || field === "lastName" || field === "email")
    ) {
      toast.error(
        "Name and email cannot be changed. Update your account settings instead.",
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateFormSilent = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "state",
      "zipCode",
      "email",
      "phone",
    ];
    return (
      requiredFields.every((field) => formData[field]?.trim() !== "") &&
      /\S+@\S+\.\S+/.test(formData.email)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFormSilent()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (onOrderSubmit) {
      onOrderSubmit({
        billingInfo: formData,
        subtotal,
        total: subtotal,
        userId: user?.id,
      });
    } else {
      toast.success("Billing information confirmed!");
    }
  };

  return (
    <Card className="lg:col-span-2 p-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Billing Information
        </CardTitle>
        {subtotal > 0 && (
          <p className="text-lg text-gray-600 mt-2">
            Order Subtotal:{" "}
            <span className="font-semibold text-green-600">
              ${subtotal.toFixed(2)}
            </span>
          </p>
        )}
        {isAuthenticated ? (
          <div className="space-y-1">
            <p className="text-sm text-green-600 flex items-center gap-1">
              ✓ Signed in as {user?.email}
            </p>
            <p className="text-xs text-gray-500">
              Your account information is pre-filled and secured
            </p>
          </div>
        ) : (
          <p className="text-sm text-orange-600 flex items-center gap-1">
            ⓘ You're checking out as a guest
          </p>
        )}
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Row 1 - Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="firstName" className="flex items-center gap-1">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Dianne"
                required
                readOnly={isAuthenticated}
                className={
                  isAuthenticated ? "bg-gray-50 cursor-not-allowed" : ""
                }
              />
              {isAuthenticated && (
                <p className="text-xs text-gray-500 mt-1">From your account</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="flex items-center gap-1">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Ressell"
                required
                readOnly={isAuthenticated}
                className={
                  isAuthenticated ? "bg-gray-50 cursor-not-allowed" : ""
                }
              />
              {isAuthenticated && (
                <p className="text-xs text-gray-500 mt-1">From your account</p>
              )}
            </div>
            <div>
              <Label htmlFor="company">
                Company <span className="text-gray-400">(optional)</span>
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Company Name"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="flex items-center gap-1">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="4140 Parker Rd. Allentown, New Mexico 31134"
              required
            />
          </div>

          {/* Row 3 - Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="country" className="flex items-center gap-1">
                Country / Region <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="United States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="eg">Egypt</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="state" className="flex items-center gap-1">
                State / Region <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.state}
                onValueChange={(value) => handleInputChange("state", value)}
              >
                <SelectTrigger
                  id="state"
                  className={formData.state ? "border-green-500" : ""}
                >
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                  <SelectItem value="il">Illinois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zipCode" className="flex items-center gap-1">
                Zip Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                placeholder="73301"
                required
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-1">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="customer1@gmail.com"
                required
                readOnly={isAuthenticated}
                className={
                  isAuthenticated ? "bg-gray-50 cursor-not-allowed" : ""
                }
              />
              {isAuthenticated && (
                <p className="text-xs text-gray-500 mt-1">From your account</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-1">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 123 456 7890"
                required
              />
            </div>
          </div>

          <hr />

          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-bold mb-4">Additional Information</h2>
            <div>
              <Label htmlFor="orderNotes">
                Order Notes <span className="text-gray-400">(optional)</span>
              </Label>
              <textarea
                id="orderNotes"
                value={formData.orderNotes}
                onChange={(e) =>
                  handleInputChange("orderNotes", e.target.value)
                }
                className="w-full min-h-[120px] border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Notes about your order, e.g. special notes for delivery"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base"
            disabled={!isValid}
          >
            {isValid
              ? "Confirm Billing Information"
              : "Please Fill All Required Fields"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
