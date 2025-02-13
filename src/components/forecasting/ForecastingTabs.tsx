
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export const ForecastingTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: "Forecast Analysis", path: "/forecasting" },
    { name: "Distribution", path: "/forecasting/distribution" },
    { name: "Pattern Analysis", path: "/forecasting/pattern" },
    { name: "What-If Analysis", path: "/forecasting/what-if" },
    { name: "Model Validation", path: "/forecasting/validation" },
    { name: "External Factors", path: "/forecasting/external" }
  ];

  return (
    <div className="border-b">
      <nav className="flex space-x-4 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "px-3 py-4 text-sm font-medium transition-colors hover:text-primary",
              "border-b-2 -mb-px",
              currentPath === tab.path
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            )}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
