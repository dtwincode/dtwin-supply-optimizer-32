
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, Scatter
} from 'recharts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
  BarChart4,
  CircleDot
} from "lucide-react";
import type {
  SeasonalityPattern,
  ChangePoint,
  StatisticalTest,
  PatternAnomaly,
  PatternAnalysisResult
} from "@/types/forecasting";

interface PatternAnalysisTabProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

export const PatternAnalysisTab = ({ data }: PatternAnalysisTabProps) => {
  const [analysisResults, setAnalysisResults] = useState<PatternAnalysisResult>({
    seasonality: [],
    changePoints: [],
    statisticalTests: [],
    anomalies: []
  });
  const { toast } = useToast();

  useEffect(() => {
    performAnalysis();
  }, [data]);

  const performAnalysis = async () => {
    try {
      // Placeholder for actual analysis logic
      // In a real implementation, this would call your backend services
      const mockResults: PatternAnalysisResult = {
        seasonality: [
          {
            id: "1",
            dataset_id: "mock",
            pattern_type: "weekly",
            frequency: 7,
            strength: 0.8,
            detected_at: new Date().toISOString(),
            last_updated_at: new Date().toISOString(),
            configuration: {},
            metadata: { confidence: 0.95 }
          }
        ],
        changePoints: [
          {
            id: "1",
            timestamp: new Date().toISOString(),
            confidence: 0.95,
            type: "level_shift",
            magnitude: 1.5
          }
        ],
        statisticalTests: [
          {
            name: "ADF Test",
            statistic: -3.5,
            pValue: 0.01,
            criticalValues: { "1%": -3.43, "5%": -2.86, "10%": -2.57 },
            result: "significant"
          }
        ],
        anomalies: [
          {
            id: "1",
            timestamp: new Date().toISOString(),
            value: 100,
            expected_value: 80,
            deviation_score: 2.5,
            type: "outlier",
            confidence: 0.95
          }
        ]
      };

      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Error performing pattern analysis:', error);
      toast({
        title: "Error",
        description: "Failed to perform pattern analysis",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Tabs defaultValue="seasonality" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="seasonality">
            <Calendar className="w-4 h-4 mr-2" />
            Seasonality
          </TabsTrigger>
          <TabsTrigger value="changepoints">
            <TrendingUp className="w-4 h-4 mr-2" />
            Change Points
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart4 className="w-4 h-4 mr-2" />
            Statistical Tests
          </TabsTrigger>
          <TabsTrigger value="anomalies">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Anomalies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seasonality">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Seasonality Analysis</h3>
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => format(parseISO(date.toString()), 'MMM dd, yyyy')}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <ScrollArea className="h-[200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pattern Type</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Strength</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResults.seasonality.map((pattern) => (
                      <TableRow key={pattern.id}>
                        <TableCell className="font-medium">
                          {pattern.pattern_type}
                        </TableCell>
                        <TableCell>{pattern.frequency}</TableCell>
                        <TableCell>{(pattern.strength * 100).toFixed(1)}%</TableCell>
                        <TableCell>
                          {(pattern.metadata.confidence * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="changepoints">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Change Point Detection</h3>
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => format(parseISO(date.toString()), 'MMM dd, yyyy')}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      dot={false}
                    />
                    {analysisResults.changePoints.map((cp) => (
                      <ReferenceLine
                        key={cp.id}
                        x={cp.timestamp}
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{ value: cp.type, position: 'top' }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <ScrollArea className="h-[200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Magnitude</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResults.changePoints.map((cp) => (
                      <TableRow key={cp.id}>
                        <TableCell className="font-medium">{cp.type}</TableCell>
                        <TableCell>
                          {format(parseISO(cp.timestamp), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{cp.magnitude.toFixed(2)}</TableCell>
                        <TableCell>{(cp.confidence * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statistical Analysis</h3>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Statistic</TableHead>
                    <TableHead>P-Value</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysisResults.statisticalTests.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{test.statistic.toFixed(3)}</TableCell>
                      <TableCell>{test.pValue.toFixed(3)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={test.result === 'significant' ? 'default' : 'secondary'}
                        >
                          {test.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Anomaly Detection</h3>
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => format(parseISO(date.toString()), 'MMM dd, yyyy')}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      dot={false}
                    />
                    {analysisResults.anomalies.map((anomaly) => (
                      <Scatter
                        key={anomaly.id}
                        data={[{ date: anomaly.timestamp, value: anomaly.value }]}
                        fill="red"
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <ScrollArea className="h-[200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Deviation</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResults.anomalies.map((anomaly) => (
                      <TableRow key={anomaly.id}>
                        <TableCell className="font-medium">{anomaly.type}</TableCell>
                        <TableCell>
                          {format(parseISO(anomaly.timestamp), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {((anomaly.value - anomaly.expected_value) / anomaly.expected_value * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell>{(anomaly.confidence * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
