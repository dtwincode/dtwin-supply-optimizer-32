
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ForecastChartProps {
  data: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

const formatWeek = (week: string) => {
  // Assuming week format is "YYYY-WW"
  const [year, weekNum] = week.split('-W');
  return `Week ${weekNum}`;
};

export const ForecastChart = ({ data, confidenceIntervals }: ForecastChartProps) => {
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Demand Forecast</h3>
        <Button
          variant="outline"
          onClick={() => setShowConfidenceIntervals(!showConfidenceIntervals)}
        >
          {showConfidenceIntervals ? "Hide" : "Show"} Confidence Intervals
        </Button>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.map((d, i) => ({
            ...d,
            ci: confidenceIntervals[i],
            formattedWeek: formatWeek(d.week)
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedWeek" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10B981"
              name="Actual Demand"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#F59E0B"
              name="Forecast"
              strokeWidth={2}
            />
            {showConfidenceIntervals && (
              <Area
                dataKey="ci.upper"
                stroke="transparent"
                fill="#F59E0B"
                fillOpacity={0.1}
                name="Confidence Interval"
              />
            )}
            {showConfidenceIntervals && (
              <Area
                dataKey="ci.lower"
                stroke="transparent"
                fill="#F59E0B"
                fillOpacity={0.1}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
