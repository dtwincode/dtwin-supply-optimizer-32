
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
import { format, parseISO } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ForecastChartProps {
  data: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

export const ForecastChart = ({ data, confidenceIntervals }: ForecastChartProps) => {
  const [showCI, setShowCI] = useState(true);
  const [showOutliers, setShowOutliers] = useState(true);
  const [confidenceLevel, setConfidenceLevel] = useState<string>("0.95");

  const dataWithOutliers = data.map(point => ({
    ...point,
    formattedWeek: format(parseISO(point.week), 'MMM d'),
    isOutlier: Math.abs(point.actual - point.forecast) > (point.variance * 2)
  }));

  return (
    <div className="w-full h-full">
      <div className="flex flex-wrap items-center justify-end gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="ci-toggle"
            checked={showCI}
            onCheckedChange={setShowCI}
          />
          <Label htmlFor="ci-toggle">Show Confidence Intervals</Label>
        </div>
        {showCI && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="ci-level">CI Level:</Label>
            <Select
              value={confidenceLevel}
              onValueChange={setConfidenceLevel}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select CI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.90">90%</SelectItem>
                <SelectItem value="0.95">95%</SelectItem>
                <SelectItem value="0.99">99%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            id="outliers-toggle"
            checked={showOutliers}
            onCheckedChange={setShowOutliers}
          />
          <Label htmlFor="outliers-toggle">Show Outliers</Label>
        </div>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer>
          <ComposedChart 
            data={dataWithOutliers} 
            margin={{ top: 32, right: 30, left: 10, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedWeek"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={1}
              tick={{ fontSize: 12, fill: '#666', dy: 25 }}
              tickMargin={35}
            />
            <YAxis 
              width={60}
              domain={['auto', 'auto']}
              allowDataOverflow={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              labelFormatter={(label) => `Week of ${label}`}
              formatter={(value: number) => [Math.round(value), "Units"]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              wrapperStyle={{ 
                paddingTop: "0px",
                paddingBottom: "24px"
              }}
            />
            {showCI && (
              <>
                <Area
                  dataKey={(data) => {
                    const index = dataWithOutliers.indexOf(data);
                    return confidenceIntervals[index]?.upper;
                  }}
                  stroke="none"
                  fill="#F59E0B"
                  fillOpacity={0.08}
                  name="Confidence Interval"
                />
                <Area
                  dataKey={(data) => {
                    const index = dataWithOutliers.indexOf(data);
                    return confidenceIntervals[index]?.lower;
                  }}
                  stroke="none"
                  fill="#F59E0B"
                  fillOpacity={0.08}
                  name=" "
                />
              </>
            )}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#F59E0B"
              name="Forecast"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10B981"
              name="Actual Demand"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            {showOutliers && dataWithOutliers
              .filter(point => point.isOutlier && point.actual !== null)
              .map((point, index) => (
                <ReferenceDot
                  key={index}
                  x={point.formattedWeek}
                  y={point.actual}
                  r={4}
                  fill="red"
                  stroke="white"
                  strokeWidth={1}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
