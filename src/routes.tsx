import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Forecasting from "./pages/Forecasting";
import DDSOP from "./pages/DDSOP";
import DDMRP from "./pages/DDMRP";
import DDOM from "./pages/DDOM";

// Root layout component to wrap all routes with AuthProvider
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// Main app layout for authenticated routes
const Layout = () => {
  return <Outlet />;
};

// Define the application routes using React Router v6 createBrowserRouter.
// This router configuration adds new routes for DDMRP and DDOM analytics dashboards
// while retaining existing routes for inventory, settings, forecasting, and DDSOP.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Wrap everything with AuthProvider
    errorElement: <NotFound />,
    children: [
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Inventory />, // Use Inventory as home page
          },
          {
            path: "inventory",
            element: <Inventory />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "forecasting",
            element: <Forecasting />,
          },
          {
            path: "ddmrp",
            element: <DDMRP />,
          },
          {
            path: "ddom",
            element: <DDOM />,
          },
          {
            path: "ddsop",
            element: <DDSOP />,
          },
          {
            path: "*",
            element: <NotFound />, // Catch-all route
          },
        ],
      },
    ],
  },
]);
