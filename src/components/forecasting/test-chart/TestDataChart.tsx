
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TestDataChartProps {
  data: {
    date: string;
    actual: number;
  }[];
}

export const TestDataChart = ({ data }: TestDataChartProps) => {
  // Early return with a message if no data
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        No data available to display
      </div>
    );
  }

  // Format data for display
  const formattedData = data.map(point => ({
    ...point,
    actual: Number(point.actual) // Ensure actual is a number
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            angle={-45}
            textAnchor="end"
            height={60}
            interval={Math.ceil(formattedData.length / 15)}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [Math.round(value), "Units"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#10B981"
            name="Test Data"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
