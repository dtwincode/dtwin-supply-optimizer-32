
import { useState } from "react";
import { MenuIcon, X, Home, Package, TrendingUp, Truck, Settings, LineChart, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Inventory", icon: Package, href: "/inventory" },
  { name: "Sales Planning", icon: LineChart, href: "/sales-planning" },
  { name: "Forecasting", icon: TrendingUp, href: "/forecasting" },
  { name: "Logistics", icon: Truck, href: "/logistics" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/20a1eff5-9fd9-48a9-9896-f1f3c1ec575f.png" 
                alt="dtwin logo" 
                className="h-8"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold">dtwin</span>
                <span className="text-[8px] text-dtwin-medium uppercase tracking-wider">
                  Innovate. Integrate. Accelerate
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                  item.href === "/"
                    ? "bg-dtwin-medium text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-white border-b">
          <div className="flex items-center h-16 px-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 mr-4"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            )}
            <h2 className="font-display text-lg">Supply Chain Dashboard</h2>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;

