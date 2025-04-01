
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Forecasting from "./pages/Forecasting";
import DDSOP from "./pages/DDSOP";
import InventoryPlanning from "./pages/InventoryPlanning";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Inventory /> // Use Inventory as home page since Dashboard is missing
      },
      {
        path: "inventory",
        element: <Inventory />
      },
      {
        path: "inventory-planning",
        element: <InventoryPlanning />
      },
      {
        path: "forecasting",
        element: <Forecasting />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "ddsop",
        element: <DDSOP />
      }
    ]
  }
]);
