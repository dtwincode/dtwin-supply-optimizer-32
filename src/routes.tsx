import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Index from "./pages/index";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Forecasting from "./pages/Forecasting";
import DDSOP from "./pages/DDSOP";
import DDMRP from "./pages/DDMRP";
import DDOM from "./pages/DDOM";
import SupplyPlanning from "./pages/SupplyPlanning";
import SalesPlanning from "./pages/SalesPlanning";
import Marketing from "./pages/Marketing";
import Logistics from "./pages/Logistics";
import Reports from "./pages/Reports";
import DataManagement from "./pages/DataManagement";
import Guidelines from "./pages/Guidelines";

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
            element: <Index />, // Use existing Index page as home page
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
            path: "supply-planning",
            element: <SupplyPlanning />,
          },
          {
            path: "sales-and-returns",
            element: <SalesPlanning />,
          },
          {
            path: "marketing",
            element: <Marketing />,
          },
          {
            path: "logistics",
            element: <Logistics />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "data",
            element: <DataManagement />,
          },
          {
            path: "guidelines",
            element: <Guidelines />,
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
