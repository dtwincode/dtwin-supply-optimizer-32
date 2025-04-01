
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThresholdConfig } from "@/hooks/useThresholdConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  ReferenceLine,
  Tooltip as RechartsTooltip
} from 'recharts';

interface InventoryItem {
  id: string;
  product_id: string;
  sku?: string;
  name?: string;
  lead_time_days?: number;
  variability_factor?: number;
  decoupling_point?: boolean;
}

interface DecouplingAnalyticsProps {
  items: InventoryItem[];
}

export function DecouplingAnalytics({ items }: DecouplingAnalyticsProps) {
  const { config } = useThresholdConfig();
  
  // Prepare data for scatter plot
  const scatterData = items
    .filter(item => item.lead_time_days !== undefined && item.variability_factor !== undefined)
    .map(item => ({
      id: item.id,
      name: item.name || item.sku || item.product_id,
      leadTime: item.lead_time_days,
      variability: item.variability_factor,
      isDecoupling: item.decoupling_point || false
    }));
  
  // Custom tooltip for scatter plot
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs">
          <p className="font-medium">{data.name}</p>
          <p>Lead Time: {data.leadTime} days</p>
          <p>Variability: {data.variability?.toFixed(2)}</p>
          <p>
            Status: {data.isDecoupling ? 
              <Badge className="ml-1 bg-blue-100 text-blue-800">Decoupling Point</Badge> : 
              <Badge className="ml-1" variant="outline">Regular Point</Badge>
            }
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Count decoupling points vs regular points
  const decouplingCount = scatterData.filter(item => item.isDecoupling).length;
  const regularCount = scatterData.length - decouplingCount;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Decoupling Point Analytics</CardTitle>
            <CardDescription>
              Visualize and analyze decoupling point positioning based on percentile thresholds
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full bg-muted p-1.5">
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>
                  Decoupling points are determined by applying the Bayesian threshold of {config?.decoupling_threshold.toFixed(2) || '0.75'} 
                  to identify strategic inventory positioning. Points above the threshold lines are candidates for decoupling points.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualization">
          <TabsList>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Decoupling Threshold Visualization</p>
                  <p className="text-xs text-muted-foreground">
                    Current threshold: {config?.decoupling_threshold.toFixed(2) || '0.75'} (Bayesian optimized)
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span className="text-xs">Decoupling Points</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                    <span className="text-xs">Regular Points</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="leadTime" 
                      name="Lead Time" 
                      unit=" days" 
                      domain={['dataMin - 1', 'dataMax + 1']} 
                      label={{ value: 'Lead Time (days)', position: 'bottom' }} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="variability" 
                      name="Variability" 
                      domain={['dataMin - 0.1', 'dataMax + 0.1']} 
                      label={{ value: 'Variability Factor', angle: -90, position: 'left' }} 
                    />
                    <ZAxis range={[60, 60]} />
                    <RechartsTooltip content={<CustomScatterTooltip />} />
                    <ReferenceLine 
                      y={config?.demand_variability_threshold || 0.6} 
                      stroke="red" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: 'Variability Threshold', 
                        position: 'right',
                        fill: 'red'
                      }} 
                    />
                    <Scatter 
                      name="Regular Points" 
                      data={scatterData.filter(item => !item.isDecoupling)} 
                      fill="#9CA3AF" 
                    />
                    <Scatter 
                      name="Decoupling Points" 
                      data={scatterData.filter(item => item.isDecoupling)} 
                      fill="#3B82F6" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-none border">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{decouplingCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">Decoupling Points</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {((decouplingCount / (decouplingCount + regularCount)) * 100).toFixed(1)}% of total inventory points
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-none border">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-600">{regularCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">Regular Points</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {((regularCount / (decouplingCount + regularCount)) * 100).toFixed(1)}% of total inventory points
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Decoupling Point Criteria</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</div>
                    <p>High variability (above {config?.demand_variability_threshold.toFixed(2) || '0.6'})</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</div>
                    <p>Strategic position in the supply network</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</div>
                    <p>Critical to customer service levels</p>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
