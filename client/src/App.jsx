import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Shop from "./pages/Shop";
import Home from "./pages/Home";

function App() {
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
      ],
    },
  ]);
  return <RouterProvider router={routers} />;
}

export default App;
