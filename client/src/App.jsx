import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import About from "./pages/About";
import { Contact } from "lucide-react";
import Faq from "./pages/Faq";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "./rtk/slices/authSlice";
import { fetchCart, switchToGuestCart } from "./rtk/slices/cartSlice";
import { fetchWishlist } from "./rtk/slices/wishlistSlice";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (token && user) {
      dispatch(fetchCart());
    } else {
      dispatch(switchToGuestCart());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);
  let routers = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        { path: "/shop", element: <Shop /> },
        { path: "/blog", element: <Blog /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "/faq", element: <Faq /> },
        { path: "/product/:id", element: <ProductDetails /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/admin/login", element: <AdminLogin /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routers} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--main-primary, #059669)",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
          success: {
            duration: 3000,
            style: {
              background: "var(--main-primary, #059669)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "var(--main-primary, #059669)",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "var(--hard-primary, #dc2626)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "var(--hard-primary, #dc2626)",
            },
          },
        }}
      />
    </>
  );
}

export default App;
