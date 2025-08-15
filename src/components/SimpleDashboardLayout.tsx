import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  TrendingUp, 
  Package, 
  LineChart, 
  Layers, 
  Truck, 
  FileText, 
  Search, 
  Database, 
  BookOpen, 
  ShoppingCart,
  Gift,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const navigationItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "DD S&OP", icon: Layers, href: "/ddsop" },
  { name: "Forecasting", icon: TrendingUp, href: "/forecasting" },
  { name: "Inventory", icon: Package, href: "/inventory" },
  { name: "Supply Planning", icon: ShoppingCart, href: "/supply-planning" },
  { name: "Sales Planning", icon: LineChart, href: "/sales-and-returns" },
  { name: "Marketing", icon: Gift, href: "/marketing" },
  { name: "Logistics", icon: Truck, href: "/logistics" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Data Management", icon: Database, href: "/data" },
  { name: "Guidelines", icon: BookOpen, href: "/guidelines" }
];

interface SimpleDashboardLayoutProps {
  children: React.ReactNode;
}

export default function SimpleDashboardLayout({ children }: SimpleDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { signOut } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/ff1ca214-cc5f-4fa6-8bfd-4818cf19a551.png" 
                alt="dtwin logo" 
                className="h-8 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center space-x-4 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-8 w-8"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}