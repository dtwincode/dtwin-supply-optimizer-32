
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import InventoryTesting from "./pages/InventoryTesting";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Forecasting from "./pages/Forecasting";
import DataManager from "./pages/DataManager";
import DDSOP from "./pages/DDSOP";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import UserProfile from "./pages/UserProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "inventory",
        element: <Inventory />
      },
      {
        path: "inventory-testing",
        element: <InventoryTesting />
      },
      {
        path: "forecasting",
        element: <Forecasting />
      },
      {
        path: "data-manager",
        element: <DataManager />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "ddsop",
        element: <DDSOP />
      },
      {
        path: "profile",
        element: <UserProfile />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />
  }
]);
