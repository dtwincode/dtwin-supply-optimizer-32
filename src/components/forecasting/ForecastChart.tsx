
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
import { calculateConfidenceIntervals } from "@/utils/forecasting/statistics";

interface ForecastChartProps {
  data: any[];
  confidenceIntervals: { upper: number; lower: number }[];
  confidenceLevel?: number;
}

export const ForecastChart = ({ 
  data = [], 
  confidenceIntervals = [],
  confidenceLevel = 95
}: ForecastChartProps) => {
  // Calculate adjusted confidence intervals based on selected level
  const adjustedIntervals = calculateConfidenceIntervals(
    data.map(d => d.forecast),
    confidenceLevel / 100
  );

  // Combine data with confidence intervals
  const chartData = data.map((item, index) => {
    const weekValue = item.week || item.date || '';
    let formattedDate = weekValue;

    if (weekValue) {
      try {
        formattedDate = format(parseISO(weekValue), 'MMM d');
      } catch (e) {
        console.log('Date parsing failed for:', weekValue);
        formattedDate = weekValue;
      }
    }

    return {
      ...item,
      formattedWeek: formattedDate,
      actual: item.actual !== undefined ? Number(item.actual) : null,
      forecast: item.forecast !== undefined ? Number(item.forecast) : null,
      upper: adjustedIntervals[index]?.upper,
      lower: adjustedIntervals[index]?.lower
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={chartData} 
        margin={{ top: 32, right: 30, left: 10, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="formattedWeek"
          angle={-45}
          textAnchor="end"
          height={80}
          interval={1}
          tick={{ fontSize: 12, fill: '#666', dy: 15 }}
          tickMargin={20}
        />
        <YAxis 
          width={60}
          domain={['auto', 'auto']}
          allowDataOverflow={false}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          labelFormatter={(label) => `Week of ${label}`}
          formatter={(value: any) => {
            if (value === null || value === undefined) return ['-', 'Units'];
            return [Math.round(value), "Units"];
          }}
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
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="#F59E0B"
          fillOpacity={0.08}
          name={`${confidenceLevel}% Confidence Interval`}
          connectNulls
        />
        <Area
          type="monotone"
          dataKey="lower"
          stroke="none"
          fill="#F59E0B"
          fillOpacity={0.08}
          name=" "
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#F59E0B"
          name="Forecast"
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#10B981"
          name="Actual Demand"
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
