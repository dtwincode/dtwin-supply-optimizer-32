
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  CircleDot, 
  FlipHorizontal, 
  LineChart, 
  GitCompareArrows,
  Microscope, 
  CloudLightning 
} from "lucide-react";

export const ForecastingTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    {
      title: "Analysis",
      href: "/forecasting",
      icon: LineChart,
    },
    {
      title: "Distribution",
      href: "/forecasting/distribution",
      icon: BarChart3,
    },
    {
      title: "Descriptive",
      href: "/forecasting/descriptive",
      icon: CircleDot,
    },
    {
      title: "What-If",
      href: "/forecasting/what-if",
      icon: FlipHorizontal,
    },
    {
      title: "Validation",
      href: "/forecasting/validation",
      icon: Microscope,
    },
    {
      title: "External",
      href: "/forecasting/external",
      icon: CloudLightning,
    },
    {
      title: "Reconciliation",
      href: "/forecasting/reconciliation",
      icon: GitCompareArrows,
    },
  ];

  return (
    <div className="flex items-center gap-4 border-b">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = 
          (tab.href === "/forecasting" && currentPath === "/forecasting") ||
          (tab.href !== "/forecasting" && currentPath.startsWith(tab.href));

        return (
          <Link key={tab.href} to={tab.href}>
            <Button
              variant="ghost"
              className={cn(
                "gap-2 py-2",
                isActive && "bg-muted font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.title}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
