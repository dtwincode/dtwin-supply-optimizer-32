import { createBrowserRouter, Outlet } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import DDSOP from "./pages/DDSOP";
import DDMRP from "./pages/DDMRP";
import DDOM from "./pages/DDOM";
import SupplyPlanning from "./pages/SupplyPlanning";

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
      { path: "supply-planning", element: <SupplyPlanning /> },
      { path: "settings", element: <Settings /> },
      { path: "ddmrp", element: <DDMRP /> },
      { path: "ddom", element: <DDOM /> },
      { path: "ddsop", element: <DDSOP /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
