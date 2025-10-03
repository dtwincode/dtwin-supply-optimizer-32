import { createBrowserRouter, Outlet } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import DDSOP from "./pages/DDSOP";
import DDMRP from "./pages/DDMRP";
import DDOM from "./pages/DDOM";
import ExecutionPriority from "./pages/ExecutionPriority";
import MaterialSync from "./pages/MaterialSync";

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
      { path: "execution-priority", element: <ExecutionPriority /> },
      { path: "material-sync", element: <MaterialSync /> },
      { path: "supply-planning", element: <DDOM /> },
      { path: "settings", element: <Settings /> },
      { path: "ddmrp", element: <DDMRP /> },
      { path: "ddsop", element: <DDSOP /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
