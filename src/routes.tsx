import { createBrowserRouter, Outlet } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import DDSOP from "./pages/DDSOP";
import DDMRP from "./pages/DDMRP";
import DDOM from "./pages/DDOM";
import BufferProfiles from "./pages/BufferProfiles";
import BreachAlerts from "./pages/BreachAlerts";
import DDMRPConfiguration from "./pages/DDMRPConfiguration";

// Layout component to wrap all routes
const Layout = () => (
  <div className="app-container">
    <main>
      <Outlet />
    </main>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Inventory /> },
      { path: "inventory", element: <Inventory /> },
      { path: "buffer-profiles", element: <BufferProfiles /> },
      { path: "breach-alerts", element: <BreachAlerts /> },
      { path: "settings", element: <Settings /> },
      { path: "ddmrp", element: <DDMRP /> },
      { path: "ddom", element: <DDOM /> },
      { path: "ddsop", element: <DDSOP /> },
      { path: "ddmrp-config", element: <DDMRPConfiguration /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
