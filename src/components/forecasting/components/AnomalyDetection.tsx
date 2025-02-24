
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ForecastDataPoint } from "@/types/forecasting";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

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
      if (point.actual === null) return { ...point, isAnomaly: false };
      const zScore = Math.abs((point.actual - mean) / stdDev);
      return { ...point, isAnomaly: zScore > threshold };
    });
  };

  const dataWithAnomalies = detectAnomalies(data);
  const anomalies = dataWithAnomalies.filter(d => d.isAnomaly);

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
            <LineChart data={dataWithAnomalies}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10B981" 
                dot={false}
              />
              {anomalies.map((anomaly, index) => (
                <ReferenceLine
                  key={index}
                  x={anomaly.week}
                  stroke="#EF4444"
                  strokeDasharray="3 3"
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
                  <span>Anomaly detected on {anomaly.week}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
