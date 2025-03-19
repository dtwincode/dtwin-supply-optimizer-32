
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  FlipHorizontal, 
  LineChart, 
  CloudLightning 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export const ForecastingTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { language } = useLanguage();

  const tabs = [
    {
      title: getTranslation("forecasting.analysis", language),
      href: "/forecasting",
      icon: LineChart,
    },
    {
      title: getTranslation("forecasting.distribution", language),
      href: "/forecasting/distribution",
      icon: BarChart3,
    },
    {
      title: getTranslation("forecasting.whatIf", language),
      href: "/forecasting/what-if",
      icon: FlipHorizontal,
    },
    {
      title: getTranslation("forecasting.external", language),
      href: "/forecasting/external",
      icon: CloudLightning,
    }
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
