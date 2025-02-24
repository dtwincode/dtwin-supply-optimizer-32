
import { Card } from "@/components/ui/card";
import { AlertTriangle, Link } from "lucide-react";
import { ForecastDataPoint } from "@/types/forecasting";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend,
  ReferenceDot
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AnomalyDetectionProps {
  data: ForecastDataPoint[];
  syncId?: string;
  dateRange?: [Date, Date];
}

export const AnomalyDetection = ({ 
  data, 
  syncId,
  dateRange 
}: AnomalyDetectionProps) => {
  const [showOutliers, setShowOutliers] = useState(true);
  const [isSynced, setIsSynced] = useState(true);

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
        mean,
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
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Anomaly Detection</h3>
            {syncId && (
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 relative z-10 ${isSynced ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => setIsSynced(!isSynced)}
              >
                <Link className="h-4 w-4" />
                <span className="whitespace-nowrap">{isSynced ? 'Synced' : 'Not Synced'}</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg shadow-sm">
              <Switch
                id="show-outliers"
                checked={showOutliers}
                onCheckedChange={setShowOutliers}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="show-outliers" className="font-medium cursor-pointer whitespace-nowrap">
                Show Outliers
              </Label>
            </div>
            <span className="text-sm bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium shadow-sm whitespace-nowrap">
              {anomalies.length} anomalies detected
            </span>
          </div>
        </div>

        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={dataWithAnomalies}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
              syncId={isSynced ? syncId : undefined}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="week"
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6B7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6B7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
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
              {showOutliers && anomalies.map((anomaly, index) => (
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

        {showOutliers && anomalies.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg shadow-sm">
            <h4 className="text-sm font-medium mb-3">Detected Anomalies</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {anomalies.map((anomaly, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm bg-white p-2 rounded-md shadow-sm"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="flex-1">
                    Anomaly detected on {anomaly.week} 
                    <span className="ml-2 text-muted-foreground">
                      (Z-Score: {anomaly.zScore.toFixed(2)})
                    </span>
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
