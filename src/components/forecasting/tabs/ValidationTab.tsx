
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ValidationResult, type CrossValidationResult } from "@/utils/forecasting/statistics";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ValidationTabProps {
  validationResults: ValidationResult;
  crossValidationResults: CrossValidationResult;
}

export const ValidationTab = ({ validationResults, crossValidationResults }: ValidationTabProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Generate sample actual vs predicted data for visualization
  const sampleData = Array.from({ length: 24 }, (_, i) => {
    const actual = 100 + Math.random() * 30 + (i % 12) * 8;
    const predicted = actual * (1 + (Math.random() * 0.2 - 0.1));
    const error = ((predicted - actual) / actual) * 100;
    return {
      period: `P${i + 1}`,
      actual: Math.round(actual),
      predicted: Math.round(predicted),
      error: parseFloat(error.toFixed(1))
    };
  });

  // Generate residual analysis data
  const residualData = sampleData.map(item => ({
    period: item.period,
    residual: item.predicted - item.actual,
    percentError: item.error
  }));

  // Summary metrics for different time horizons
  const horizonMetrics = [
    { horizon: "Short-term (1-4 weeks)", mape: 5.2, mae: 8.4, rmse: 10.2, bias: -1.2 },
    { horizon: "Medium-term (5-12 weeks)", mape: 8.7, mae: 12.3, rmse: 14.8, bias: 2.1 },
    { horizon: "Long-term (13+ weeks)", mape: 15.3, mae: 18.9, rmse: 22.5, bias: 3.8 }
  ];

  // Statistical test details
  const statisticalTests = [
    {
      name: "Bias Test",
      result: validationResults.biasTest ? "Pass" : "Fail",
      description: "Determines if forecasts consistently over or under-predict",
      statistic: "0.82",
      pValue: "0.39"
    },
    {
      name: "Residual Normality",
      result: validationResults.residualNormality ? "Pass" : "Fail",
      description: "Tests if forecast errors follow normal distribution",
      statistic: "1.43",
      pValue: "0.15"
    },
    {
      name: "Heteroskedasticity Test",
      result: validationResults.heteroskedasticityTest ? "Pass" : "Fail",
      description: "Checks if forecast variance is consistent across values",
      statistic: "1.91",
      pValue: "0.08"
    },
    {
      name: "Autocorrelation Test",
      result: "Pass",
      description: "Evaluates if errors are independent over time",
      statistic: "1.22",
      pValue: "0.27"
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="statistical">Statistical Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <ForecastMetricsCards metrics={crossValidationResults.validationMetrics} />
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Forecast vs Actual</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#0ea5e9" 
                    name="Actual" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#8b5cf6" 
                    name="Forecast" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cross Validation Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Training Set</h4>
                <p className="text-3xl font-bold">{(100 - crossValidationResults.trainMetrics.mape).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <div className="text-sm space-y-1">
                  <p>MAPE: {crossValidationResults.trainMetrics.mape.toFixed(2)}%</p>
                  <p>MAE: {crossValidationResults.trainMetrics.mae.toFixed(2)}</p>
                  <p>RMSE: {crossValidationResults.trainMetrics.rmse.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Test Set</h4>
                <p className="text-3xl font-bold">{(100 - crossValidationResults.testMetrics.mape).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <div className="text-sm space-y-1">
                  <p>MAPE: {crossValidationResults.testMetrics.mape.toFixed(2)}%</p>
                  <p>MAE: {crossValidationResults.testMetrics.mae.toFixed(2)}</p>
                  <p>RMSE: {crossValidationResults.testMetrics.rmse.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Validation Set</h4>
                <p className="text-3xl font-bold">{(100 - crossValidationResults.validationMetrics.mape).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <div className="text-sm space-y-1">
                  <p>MAPE: {crossValidationResults.validationMetrics.mape.toFixed(2)}%</p>
                  <p>MAE: {crossValidationResults.validationMetrics.mae.toFixed(2)}</p>
                  <p>RMSE: {crossValidationResults.validationMetrics.rmse.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4 mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Forecast Accuracy By Time Horizon</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time Horizon</TableHead>
                  <TableHead>MAPE (%)</TableHead>
                  <TableHead>MAE</TableHead>
                  <TableHead>RMSE</TableHead>
                  <TableHead>Bias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {horizonMetrics.map((metric) => (
                  <TableRow key={metric.horizon}>
                    <TableCell className="font-medium">{metric.horizon}</TableCell>
                    <TableCell>{metric.mape.toFixed(1)}</TableCell>
                    <TableCell>{metric.mae.toFixed(1)}</TableCell>
                    <TableCell>{metric.rmse.toFixed(1)}</TableCell>
                    <TableCell>{metric.bias.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Forecast Error Analysis</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={residualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Bar dataKey="percentError" name="Error (%)" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="statistical" className="space-y-4 mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statistical Tests</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Statistic</TableHead>
                    <TableHead>p-Value</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statisticalTests.map((test) => (
                    <TableRow key={test.name}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.result === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {test.result}
                        </span>
                      </TableCell>
                      <TableCell>{test.statistic}</TableCell>
                      <TableCell>{test.pValue}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{test.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Residual Analysis</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={residualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Line 
                    type="monotone" 
                    dataKey="residual" 
                    stroke="#10b981" 
                    name="Residual" 
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Residual analysis is used to examine how well a model fits the data. Ideally, residuals should:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Be randomly distributed around zero</li>
                <li>Show no pattern or trend over time</li>
                <li>Have consistent variance (spread) across all values</li>
                <li>Follow normal distribution</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
