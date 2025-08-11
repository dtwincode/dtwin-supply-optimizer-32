import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { type PriceData } from "@/utils/forecasting";
import { generateScenario, saveScenario } from "@/utils/forecasting/scenarios";
import { ForecastDataPoint } from "@/types/forecasting";

const DUMMY_FORECAST_DATA: ForecastDataPoint[] = [
  { 
    id: "1", week: "2024-01-01", forecast: 120, actual: 118, sku: "SKU001", variance: -2,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "2", week: "2024-01-08", forecast: 130, actual: 135, sku: "SKU001", variance: 5,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "3", week: "2024-01-15", forecast: 125, actual: 122, sku: "SKU001", variance: -3,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "4", week: "2024-01-22", forecast: 135, actual: 140, sku: "SKU001", variance: 5,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "5", week: "2024-01-29", forecast: 145, actual: 142, sku: "SKU001", variance: -3,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "6", week: "2024-02-05", forecast: 150, actual: 155, sku: "SKU001", variance: 5,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "7", week: "2024-02-12", forecast: 160, actual: 158, sku: "SKU001", variance: -2,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "8", week: "2024-02-19", forecast: 170, actual: 175, sku: "SKU001", variance: 5,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "9", week: "2024-02-26", forecast: 165, actual: 160, sku: "SKU001", variance: -5,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "10", week: "2024-03-04", forecast: 175, actual: 180, sku: "SKU001", variance: 5,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "11", week: "2024-03-11", forecast: 185, actual: 182, sku: "SKU001", variance: -3,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  },
  { 
    id: "12", week: "2024-03-18", forecast: 195, actual: 198, sku: "SKU001", variance: 3,
    region: "Global", city: "N/A", channel: "All", warehouse: "All",
    category: "Electronics", subcategory: "Devices", 
    l1_main_prod: "Electronics", l2_prod_line: "Devices", l3_prod_category: "Gadgets",
    l4_device_make: "Brand X", l5_prod_sub_category: "Premium", l6_device_model: "Model A",
    l7_device_color: "Various", l8_device_storage: "All"
  }
];

const generateExtendedDummyData = (days: number): ForecastDataPoint[] => {
  if (days <= DUMMY_FORECAST_DATA.length * 7) {
    return DUMMY_FORECAST_DATA.slice(0, Math.ceil(days / 7));
  }
  
  const result = [...DUMMY_FORECAST_DATA];
  let lastDate = new Date(DUMMY_FORECAST_DATA[DUMMY_FORECAST_DATA.length - 1].week);
  let lastForecast = DUMMY_FORECAST_DATA[DUMMY_FORECAST_DATA.length - 1].forecast || 0;
  let id = DUMMY_FORECAST_DATA.length + 1;
  
  const weeksNeeded = Math.ceil(days / 7) - DUMMY_FORECAST_DATA.length;
  
  for (let i = 0; i < weeksNeeded; i++) {
    lastDate = new Date(lastDate);
    lastDate.setDate(lastDate.getDate() + 7);
    
    const randomVariance = Math.floor(Math.random() * 20) - 10;
    lastForecast = lastForecast + randomVariance;
    if (lastForecast < 50) lastForecast = 50;
    
    result.push({
      id: id.toString(),
      week: lastDate.toISOString().split('T')[0],
      forecast: lastForecast,
      actual: lastForecast + Math.floor(Math.random() * 10) - 5,
      sku: "SKU001",
      variance: Math.floor(Math.random() * 10) - 5,
      region: "Global", 
      city: "N/A", 
      channel: "All", 
      warehouse: "All",
      category: "Electronics", 
      subcategory: "Devices", 
      l1_main_prod: "Electronics", 
      l2_prod_line: "Devices", 
      l3_prod_category: "Gadgets",
      l4_device_make: "Brand X", 
      l5_prod_sub_category: "Premium", 
      l6_device_model: "Model A",
      l7_device_color: "Various", 
      l8_device_storage: "All"
    });
    
    id++;
  }
  
  return result;
};

