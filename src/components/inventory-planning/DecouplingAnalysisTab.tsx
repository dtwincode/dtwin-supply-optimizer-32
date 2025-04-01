
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DecouplingAnalysisTabProps {
  data: InventoryPlanningItem[];
  loading: boolean;
}

export function DecouplingAnalysisTab({ data, loading }: DecouplingAnalysisTabProps) {
  // Filter only decoupling points
  const decouplingPoints = useMemo(() => {
    return data.filter(item => item.decoupling_point);
  }, [data]);

  // Prepare data for decoupling points by location chart
  const decouplingByLocation = useMemo(() => {
    const locations: Record<string, number> = {};
    
    decouplingPoints.forEach(item => {
      const location = item.location_id || 'Unknown';
      locations[location] = (locations[location] || 0) + 1;
    });
    
    return Object.entries(locations).map(([name, value]) => ({ name, value }));
  }, [decouplingPoints]);

  // Calculate percentage of items that are decoupling points
  const decouplingPercentage = useMemo(() => {
    if (data.length === 0) return 0;
    return (decouplingPoints.length / data.length) * 100;
  }, [data, decouplingPoints]);

  // Prepare data for pie chart
  const decouplingStatusData = useMemo(() => {
    return [
      { name: 'Decoupling Points', value: decouplingPoints.length },
      { name: 'Regular Items', value: data.length - decouplingPoints.length }
    ];
  }, [data, decouplingPoints]);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#FFBB28'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No planning data found with the current filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Decoupling Points Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <div className="text-2xl font-bold">{decouplingPoints.length}</div>
              <div className="text-sm text-muted-foreground">Total Decoupling Points</div>
              
              <div className="text-2xl font-bold mt-4">{decouplingPercentage.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Decoupling Point Percentage</div>
              
              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Distribution by Location:</div>
                <ul className="space-y-1">
                  {decouplingByLocation.map((location, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{location.name}:</span>
                      <span className="font-medium">{location.value} points</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decouplingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {decouplingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Decoupling Points</CardTitle>
        </CardHeader>
        <CardContent>
          {decouplingPoints.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No decoupling points found with the current filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Lead Time (days)</TableHead>
                  <TableHead className="text-right">Avg. Daily Usage</TableHead>
                  <TableHead>Buffer Profile</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decouplingPoints.map((item) => (
                  <TableRow key={`${item.product_id}-${item.location_id}`}>
                    <TableCell className="font-medium">{item.product_id}</TableCell>
                    <TableCell>{item.location_id}</TableCell>
                    <TableCell className="text-right">{item.lead_time_days}</TableCell>
                    <TableCell className="text-right">{item.average_daily_usage.toLocaleString()}</TableCell>
                    <TableCell>{item.buffer_profile_id}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Decoupling Point</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Decoupling Points by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={decouplingByLocation}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Decoupling Points" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
