
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

type TimePeriod = "weekly" | "monthly" | "quarterly" | "yearly";

const detectOutliers = (data: any[]) => {
  const values = data.map(d => d.actual).filter(v => v !== null);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length
  );
  const threshold = 2;

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
  const [selectionType, setSelectionType] = useState<"date" | "period" | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("weekly");
  const [periodCount, setPeriodCount] = useState<string>("4");
  const [showOutliers, setShowOutliers] = useState(true);

  const filteredData = useMemo(() => {
    if (!selectionType || !selectedPeriod) return data;
    
    const today = new Date();
    let cutoffDate = new Date(today);

    switch (selectedPeriod) {
      case "weekly":
        cutoffDate.setDate(today.getDate() - (parseInt(periodCount) * 7));
        break;
      case "monthly":
        cutoffDate.setMonth(today.getMonth() - parseInt(periodCount));
        break;
      case "quarterly":
        cutoffDate.setMonth(today.getMonth() - (parseInt(periodCount) * 3));
        break;
      case "yearly":
        cutoffDate.setFullYear(today.getFullYear() - parseInt(periodCount));
        break;
    }
    
    return data
      .filter(d => {
        const date = parseISO(d.week);
        return isAfter(date, cutoffDate) && isBefore(date, today);
      })
      .map((d, i) => ({
        ...d,
        ci: confidenceIntervals[i],
        formattedWeek: formatWeek(d.week)
      }));
  }, [data, confidenceIntervals, selectionType, selectedPeriod, periodCount]);

  const dataWithOutliers = useMemo(() => 
    detectOutliers(filteredData),
    [filteredData]
  );

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  const handlePeriodCountChange = (count: string) => {
    setPeriodCount(count);
  };

  return (
    <Card className="p-6 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h3 className="text-lg font-semibold">Demand Forecast</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Select
                value={selectionType || undefined}
                onValueChange={(value: "date" | "period") => setSelectionType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Range</SelectItem>
                  <SelectItem value="period">Time Period</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectionType === "period" && (
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={periodCount} onValueChange={handlePeriodCountChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 6, 8, 12, 24, 36].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Last {num} {selectedPeriod === "weekly" ? "weeks" : 
                                  selectedPeriod === "monthly" ? "months" :
                                  selectedPeriod === "quarterly" ? "quarters" : "years"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
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
