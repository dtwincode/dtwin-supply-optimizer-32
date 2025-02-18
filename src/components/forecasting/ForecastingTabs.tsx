
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export const ForecastingTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { language } = useLanguage();

  const tabs = [
    { 
      name: "moduleTranslations.forecastAnalysis",
      path: "/forecasting" 
    },
    { 
      name: "moduleTranslations.futureForecasts",
      path: "/forecasting/distribution" 
    },
    { 
      name: "moduleTranslations.descriptiveAnalysis",
      path: "/forecasting/descriptive" 
    },
    { 
      name: "moduleTranslations.patternAnalysis",
      path: "/forecasting/pattern" 
    },
    { 
      name: "moduleTranslations.whatIfAnalysis",
      path: "/forecasting/what-if" 
    },
    { 
      name: "moduleTranslations.modelValidation",
      path: "/forecasting/validation" 
    },
    { 
      name: "moduleTranslations.externalFactors",
      path: "/forecasting/external" 
    }
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
            {getTranslation(tab.name, language)}
          </Link>
        ))}
      </nav>
    </div>
  );
};
