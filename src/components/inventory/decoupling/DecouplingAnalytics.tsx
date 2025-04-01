
import { useEffect, useState } from "react";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export function DecouplingAnalytics() {
  const { decouplingPoints } = useDecouplingPoints();
  const [typeData, setTypeData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  
  useEffect(() => {
    if (decouplingPoints.length > 0) {
      // Calculate distribution by type
      const typeCount: Record<string, number> = {};
      decouplingPoints.forEach(point => {
        if (typeCount[point.type]) {
          typeCount[point.type]++;
        } else {
          typeCount[point.type] = 1;
        }
      });
      
      const typeDataArray = Object.entries(typeCount).map(([name, value]) => ({
        name: formatTypeName(name),
        value
      }));
      setTypeData(typeDataArray);
      
      // Calculate distribution by source (auto vs manual)
      const autoCount = decouplingPoints.filter(p => !p.isOverride).length;
      const manualCount = decouplingPoints.filter(p => p.isOverride).length;
      
      setSourceData([
        { name: 'Auto-generated', value: autoCount, fill: '#4CAF50' },
        { name: 'Manual Override', value: manualCount, fill: '#FF9800' }
      ]);
    }
  }, [decouplingPoints]);
  
  const formatTypeName = (type: string) => {
    switch (type) {
      case 'strategic': return 'Strategic';
      case 'customer_order': return 'Customer Order';
      case 'stock_point': return 'Stock Point';
      case 'intermediate': return 'Intermediate';
      default: return type;
    }
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a569bd'];
  const SOURCE_COLORS = ['#4CAF50', '#FF9800'];
  
  if (decouplingPoints.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No decoupling points data available for analysis
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Decoupling Point Types</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} points`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Auto vs Manual Creation</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} points`, 'Count']} />
                <Bar dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm">
            <p className="mb-2"><span className="inline-block w-3 h-3 bg-green-500 mr-2"></span> <strong>Auto-generated:</strong> Points based on threshold calculations in the inventory_planning_view</p>
            <p><span className="inline-block w-3 h-3 bg-orange-500 mr-2"></span> <strong>Manual override:</strong> Points created through user adjustments</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Decoupling Point Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700">Strategic Points</h4>
              <p className="mt-2 text-sm text-blue-600">
                Strategic decoupling points are for items with high variability and long lead times. 
                They help buffer against unpredictable demand and supply disruptions.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700">Customer Order Points</h4>
              <p className="mt-2 text-sm text-green-600">
                Customer order decoupling points separate forecast-driven flow from order-driven operations. 
                They're ideal for products with moderate variability.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700">Stock Points</h4>
              <p className="mt-2 text-sm text-purple-600">
                Stock points are used for items with shorter lead times but still requiring some buffer 
                against variability. They help maintain service levels.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Data Sources:</h4>
            <p className="text-sm text-muted-foreground">
              Auto-generated points are calculated based on demand variability and lead time thresholds from the <code>inventory_planning_view</code> database view.
              Manual overrides are stored in the <code>buffer_profile_override</code> table.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
