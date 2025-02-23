
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

interface ForecastChartProps {
  data: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

export const ForecastChart = ({ 
  data = [], 
  confidenceIntervals = []
}: ForecastChartProps) => {
  // Validate and transform data
  const validData = data.map(item => {
    // Ensure we have a valid week/date value
    const weekValue = item.week || item.date || '';
    let formattedDate = weekValue;

    // Only try to parse and format if we have a value
    if (weekValue) {
      try {
        formattedDate = format(parseISO(weekValue), 'MMM d');
      } catch (e) {
        console.log('Date parsing failed for:', weekValue);
        formattedDate = weekValue; // Keep original if parsing fails
      }
    }

    return {
      ...item,
      formattedWeek: formattedDate,
      actual: Number(item.actual) || 0,
      forecast: Number(item.forecast) || 0,
      upper: Number(item.upper) || Number(item.forecast) || 0,
      lower: Number(item.lower) || Number(item.forecast) || 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={validData} 
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
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="#F59E0B"
          fillOpacity={0.08}
          name="Confidence Interval"
        />
        <Area
          type="monotone"
          dataKey="lower"
          stroke="none"
          fill="#F59E0B"
          fillOpacity={0.08}
          name=" "
        />
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
      </ComposedChart>
    </ResponsiveContainer>
  );
};
