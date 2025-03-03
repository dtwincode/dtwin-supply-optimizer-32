
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { type PriceData } from "@/utils/forecasting";
import { generateScenario, saveScenario } from "@/utils/forecasting/scenarios";
import { ForecastDataPoint } from "@/types/forecasting";

interface ForecastWhatIfAnalysisProps {
  filteredData: ForecastDataPoint[];
  whatIfParams: {
    growthRate: number;
    seasonality: number;
    events: { week: string; impact: number }[];
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
  const { toast } = useToast();
  const [generatedScenario, setGeneratedScenario] = useState<number[]>([]);
  const [scenarioName, setScenarioName] = useState<string>("");
  
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
    }
  }, [filteredData, whatIfParams, priceData, selectedSKU]);

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

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">What-If Scenario for SKU: {selectedSKU}</h3>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Scenario name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-48"
            />
            <Button onClick={handleSaveScenario} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save Scenario
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Growth Rate (%)</label>
            <Input
              type="number"
              value={whatIfParams.growthRate * 100}
              onChange={(e) => setWhatIfParams({
                ...whatIfParams,
                growthRate: parseFloat(e.target.value) / 100
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Seasonality Impact</label>
            <Input
              type="number"
              value={whatIfParams.seasonality}
              onChange={(e) => setWhatIfParams({
                ...whatIfParams,
                seasonality: parseFloat(e.target.value)
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Market Events</label>
            <Input
              type="text"
              placeholder="Not configured"
              disabled
              className="text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Base Price</label>
            <Input
              type="number"
              value={priceData.basePrice}
              onChange={(e) => setPriceData(prevData => ({
                ...prevData,
                basePrice: parseFloat(e.target.value)
              }))}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price Elasticity</label>
            <Input
              type="number"
              value={priceData.elasticity}
              onChange={(e) => setPriceData(prevData => ({
                ...prevData,
                elasticity: parseFloat(e.target.value)
              }))}
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Promotional Price</label>
            <Input
              type="number"
              value={priceData.promotionalPrice || ''}
              onChange={(e) => setPriceData(prevData => ({
                ...prevData,
                promotionalPrice: e.target.value ? parseFloat(e.target.value) : undefined
              }))}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData.map((d, i) => ({
              week: d.week,
              forecast: d.forecast,
              scenario: generatedScenario[i] || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#F59E0B"
                name="Base Forecast"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="scenario"
                stroke="#10B981"
                name="Scenario Forecast"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
