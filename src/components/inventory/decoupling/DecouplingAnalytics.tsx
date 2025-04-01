
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";

export function DecouplingAnalytics() {
  const { decouplingPoints, loading } = useDecouplingPoints();
  
  // Prepare data for decoupling points by type
  const decouplingByType = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    
    decouplingPoints.forEach(point => {
      const type = point.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [decouplingPoints]);

  // Prepare data for decoupling points by location chart
  const decouplingByLocation = useMemo(() => {
    const locations: Record<string, number> = {};
    
    decouplingPoints.forEach(item => {
      const location = item.locationId || 'Unknown';
      locations[location] = (locations[location] || 0) + 1;
    });
    
    return Object.entries(locations).map(([name, value]) => ({ name, value }));
  }, [decouplingPoints]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-muted-foreground">Loading analytics...</span>
      </div>
    );
  }

  if (decouplingPoints.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-muted-foreground">No decoupling points to analyze</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-[300px]">
        <h3 className="text-sm font-medium mb-4">Decoupling Points by Type</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={decouplingByType}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {decouplingByType.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-[300px]">
        <h3 className="text-sm font-medium mb-4">Decoupling Points by Location</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={decouplingByLocation}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Number of Points" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="md:col-span-2">
        <h3 className="text-sm font-medium mb-2">Decoupling Point Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="p-3 border rounded-md">
            <div className="text-xs text-muted-foreground">Strategic</div>
            <div className="text-xl font-bold">
              {decouplingPoints.filter(p => p.type === 'strategic').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              High lead time, high variability
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-xs text-muted-foreground">Customer Order</div>
            <div className="text-xl font-bold">
              {decouplingPoints.filter(p => p.type === 'customer_order').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Moderate lead time, high service level
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-xs text-muted-foreground">Stock Point</div>
            <div className="text-xl font-bold">
              {decouplingPoints.filter(p => p.type === 'stock_point').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Low lead time, requires buffer
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-xs text-muted-foreground">Intermediate</div>
            <div className="text-xl font-bold">
              {decouplingPoints.filter(p => p.type === 'intermediate').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Other configurations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
