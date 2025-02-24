
import { CustomTooltipProps } from "./types";

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const binData = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium">Error Range: {label}</p>
        <p className="text-sm">Count: {binData.count}</p>
        <p className="text-sm text-muted-foreground">
          Average Error: {
            (binData.errors.reduce((sum: number, e: any) => sum + e.error, 0) / binData.count).toFixed(2)
          }%
        </p>
      </div>
    );
  }
  return null;
};
