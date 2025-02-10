
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface ForecastWhatIfAnalysisProps {
  filteredData: any[];
  whatIfParams: {
    growthRate: number;
    seasonality: number;
    events: { week: string; impact: number }[];
  };
  setWhatIfParams: (params: any) => void;
  priceData: PriceData;
  setPriceData: React.Dispatch<React.SetStateAction<PriceData>>;
  whatIfScenario: number[];
}

export const ForecastWhatIfAnalysis = ({
  filteredData,
  whatIfParams,
  setWhatIfParams,
  priceData,
  setPriceData,
  whatIfScenario
}: ForecastWhatIfAnalysisProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Growth Rate (%)</label>
            <Input
              type="number"
              value={whatIfParams.growthRate}
              onChange={(e) => setWhatIfParams(prev => ({
                ...prev,
                growthRate: parseFloat(e.target.value) / 100
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Seasonality Impact</label>
            <Input
              type="number"
              value={whatIfParams.seasonality}
              onChange={(e) => setWhatIfParams(prev => ({
                ...prev,
                seasonality: parseFloat(e.target.value)
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Event Impact</label>
            <Button
              variant="outline"
              onClick={() => setWhatIfParams(prev => ({
                ...prev,
                events: [...prev.events, { week: "", impact: 0 }]
              }))}
            >
              Add Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Base Price</label>
            <Input
              type="number"
              value={priceData.basePrice}
              onChange={(e) => setPriceData(prev => ({
                ...prev,
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
              onChange={(e) => setPriceData(prev => ({
                ...prev,
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
              onChange={(e) => setPriceData(prev => ({
                ...prev,
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
              scenario: whatIfScenario[i]
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
