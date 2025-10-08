import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, AlertTriangle, Activity, Package, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useInventoryFilter } from '../InventoryFilterContext';
import { useInventoryData } from '@/hooks/useInventoryData';
import { UnifiedMetricCard } from '../shared/UnifiedMetricCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TrendData {
  period: string;
  serviceLevel: number;
  fillRate: number;
  stockouts: number;
}

/**
 * DDMRP Performance Dashboard - 8 SAP/Microsoft-standard KPIs
 * Refactored to use unified data service and calculations
 */
export const DDMRPPerformanceDashboard: React.FC = () => {
  const { filters } = useInventoryFilter();
  const { metrics, statusCounts, breaches, isLoading, filteredData } = useInventoryData(filters);

  // Generate trend data (simulated for now - would come from time-series data)
  const generateTrendData = (): TrendData[] => {
    const trendData: TrendData[] = [];
    for (let i = 11; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 5;
      trendData.push({
        period: `P${12 - i}`,
        serviceLevel: Math.max(0, Math.min(100, metrics.serviceLevel + variation)),
        fillRate: Math.max(0, Math.min(100, metrics.fillRate + variation)),
        stockouts: Math.floor(Math.random() * 10)
      });
    }
    return trendData;
  };

  // Breach analysis by severity
  const breachBySeverity = [
    { 
      severity: 'CRITICAL', 
      count: breaches.filter(b => b.severity === 'CRITICAL').length, 
      color: 'hsl(0 84% 60%)' 
    },
    { 
      severity: 'HIGH', 
      count: breaches.filter(b => b.severity === 'HIGH').length, 
      color: 'hsl(48 96% 53%)' 
    },
    { 
      severity: 'MEDIUM', 
      count: breaches.filter(b => b.severity === 'MEDIUM').length, 
      color: 'hsl(142 71% 45%)' 
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-24 bg-muted rounded" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const trends = generateTrendData();

  return (
    <div className="space-y-6">
      {/* Core 8 DDMRP KPIs - Using Unified Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UnifiedMetricCard
          title="Service Level %"
          value={`${metrics.serviceLevel.toFixed(1)}%`}
          icon={Target}
          subtitle="Items not in RED zone"
          benchmark="Target: ≥95%"
          status={
            metrics.serviceLevel >= 95 ? "healthy" : 
            metrics.serviceLevel >= 90 ? "warning" : "critical"
          }
        />

        <UnifiedMetricCard
          title="Fill Rate %"
          value={`${metrics.fillRate.toFixed(1)}%`}
          icon={Activity}
          subtitle="Average NFP/TOG ratio"
          benchmark="Target: ≥90%"
          status={
            metrics.fillRate >= 90 ? "healthy" : 
            metrics.fillRate >= 80 ? "warning" : "critical"
          }
        />

        <UnifiedMetricCard
          title="Inventory Turnover"
          value={`${metrics.inventoryTurnover.toFixed(1)}x`}
          icon={TrendingUp}
          subtitle="Times per year"
          benchmark="Target: ≥4x"
          status={
            metrics.inventoryTurnover >= 4 ? "healthy" : 
            metrics.inventoryTurnover >= 2 ? "warning" : "critical"
          }
        />

        <UnifiedMetricCard
          title="Days of Inventory"
          value={metrics.daysOfInventory.toFixed(0)}
          icon={Clock}
          subtitle="Days on hand"
          status="neutral"
        />

        <UnifiedMetricCard
          title="Stockout Frequency"
          value={metrics.stockoutFrequency.toFixed(2)}
          icon={AlertTriangle}
          subtitle="Breaches per item/month"
          status={
            metrics.stockoutFrequency < 0.1 ? "healthy" : 
            metrics.stockoutFrequency < 0.2 ? "warning" : "critical"
          }
        />

        <UnifiedMetricCard
          title="Buffer Health Score"
          value={metrics.bufferHealthScore.toFixed(0)}
          icon={Package}
          subtitle="Composite DDMRP score"
          benchmark="Target: ≥85"
          status={
            metrics.bufferHealthScore >= 85 ? "healthy" : 
            metrics.bufferHealthScore >= 70 ? "warning" : "critical"
          }
          className="border-2 border-primary/20"
        />

        <UnifiedMetricCard
          title="OTIF Compliance"
          value={`${metrics.otifCompliance.toFixed(1)}%`}
          icon={CheckCircle2}
          subtitle="On-Time In-Full"
          benchmark="Target: ≥95%"
          status="neutral"
        />

        <UnifiedMetricCard
          title="Avg Buffer Penetration"
          value={`${metrics.avgBufferPenetration.toFixed(0)}%`}
          icon={Activity}
          subtitle="NFP/TOR ratio"
          status="neutral"
        />
      </div>

      {/* Trend Analysis */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="breaches">Breach Analysis</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Service Level & Fill Rate Trends (Last 12 Periods)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="serviceLevel" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Service Level %" />
                <Area type="monotone" dataKey="fillRate" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45%)" fillOpacity={0.4} name="Fill Rate %" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stockout Events Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="stockouts" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} name="Stockout Events" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="breaches" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Buffer Breach Analysis by Severity (Last 30 Days)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {breachBySeverity.map((item, index) => (
                <Card key={index} className="p-4 border-l-4" style={{ borderLeftColor: item.color }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">{item.severity}</div>
                      <div className="text-3xl font-bold mt-1">{item.count}</div>
                    </div>
                    <AlertTriangle className="h-8 w-8" style={{ color: item.color }} />
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Breach Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <div className="font-medium">CRITICAL breaches require immediate action</div>
                  <div className="text-sm text-muted-foreground">NFP below TOR (Red Zone) - risk of stockout</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium">HIGH breaches need attention</div>
                  <div className="text-sm text-muted-foreground">NFP below TOY (Yellow Zone) - early warning</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Target: Zero CRITICAL breaches</div>
                  <div className="text-sm text-muted-foreground">Maintain NFP above TOR through proper buffer management</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Buffer Status Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 rounded">
                <div className="text-sm text-muted-foreground">RED Zone</div>
                <div className="text-3xl font-bold text-red-600">{statusCounts.red}</div>
              </div>
              <div className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                <div className="text-sm text-muted-foreground">YELLOW Zone</div>
                <div className="text-3xl font-bold text-yellow-600">{statusCounts.yellow}</div>
              </div>
              <div className="p-4 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20 rounded">
                <div className="text-sm text-muted-foreground">GREEN Zone</div>
                <div className="text-3xl font-bold text-green-600">{statusCounts.green}</div>
              </div>
              <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded">
                <div className="text-sm text-muted-foreground">BLUE Zone</div>
                <div className="text-3xl font-bold text-blue-600">{statusCounts.blue}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Total Inventory Items</h3>
            <div className="text-5xl font-bold text-primary">{filteredData.length}</div>
            <p className="text-sm text-muted-foreground mt-2">Items in current view</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
