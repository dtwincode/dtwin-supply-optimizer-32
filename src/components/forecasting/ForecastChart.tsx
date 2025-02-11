
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
  ComposedChart,
  ReferenceDot
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { format, subMonths, isAfter, isBefore, parseISO } from "date-fns";

interface ForecastChartProps {
  data: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

const timeRangeOptions = [
  { value: "1m", label: "Last Month" },
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last Year" },
  { value: "all", label: "All Time" }
];

const detectOutliers = (data: any[]) => {
  const values = data.map(d => d.actual).filter(v => v !== null);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length
  );
  const threshold = 2; // Number of standard deviations to consider as outlier

  return data.map(point => ({
    ...point,
    isOutlier: point.actual !== null && 
      Math.abs(point.actual - mean) > threshold * stdDev
  }));
};

const formatWeek = (week: string) => {
  try {
    return format(parseISO(week), 'MMM d, yyyy');
  } catch {
    return week;
  }
};

export const ForecastChart = ({ data, confidenceIntervals }: ForecastChartProps) => {
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(false);
  const [timeRange, setTimeRange] = useState("6m");
  const [showOutliers, setShowOutliers] = useState(true);

  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoffDate = timeRange === "all" ? new Date(0) : 
      subMonths(now, parseInt(timeRange));
    
    return data
      .filter(d => {
        const date = parseISO(d.week);
        return isAfter(date, cutoffDate) && isBefore(date, now);
      })
      .map((d, i) => ({
        ...d,
        ci: confidenceIntervals[i],
        formattedWeek: formatWeek(d.week)
      }));
  }, [data, confidenceIntervals, timeRange]);

  const dataWithOutliers = useMemo(() => 
    detectOutliers(filteredData),
    [filteredData]
  );

  return (
    <Card className="p-6 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h3 className="text-lg font-semibold">Demand Forecast</h3>
          <div className="flex gap-2 flex-wrap">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfidenceIntervals(!showConfidenceIntervals)}
            >
              {showConfidenceIntervals ? "Hide" : "Show"} CI
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOutliers(!showOutliers)}
            >
              {showOutliers ? "Hide" : "Show"} Outliers
            </Button>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={dataWithOutliers} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedWeek"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={Math.ceil(dataWithOutliers.length / 15)}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `Week of ${label}`}
                formatter={(value: number) => [Math.round(value), "Units"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10B981"
                name="Actual Demand"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#F59E0B"
                name="Forecast"
                strokeWidth={2}
                dot={false}
              />
              {showConfidenceIntervals && (
                <>
                  <Area
                    dataKey="ci.upper"
                    stroke="transparent"
                    fill="#F59E0B"
                    fillOpacity={0.1}
                    name="Upper CI"
                  />
                  <Area
                    dataKey="ci.lower"
                    stroke="transparent"
                    fill="#F59E0B"
                    fillOpacity={0.1}
                    name="Lower CI"
                  />
                </>
              )}
              {showOutliers && dataWithOutliers
                .filter(point => point.isOutlier)
                .map((point, index) => (
                  <ReferenceDot
                    key={index}
                    x={point.formattedWeek}
                    y={point.actual}
                    r={6}
                    fill="red"
                    stroke="none"
                  />
                ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