const DUMMY_SCENARIO: number[] = [123, 142, 135, 152, 160, 175, 180, 195, 185, 205, 215, 230];

const generateExtendedScenario = (days: number): number[] => {
  if (days <= DUMMY_SCENARIO.length * 7) {
    return DUMMY_SCENARIO.slice(0, Math.ceil(days / 7));
  }
  
  const result = [...DUMMY_SCENARIO];
  let lastValue = DUMMY_SCENARIO[DUMMY_SCENARIO.length - 1];
  
  const weeksNeeded = Math.ceil(days / 7) - DUMMY_SCENARIO.length;
  
  for (let i = 0; i < weeksNeeded; i++) {
    const trend = 5;
    const randomVariance = Math.floor(Math.random() * 30) - 10;
    lastValue = lastValue + trend + randomVariance;
    if (lastValue < 100) lastValue = 100;
    
    result.push(lastValue);
  }
  
  return result;
};

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
  forecastPeriod: string;
}

export const ForecastWhatIfAnalysis = ({
  filteredData,
  whatIfParams,
  setWhatIfParams,
  priceData,
  setPriceData,
  whatIfScenario,
  selectedSKU,
  forecastPeriod
}: ForecastWhatIfAnalysisProps) => {
  const {
    toast
  } = useToast();
  const [generatedScenario, setGeneratedScenario] = useState<number[]>([]);
  const [scenarioName, setScenarioName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forecastPeriodLabel, setForecastPeriodLabel] = useState<string>("Weekly");

  useEffect(() => {
    const days = parseInt(forecastPeriod);
    if (days <= 7) {
      setForecastPeriodLabel("Weekly");
    } else if (days <= 30) {
      setForecastPeriodLabel("Monthly");
    } else if (days <= 90) {
      setForecastPeriodLabel("Quarterly");
    } else {
      setForecastPeriodLabel("Annually");
    }
  }, [forecastPeriod]);

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
      const days = parseInt(forecastPeriod);
      setGeneratedScenario(generateExtendedScenario(days));
    }
  }, [filteredData, whatIfParams, priceData, selectedSKU, forecastPeriod]);
  
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
      period: forecastPeriod,
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
  
  const getChartData = () => {
    const days = parseInt(forecastPeriod);
    
    if (filteredData.length > 0) {
      return filteredData.map((d, i) => ({
        week: d.week,
        forecast: d.forecast,
        scenario: generatedScenario[i] || 0
      }));
    } else {
      const dummyData = generateExtendedDummyData(days);
      return dummyData.map((d, i) => ({
        week: d.week,
        forecast: d.forecast,
        scenario: generatedScenario[i] || 0
      }));
    }
  };

  const formatXAxis = (value: string) => {
    const days = parseInt(forecastPeriod);
    const date = new Date(value);
    
    if (days <= 7) {
      return new Date(value).toLocaleDateString(undefined, { weekday: 'short' });
    } else if (days <= 30) {
      return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else if (days <= 90) {
      return new Date(value).toLocaleDateString(undefined, { month: 'short' });
    } else {
      const month = date.getMonth();
      const year = date.getFullYear();
      
      if (month % 3 === 0) {
        return `Q${Math.floor(month / 3) + 1} ${year}`;
      } else {
        return '';
      }
    }
  };
  
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Input placeholder="Scenario name" value={scenarioName} onChange={e => setScenarioName(e.target.value)} className="w-48" />
            <Button onClick={handleSaveScenario} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save Scenario
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Forecasting period: <span className="font-medium">{forecastPeriodLabel}</span>
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
              <XAxis 
                dataKey="week" 
                tickFormatter={formatXAxis}
                interval={parseInt(forecastPeriod) > 90 ? 4 : parseInt(forecastPeriod) > 30 ? 2 : 0}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} units`, '']} labelFormatter={(label) => `Week of ${new Date(label).toLocaleDateString()}`} />
              <Legend />
              <Line type="monotone" dataKey="forecast" stroke="#F59E0B" name="Base Forecast" strokeWidth={2} />
              <Line type="monotone" dataKey="scenario" stroke="#10B981" name="Scenario Forecast" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
