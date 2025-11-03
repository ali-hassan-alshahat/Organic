import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  registerUser,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  clearError,
} from "../rtk/slices/authSlice";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb.jsx";
import toast from "react-hot-toast";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors,
    setFocus,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const password = watch("password");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
    setFocus("name");
  }, [dispatch, setFocus]);

  // Clear auth errors when user starts typing
  const handleInputChange = (fieldName) => {
    if (authError) {
      dispatch(clearError());
    }
    clearErrors(fieldName);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data) => {
    try {
      const { ...registerData } = data;
      await dispatch(registerUser(registerData)).unwrap();
      toast.success("Account created successfully! 🎉");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Register", href: "/register" },
        ]}
      />
      <div className="flex items-center justify-center p-4 my-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transition-transform duration-300 hover:translate-y-[-5px]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">
              Join us today and start your journey
            </p>
          </div>
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span>⚠</span>
              {authError}
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                onChange={() => handleInputChange("name")}
                onKeyPress={handleKeyPress}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--main-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                onChange={() => handleInputChange("email")}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--main-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                onChange={() => handleInputChange("password")}
                onKeyPress={handleKeyPress}
                placeholder="Create a password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--main-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                onChange={() => handleInputChange("confirmPassword")}
                onKeyPress={handleKeyPress}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--main-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-[var(--main-primary)] cursor-pointer text-white py-4 rounded-lg font-semibold text-lg hover:from-[var(--main-primary)] hover:to-[var(--hard-primary)] transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[var(--main-primary)] font-semibold hover:text-[var(--hard-primary)] transition-colors duration-200"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
