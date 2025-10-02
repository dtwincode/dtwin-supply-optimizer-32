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
  Gift,
  BadgeCheck,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";

// Reorganized navigation items in a logical workflow for planners
const navigationItems = [
  { name: "navigation.dashboard", icon: Home, href: "/" },
  { name: "navigation.ddsop", icon: Layers, href: "/ddsop" },
  { name: "navigation.forecasting", icon: TrendingUp, href: "/forecasting" },
  {
    name: "navigation.inventory",
    icon: Package,
    href: "/inventory",
    badge: "Phase 7",
    badgeColor: "bg-green-600",
  },
  {
    name: "Buffer Profiles",
    icon: Settings,
    href: "/buffer-profiles",
  },
  {
    name: "Breach Alerts",
    icon: AlertTriangle,
    href: "/breach-alerts",
  },
  {
    name: "navigation.supplyPlanning",
    icon: ShoppingCart,
    href: "/supply-planning",
  },
  {
    name: "navigation.salesPlanning",
    icon: LineChart,
    href: "/sales-and-returns",
  },
  { name: "navigation.marketing", icon: Gift, href: "/marketing" },
  { name: "navigation.logistics", icon: Truck, href: "/logistics" },
  { name: "navigation.reports", icon: FileText, href: "/reports" },
  { name: "navigation.askAI", icon: Search, href: "/ask-ai" },
  { name: "navigation.data", icon: Database, href: "/data" },
  { name: "navigation.guidelines", icon: BookOpen, href: "/guidelines" },
];

interface NavigationProps {
  language: "en" | "ar";
  isRTL: boolean;
}

const Navigation = memo(({ language, isRTL }: NavigationProps) => {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <nav className="py-2 space-y-0.5 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200",
            location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href))
              ? "bg-dtwin-medium text-white"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
        >
          <item.icon className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          <span className="flex-1">{t(item.name)}</span>
          {item.badge && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${item.badgeColor || "bg-dtwin-medium"} ml-2`}
            >
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
});

Navigation.displayName = "Navigation";

export { navigationItems };
export default Navigation;
