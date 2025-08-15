import { createBrowserRouter, Outlet } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Forecasting from "./pages/Forecasting";
import DDSOP from "./pages/DDSOP";
import DDMRP from "./pages/DDMRP";
import DDOM from "./pages/DDOM";

// Layout component to wrap all routes
const Layout = () => {
  return <Outlet />;
};

// Define the application routes using React Router v6 createBrowserRouter.
// This router configuration adds new routes for DDMRP and DDOM analytics dashboards
// while retaining existing routes for inventory, settings, forecasting, and DDSOP.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout instead of App
    errorElement: <NotFound />, // Fallback component
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
]);
