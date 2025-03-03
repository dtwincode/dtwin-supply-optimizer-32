
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, CloudSun } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { type PriceData } from "@/utils/forecasting";
import { generateScenario, saveScenario } from "@/utils/forecasting/scenarios";
import { ForecastDataPoint } from "@/types/forecasting";
import { fetchWeatherForecast } from "@/utils/forecasting/weather";
import { WeatherData } from "@/types/weatherAndEvents";

// Dummy data for when real data is not available
const DUMMY_FORECAST_DATA: ForecastDataPoint[] = [
  { id: "1", week: "2024-01-01", forecast: 120, actual: 118, sku: "SKU001", variance: -2 },
  { id: "2", week: "2024-01-08", forecast: 130, actual: 135, sku: "SKU001", variance: 5 },
  { id: "3", week: "2024-01-15", forecast: 125, actual: 122, sku: "SKU001", variance: -3 },
  { id: "4", week: "2024-01-22", forecast: 135, actual: 140, sku: "SKU001", variance: 5 },
  { id: "5", week: "2024-01-29", forecast: 145, actual: 142, sku: "SKU001", variance: -3 },
  { id: "6", week: "2024-02-05", forecast: 150, actual: 155, sku: "SKU001", variance: 5 },
  { id: "7", week: "2024-02-12", forecast: 160, actual: 158, sku: "SKU001", variance: -2 },
  { id: "8", week: "2024-02-19", forecast: 170, actual: 175, sku: "SKU001", variance: 5 },
  { id: "9", week: "2024-02-26", forecast: 165, actual: 160, sku: "SKU001", variance: -5 },
  { id: "10", week: "2024-03-04", forecast: 175, actual: 180, sku: "SKU001", variance: 5 },
  { id: "11", week: "2024-03-11", forecast: 185, actual: 182, sku: "SKU001", variance: -3 },
  { id: "12", week: "2024-03-18", forecast: 195, actual: 198, sku: "SKU001", variance: 3 }
];

// Sample scenario data with more dramatic changes
const DUMMY_SCENARIO: number[] = [123, 142, 135, 152, 160, 175, 180, 195, 185, 205, 215, 230];

interface ForecastWhatIfAnalysisProps {
  filteredData: ForecastDataPoint[];
  whatIfParams: {
    growthRate: number;
    seasonality: number;
    events: {
      week: string;
      impact: number;
    }[];
  };
  setWhatIfParams: (params: any) => void;
  priceData: PriceData;
  setPriceData: React.Dispatch<React.SetStateAction<PriceData>>;
  whatIfScenario: number[];
  selectedSKU: string;
}

export const ForecastWhatIfAnalysis = ({
  filteredData,
  whatIfParams,
  setWhatIfParams,
  priceData,
  setPriceData,
  whatIfScenario,
  selectedSKU
}: ForecastWhatIfAnalysisProps) => {
  const {
    toast
  } = useToast();
  const [generatedScenario, setGeneratedScenario] = useState<number[]>([]);
  const [scenarioName, setScenarioName] = useState<string>("");
  const [weatherLocation, setWeatherLocation] = useState<string>("Riyadh");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate a new scenario when parameters change
  useEffect(() => {
    if (filteredData.length > 0) {
      const baseForecast = filteredData.map(item => item.forecast || 0);
      const timeData = filteredData.map(item => ({
        week: item.week,
        date: new Date(item.week)
      }));
      const newScenario = generateScenario(baseForecast, {
        ...whatIfParams,
        priceData: {
          ...priceData,
          skuCode: selectedSKU
        }
      }, timeData);
      setGeneratedScenario(newScenario);
    } else {
      // Use dummy data when no real data is available
      setGeneratedScenario(DUMMY_SCENARIO);
    }
  }, [filteredData, whatIfParams, priceData, selectedSKU]);

  // Fetch weather data on initial load
  useEffect(() => {
    fetchWeatherData();
  }, []);
  
  const fetchWeatherData = async () => {
    if (!weatherLocation.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchWeatherForecast(weatherLocation);
      setWeatherData(data);
      toast({
        title: "Success",
        description: `Weather data for ${data.location || weatherLocation} fetched successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data",
        variant: "destructive"
      });
      console.error("Weather fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your scenario",
        variant: "destructive"
      });
      return;
    }
    const scenarioData = {
      name: scenarioName,
      sku: selectedSKU,
      forecast: generatedScenario,
      assumptions: {
        growthRate: whatIfParams.growthRate,
        seasonality: whatIfParams.seasonality,
        events: whatIfParams.events,
        priceData: {
          ...priceData,
          skuCode: selectedSKU
        }
      }
    };
    const saved = await saveScenario(scenarioData);
    if (saved) {
      toast({
        title: "Success",
        description: `Scenario "${scenarioName}" for SKU ${selectedSKU} saved successfully`
      });
      setScenarioName("");
    } else {
      toast({
        title: "Error",
        description: "Failed to save scenario",
        variant: "destructive"
      });
    }
  };
  
  // Get data for the chart - use actual data if available, otherwise use dummy data
  const getChartData = () => {
    const dataSource = filteredData.length > 0 ? filteredData : DUMMY_FORECAST_DATA;
    
    return dataSource.map((d, i) => ({
      week: d.week,
      forecast: d.forecast,
      scenario: generatedScenario[i] || 0
    }));
  };
  
  return <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Input placeholder="Scenario name" value={scenarioName} onChange={e => setScenarioName(e.target.value)} className="w-48" />
            <Button onClick={handleSaveScenario} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save Scenario
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Growth Rate (%)</label>
            <Input type="number" value={whatIfParams.growthRate * 100} onChange={e => setWhatIfParams({
            ...whatIfParams,
            growthRate: parseFloat(e.target.value) / 100
          })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Seasonality Impact</label>
            <Input type="number" value={whatIfParams.seasonality} onChange={e => setWhatIfParams({
            ...whatIfParams,
            seasonality: parseFloat(e.target.value)
          })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Market Events</label>
            <Input type="text" placeholder="Not configured" disabled className="text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Base Price</label>
            <Input type="number" value={priceData.basePrice} onChange={e => setPriceData(prevData => ({
            ...prevData,
            basePrice: parseFloat(e.target.value)
          }))} min="0" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price Elasticity</label>
            <Input type="number" value={priceData.elasticity} onChange={e => setPriceData(prevData => ({
            ...prevData,
            elasticity: parseFloat(e.target.value)
          }))} step="0.1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Promotional Price</label>
            <Input type="number" value={priceData.promotionalPrice || ''} onChange={e => setPriceData(prevData => ({
            ...prevData,
            promotionalPrice: e.target.value ? parseFloat(e.target.value) : undefined
          }))} min="0" step="0.01" />
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} units`, '']} />
              <Legend />
              <Line type="monotone" dataKey="forecast" stroke="#F59E0B" name="Base Forecast" strokeWidth={2} />
              <Line type="monotone" dataKey="scenario" stroke="#10B981" name="Scenario Forecast" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>;
};
