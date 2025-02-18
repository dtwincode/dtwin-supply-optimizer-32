
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ForecastDataPoint } from "@/types/forecasting";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

interface ForecastingTabsProps {
  historicalData?: Array<{ date: string; actual: number; predicted: number; }>;
  filteredData?: ForecastDataPoint[];
  confidenceIntervals?: Array<{ upper: number; lower: number; }>;
  decomposition?: {
    trend: (number | null)[];
    seasonal: (number | null)[];
  };
  validationResults?: {
    biasTest: boolean;
    residualNormality: boolean;
    heteroskedasticityTest: boolean;
  };
  crossValidationResults?: {
    trainMetrics: { mape: number; mae: number; rmse: number; };
    testMetrics: { mape: number; mae: number; rmse: number; };
    validationMetrics: { mape: number; mae: number; rmse: number; };
  };
  weatherLocation?: string;
  setWeatherLocation?: (location: string) => void;
  weatherData?: any;
  fetchWeatherForecast?: (location: string) => Promise<any>;
  marketEvents?: any[];
  setMarketEvents?: (events: any[]) => void;
  newEvent?: any;
  setNewEvent?: (event: any) => void;
  priceAnalysis?: any;
  historicalPriceData?: any[];
  addHistoricalPricePoint?: (price: number, demand: number) => void;
  calculatePriceAnalysis?: () => void;
  forecastTableData?: any[];
  whatIfScenario?: any[];
}

export const ForecastingTabs: React.FC<ForecastingTabsProps> = (props) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { language, isRTL } = useLanguage();

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
    <div className="border-b" dir={isRTL ? 'rtl' : 'ltr'}>
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
