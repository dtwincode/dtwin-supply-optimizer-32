import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  type: "line" | "bar" | "pie";
  title: string;
  data: any[];
  xKey?: string;
  yKey?: string;
  colors?: string[];
}

interface ChartRendererProps {
  chartData: ChartData;
}

const DEFAULT_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const ChartRenderer = ({ chartData }: ChartRendererProps) => {
  const { type, title, data, xKey, yKey, colors = DEFAULT_COLORS } = chartData;

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={yKey || "value"}
                stroke={colors[0]}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey || "value"} fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey={yKey || "value"}
                nameKey={xKey || "name"}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <p className="text-muted-foreground">Unsupported chart type</p>;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {renderChart()}
    </Card>
  );
};
