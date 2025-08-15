
import { ForecastDataPoint } from "@/types/forecasting";
import { Card } from "@/components/ui/card";
import { Line, Area, ResponsiveContainer, LineChart, AreaChart, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart2, Calendar, TrendingDown, TrendingUp } from "lucide-react";

interface PatternAnalysisCardProps {
  data: ForecastDataPoint[];
}

export const PatternAnalysisCard = ({ data }: PatternAnalysisCardProps) => {
  const analyzePatterns = () => {
    const forecastValues = data
      .map(d => typeof d.forecast === 'number' ? d.forecast : 0)
      .filter(f => !isNaN(f));
    
    const actualValues = data
      .map(d => typeof d.actual === 'number' ? d.actual : 0)
      .filter(a => !isNaN(a));
    
    const trend = forecastValues.length > 1 ? 
      ((forecastValues[forecastValues.length - 1] - forecastValues[0]) / forecastValues[0]) * 100 : 0;
    
    const meanActual = actualValues.length > 0 ? 
      actualValues.reduce((a, b) => a + b, 0) / actualValues.length : 0;
    
    const seasonality = actualValues.length >= 12 ? 
      Math.abs(Math.max(...actualValues) - Math.min(...actualValues)) / meanActual : 0;
    
    const squaredDiffs = actualValues.map(val => Math.pow(val - meanActual, 2));
    const variance = squaredDiffs.length > 1 ? 
      squaredDiffs.reduce((a, b) => a + b, 0) / (actualValues.length - 1) : 0;
    const volatility = Math.sqrt(variance);

    return {
      trend,
      seasonality,
      volatility
    };
  };

  const patterns = analyzePatterns();

  const trendData = data
    .map((d, index) => ({
      index,
      value: typeof d.forecast === 'number' ? d.forecast : 0
    }))
    .filter(d => !isNaN(d.value));

  const seasonalityData = data
    .map((d, index) => ({
      index,
      value: typeof d.actual === 'number' ? d.actual : 0
    }))
    .filter(d => !isNaN(d.value));

  const validActuals = data
    .map(item => typeof item.actual === 'number' ? item.actual : 0)
    .filter(val => !isNaN(val));
  
  const average = validActuals.length > 0 ? 
    validActuals.reduce((sum, val) => sum + val, 0) / validActuals.length : 0;

  const volatilityData = data
    .map((d, index) => ({
      index,
      value: typeof d.actual === 'number' ? d.actual : 0,
      average
    }))
    .filter(d => !isNaN(d.value));

  const MiniChart = ({ data, color }: { data: any[], color: string }) => (
    <div className="h-[60px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis hide={true} />
          <YAxis hide={true} />
          <Tooltip
            formatter={(value: number) => [Math.round(value), "Units"]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px'
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const VolatilityChart = ({ data, color }: { data: any[], color: string }) => (
    <div className="h-[60px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis hide={true} />
          <YAxis hide={true} />
          <Tooltip
            formatter={(value: number) => [Math.round(value), "Units"]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px'
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke={color}
            strokeDasharray="3 3"
            strokeWidth={1}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pattern Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Based on {data.length} data points
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {patterns.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">Trend Analysis</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.abs(patterns.trend).toFixed(1)}% {patterns.trend >= 0 ? "Upward" : "Downward"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Overall directional movement in the forecast over time
              </p>
              <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Key Insights:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Growth rate: {(patterns.trend / data.length).toFixed(2)}% per period</li>
                  <li>Momentum: {Math.abs(patterns.trend) > 5 ? 'Strong' : 'Moderate'}</li>
                  <li>Consistency: {Math.abs(patterns.trend) < 2 ? 'Stable' : 'Variable'}</li>
                </ul>
              </div>
            </div>
            <MiniChart data={trendData} color={patterns.trend >= 0 ? "#10B981" : "#EF4444"} />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Seasonality</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {(patterns.seasonality * 100).toFixed(1)}% Variation
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cyclical patterns and recurring demand fluctuations
              </p>
              <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Pattern Strength:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Peak amplitude: {(patterns.seasonality * 200).toFixed(1)}% from mean</li>
                  <li>Pattern type: {patterns.seasonality > 0.2 ? 'Strong seasonal' : 'Weak seasonal'}</li>
                  <li>Cycle length: {Math.round(data.length / 4)} periods</li>
                </ul>
              </div>
            </div>
            <MiniChart data={seasonalityData} color="#3B82F6" />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Volatility</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {patterns.volatility.toFixed(1)} Units
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Measure of demand variability and uncertainty
              </p>
              <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Risk Assessment:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Coefficient of variation: {(patterns.volatility / average * 100).toFixed(1)}%</li>
                  <li>Stability: {patterns.volatility < 10 ? 'High' : patterns.volatility < 30 ? 'Medium' : 'Low'}</li>
                  <li>Forecast confidence: {Math.max(0, 100 - (patterns.volatility * 2)).toFixed(1)}%</li>
                </ul>
              </div>
            </div>
            <VolatilityChart data={volatilityData} color="#EAB308" />
          </div>
        </div>
      </div>
    </Card>
  );
};
