
import { memo } from "react";
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
  Gift
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getTranslation } from "@/translations";

// Reorganized navigation items in a logical workflow for planners
const navigationItems = [
  { name: "navigationItems.dashboard", icon: Home, href: "/" },
  { name: "navigationItems.ddsop", icon: Layers, href: "/ddsop" },
  { name: "navigationItems.forecasting", icon: TrendingUp, href: "/forecasting" },
  { name: "navigationItems.inventory", icon: Package, href: "/inventory" },
  { name: "navigationItems.supplyPlanning", icon: ShoppingCart, href: "/supply-planning" },
  { name: "navigationItems.salesPlanning", icon: LineChart, href: "/sales-planning" },
  { name: "navigationItems.marketing", icon: Gift, href: "/marketing" },
  { name: "navigationItems.logistics", icon: Truck, href: "/logistics" },
  { name: "navigationItems.reports", icon: FileText, href: "/reports" },
  { name: "navigationItems.askAI", icon: Search, href: "/ask-ai" },
  { name: "navigationItems.data", icon: Database, href: "/data" },
  { name: "navigationItems.guidelines", icon: BookOpen, href: "/guidelines" }
];

interface NavigationProps {
  language: 'en' | 'ar';
  isRTL: boolean;
}

const Navigation = memo(({ language, isRTL }: NavigationProps) => {
  const location = useLocation();

  return (
    <nav className="p-4 space-y-1">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
            location.pathname === item.href || (item.href === "/" && location.pathname === "")
              ? "bg-dtwin-medium text-white"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <item.icon className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
          {getTranslation(item.name, language)}
        </Link>
      ))}
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export { navigationItems };
export default Navigation;
