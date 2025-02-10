
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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
import { useState } from "react";

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
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Growth Rate (%)</label>
            <Input
              type="number"
              value={whatIfParams.growthRate}
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
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "LLL dd, y") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => date && setFromDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "LLL dd, y") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => date && setToDate(date)}
                    initialFocus
                    fromDate={fromDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
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
