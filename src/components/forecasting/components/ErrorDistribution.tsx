
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ErrorDistributionProps {
  data: ForecastDataPoint[];
}

export const ErrorDistribution = ({ data }: ErrorDistributionProps) => {
  const calculateErrorDistribution = () => {
    const errors = data
      .filter(d => d.actual !== null && d.forecast !== null)
      .map(d => ({
        error: ((d.actual! - d.forecast!) / d.actual!) * 100,
        week: d.week
      }));

    const binSize = 5;
    const bins: { range: string; count: number }[] = [];
    
    const minError = Math.floor(Math.min(...errors.map(e => e.error)) / binSize) * binSize;
    const maxError = Math.ceil(Math.max(...errors.map(e => e.error)) / binSize) * binSize;

    for (let i = minError; i <= maxError; i += binSize) {
      const count = errors.filter(e => e.error >= i && e.error < i + binSize).length;
      bins.push({
        range: `${i.toFixed(0)}% to ${(i + binSize).toFixed(0)}%`,
        count
      });
    }

    return bins;
  };

  const distribution = calculateErrorDistribution();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Error Distribution</h3>
          <span className="text-sm text-muted-foreground">
            Forecast Error Analysis
          </span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution}>
              <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
