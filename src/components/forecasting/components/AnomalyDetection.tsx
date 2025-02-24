import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ForecastDataPoint } from "@/types/forecasting";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  CartesianGrid, 
  Legend,
  ReferenceDot 
} from "recharts";

interface AnomalyDetectionProps {
  data: ForecastDataPoint[];
}

export const AnomalyDetection = ({ data }: AnomalyDetectionProps) => {
  // Simple anomaly detection using z-score
  const detectAnomalies = (data: ForecastDataPoint[]) => {
    const actualValues = data.map(d => d.actual).filter((v): v is number => v !== null);
    const mean = actualValues.reduce((sum, val) => sum + val, 0) / actualValues.length;
    const stdDev = Math.sqrt(
      actualValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / actualValues.length
    );
    const threshold = 2; // Z-score threshold for anomalies

    return data.map(point => {
      if (point.actual === null) return { ...point, isAnomaly: false, zScore: 0 };
      const zScore = Math.abs((point.actual - mean) / stdDev);
      return { 
        ...point, 
        isAnomaly: zScore > threshold,
        zScore,
        mean, // Add mean for visualization
        upperBound: mean + threshold * stdDev,
        lowerBound: mean - threshold * stdDev
      };
    });
  };

  const dataWithAnomalies = detectAnomalies(data);
  const anomalies = dataWithAnomalies.filter(d => d.isAnomaly);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{`Week: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              {entry.name}: {Math.round(entry.value * 100) / 100}
            </p>
          ))}
          {payload[0]?.payload?.zScore && (
            <p className="text-sm text-muted-foreground">
              Z-Score: {Math.round(payload[0].payload.zScore * 100) / 100}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Anomaly Detection</h3>
          <span className="text-sm text-muted-foreground">
            {anomalies.length} anomalies detected
          </span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={dataWithAnomalies}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="week"
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
                name="Actual Demand"
              />
              <Line 
                type="monotone" 
                dataKey="mean" 
                stroke="#6B7280" 
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Mean"
              />
              <Line 
                type="monotone" 
                dataKey="upperBound" 
                stroke="#9CA3AF" 
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="Threshold Bounds"
              />
              <Line 
                type="monotone" 
                dataKey="lowerBound" 
                stroke="#9CA3AF" 
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name=" "
              />
              {anomalies.map((anomaly, index) => (
                <ReferenceDot
                  key={index}
                  x={anomaly.week}
                  y={anomaly.actual || 0}
                  r={6}
                  fill="#EF4444"
                  stroke="none"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {anomalies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Detected Anomalies</h4>
            <div className="space-y-1">
              {anomalies.map((anomaly, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>
                    Anomaly detected on {anomaly.week} 
                    (Z-Score: {anomaly.zScore.toFixed(2)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
