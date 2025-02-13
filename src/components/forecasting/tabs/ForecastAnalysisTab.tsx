
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { Card } from "@/components/ui/card";
import {
  BoxPlot,
  ScatterPlot,
  Line,
  ComposedChart,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface ForecastAnalysisTabProps {
  filteredData: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

const calculateDescriptiveStats = (data: any[]) => {
  const values = data.map(d => d.actual).filter(v => v !== null) as number[];
  values.sort((a, b) => a - b);
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const q1 = values[Math.floor(values.length * 0.25)];
  const median = values[Math.floor(values.length * 0.5)];
  const q3 = values[Math.floor(values.length * 0.75)];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  
  return {
    min,
    max,
    q1,
    median,
    q3,
    mean,
    outliers: values.filter(v => v < q1 - 1.5 * (q3 - q1) || v > q3 + 1.5 * (q3 - q1))
  };
};

const createHistogramData = (data: any[]) => {
  const values = data.map(d => d.actual).filter(v => v !== null) as number[];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = 10;
  const binSize = (max - min) / binCount;
  
  const bins = Array.from({ length: binCount }, (_, i) => ({
    binStart: min + i * binSize,
    binEnd: min + (i + 1) * binSize,
    count: 0
  }));
  
  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
    bins[binIndex].count++;
  });
  
  return bins;
};

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  const stats = calculateDescriptiveStats(filteredData);
  const histogramData = createHistogramData(filteredData);
  
  const boxPlotData = [{
    q1: stats.q1,
    median: stats.median,
    q3: stats.q3,
    min: stats.min,
    max: stats.max
  }];

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Time Series Analysis</h3>
        <ForecastChart
          data={filteredData}
          confidenceIntervals={confidenceIntervals}
        />
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Box Plot Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <ComposedChart
                data={boxPlotData}
                margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <BoxPlot
                  dataKey="median"
                  q1={stats.q1}
                  q3={stats.q3}
                  minimum={stats.min}
                  maximum={stats.max}
                  fill="#8884d8"
                  strokeWidth={2}
                />
                {stats.outliers.map((outlier, index) => (
                  <ScatterPlot
                    key={index}
                    data={[{ x: outlier, y: 0 }]}
                    fill="red"
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Distribution Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="binStart"
                  tickFormatter={(value) => Math.round(value).toString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => `Range: ${Math.round(label)} - ${Math.round(label + (histogramData[1]?.binStart - histogramData[0]?.binStart))}`}
                />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Frequency" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">Mean</div>
            <div className="text-lg font-semibold">{stats.mean.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">Median</div>
            <div className="text-lg font-semibold">{stats.median.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">Q1</div>
            <div className="text-lg font-semibold">{stats.q1.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">Q3</div>
            <div className="text-lg font-semibold">{stats.q3.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">Min</div>
            <div className="text-lg font-semibold">{stats.min.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">Max</div>
            <div className="text-lg font-semibold">{stats.max.toFixed(2)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
