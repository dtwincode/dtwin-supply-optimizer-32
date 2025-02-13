
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ForecastDataPoint } from "@/types/forecasting";

interface ForecastingTabsProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
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

export const ForecastingTabs = ({
  activeTab,
  setActiveTab,
  historicalData,
  filteredData,
  confidenceIntervals,
  decomposition,
  validationResults,
  crossValidationResults,
  weatherLocation,
  setWeatherLocation,
  weatherData,
  fetchWeatherForecast,
  marketEvents,
  setMarketEvents,
  newEvent,
  setNewEvent,
  priceAnalysis,
  historicalPriceData,
  addHistoricalPricePoint,
  calculatePriceAnalysis,
  forecastTableData,
  whatIfScenario
}: ForecastingTabsProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: "Forecast Analysis", path: "./" },
    { name: "Distribution", path: "./distribution" },
    { name: "Pattern Analysis", path: "./pattern" },
    { name: "What-If Analysis", path: "./what-if" },
    { name: "Model Validation", path: "./validation" },
    { name: "External Factors", path: "./external" }
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
              (currentPath === '/forecasting' && tab.path === './') || 
              currentPath.endsWith(tab.path.slice(2))
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
