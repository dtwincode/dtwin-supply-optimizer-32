
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, CartesianGrid, Scatter, BarChart, Bar, Line, ComposedChart } from "recharts";
import { BoxPlot, BoxPlotDatum } from "@nivo/boxplot";

interface DescriptiveAnalysisTabProps {
  filteredData?: ForecastDataPoint[];
}

export const DescriptiveAnalysisTab = ({ filteredData = [] }: DescriptiveAnalysisTabProps) => {
  // Transform data for value analysis
  const values = filteredData
    .map(d => d.actual)
    .filter((val): val is number => val !== null);

  // Calculate distribution type
  const detectDistributionType = (data: number[]): string => {
    if (data.length < 3) return "Insufficient data";
    
    // Calculate skewness
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    const skewness = data.reduce((a, b) => 
      a + Math.pow((b - mean) / stdDev, 3), 0) / data.length;
    
    // Calculate kurtosis
    const kurtosis = data.reduce((a, b) => 
      a + Math.pow((b - mean) / stdDev, 4), 0) / data.length - 3;

    // Determine distribution type based on skewness and kurtosis
    if (Math.abs(skewness) < 0.5 && Math.abs(kurtosis) < 0.5) {
      return "Normal Distribution";
    } else if (skewness > 1) {
      return "Right-Skewed Distribution";
    } else if (skewness < -1) {
      return "Left-Skewed Distribution";
    } else if (kurtosis > 1) {
      return "Heavy-Tailed Distribution";
    } else if (kurtosis < -1) {
      return "Light-Tailed Distribution";
    } else {
      return "Non-Normal Distribution";
    }
  };

  // Transform data for box plot
  const prepareBoxPlotData = (values: number[]): BoxPlotDatum => {
    if (values.length === 0) return {
      group: '',
      min: 0,
      max: 0,
      median: 0,
      quantile1: 0,
      quantile3: 0,
      whiskerLow: 0,
      whiskerHigh: 0,
    };

    const sorted = [...values].sort((a, b) => a - b);
    const len = sorted.length;
    const median = len % 2 === 0
      ? (sorted[len / 2 - 1] + sorted[len / 2]) / 2
      : sorted[Math.floor(len / 2)];
    
    const q1Index = Math.floor(len * 0.25);
    const q3Index = Math.floor(len * 0.75);
    
    return {
      min: sorted[0],
      max: sorted[len - 1],
      median,
      quantile1: sorted[q1Index],
      quantile3: sorted[q3Index],
      whiskerLow: sorted[0],
      whiskerHigh: sorted[len - 1],
    };
  };

  const boxPlotData = [
    {
      group: 'Distribution',
      ...prepareBoxPlotData(values)
    }
  ];

  // Enhanced histogram data preparation with distribution line
  const prepareHistogramData = (values: number[], bins = 10) => {
    if (values.length === 0) return [];
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const histogram = Array(bins).fill(0);
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[binIndex]++;
    });

    // Calculate mean and standard deviation for normal distribution line
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    );

    // Generate histogram data
    const histogramData = histogram.map((count, i) => {
      const x = min + (i * binWidth);
      const normalValue = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) * values.length * binWidth;
      
      return {
        binStart: x,
        binEnd: min + ((i + 1) * binWidth),
        count,
        normalDist: normalValue,
        label: `${x.toFixed(1)} - ${(min + ((i + 1) * binWidth)).toFixed(1)}`
      };
    });

    return histogramData;
  };

  const histogramData = prepareHistogramData(values);
  const distributionType = detectDistributionType(values);

  // Calculate basic statistics
  const mean = values.length > 0
    ? values.reduce((a, b) => a + b, 0) / values.length
    : 0;
  const stdDev = values.length > 0
    ? Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length)
    : 0;
  const median = values.length > 0
    ? values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
    : 0;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Distribution Histogram</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={histogramData}
              margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                angle={-45} 
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" name="Frequency" fill="#8884d8" opacity={0.8} />
              <Line
                type="monotone"
                dataKey="normalDist"
                stroke="#ff7300"
                name="Distribution Line"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Distribution Type</h3>
        <p className="text-lg font-medium text-primary">{distributionType}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Box Plot Analysis</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BoxPlot
              data={boxPlotData}
              margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              padding={0.15}
              minValue={Math.min(...values)}
              maxValue={Math.max(...values)}
              layout="vertical"
              valueFormat={(value) => typeof value === 'number' ? value.toFixed(2) : '0'}
              width={500}
              height={400}
            />
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Descriptive Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Mean</p>
            <p className="text-lg font-semibold">{mean.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Median</p>
            <p className="text-lg font-semibold">{median.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Standard Deviation</p>
            <p className="text-lg font-semibold">{stdDev.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Sample Size</p>
            <p className="text-lg font-semibold">{values.length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
