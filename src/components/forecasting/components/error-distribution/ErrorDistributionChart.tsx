
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ErrorBin } from "./types";
import { CustomTooltip } from "./CustomTooltip";

interface ErrorDistributionChartProps {
  data: ErrorBin[];
  syncId?: string;
}

export const ErrorDistributionChart = ({ data, syncId }: ErrorDistributionChartProps) => {
  return (
    <div className="h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 60 }}
          syncId={syncId}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="range"
            angle={-45}
            textAnchor="end"
            height={50}
            tick={{ fontSize: 12 }}
            interval={0}
            stroke="#6B7280"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickMargin={10}
            stroke="#6B7280"
            label={{
              value: 'Number of Occurrences',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Bar
            dataKey="count"
            fill="#6366F1"
            name="Error Frequency"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
