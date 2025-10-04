import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { useInventoryFilter } from '../InventoryFilterContext';

interface BufferData {
  name: string;
  red_zone: number;
  yellow_zone: number;
  green_zone: number;
  tor: number;
  toy: number;
  tog: number;
  nfp: number;
  on_hand: number;
  on_order: number;
  qualified_demand: number;
  status: string;
}

export const InteractiveBufferChart: React.FC = () => {
  const { filters } = useInventoryFilter();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<BufferData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  useEffect(() => {
    if (selectedProduct) {
      loadChartData(selectedProduct);
    }
  }, [selectedProduct]);

  const loadProducts = async () => {
    try {
      const data = await fetchInventoryPlanningView();
      let filtered = data;
      
      if (filters.productId) {
        filtered = filtered.filter(item => item.product_id === filters.productId);
      }
      if (filters.locationId) {
        filtered = filtered.filter(item => item.location_id === filters.locationId);
      }

      setProducts(filtered);
      if (filtered.length > 0 && !selectedProduct) {
        setSelectedProduct(`${filtered[0].product_id}-${filtered[0].location_id}`);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChartData = async (productLocationKey: string) => {
    try {
      const data = await fetchInventoryPlanningView();
      const item = data.find(d => `${d.product_id}-${d.location_id}` === productLocationKey);
      
      if (item) {
        setChartData({
          name: item.sku,
          red_zone: item.red_zone,
          yellow_zone: item.yellow_zone,
          green_zone: item.green_zone,
          tor: item.tor,
          toy: item.toy,
          tog: item.tog,
          nfp: item.nfp,
          on_hand: item.on_hand,
          on_order: item.on_order,
          qualified_demand: item.qualified_demand,
          status: item.buffer_status
        });
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-96 bg-muted animate-pulse rounded" />
      </Card>
    );
  }

  const bufferZoneData = chartData ? [
    { zone: 'Red Zone', value: chartData.red_zone, fill: 'hsl(0 84% 60%)' },
    { zone: 'Yellow Zone', value: chartData.yellow_zone, fill: 'hsl(48 96% 53%)' },
    { zone: 'Green Zone', value: chartData.green_zone, fill: 'hsl(142 71% 45%)' }
  ] : [];

  const flowData = chartData ? [
    { component: 'On Hand', value: chartData.on_hand },
    { component: 'On Order', value: chartData.on_order },
    { component: 'Qual. Demand', value: -chartData.qualified_demand },
    { component: 'NFP', value: chartData.nfp }
  ] : [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Interactive Buffer Analysis</h3>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map(product => (
              <SelectItem 
                key={`${product.product_id}-${product.location_id}`} 
                value={`${product.product_id}-${product.location_id}`}
              >
                {product.sku} - {product.location_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buffer Zones Chart */}
          <div>
            <h4 className="text-sm font-medium mb-4">Buffer Zone Configuration</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bufferZoneData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="zone" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {bufferZoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <ReferenceLine x={chartData.nfp} stroke="hsl(var(--primary))" strokeWidth={2} label="NFP" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold">TOR</div>
                <div>{chartData.tor.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">TOY</div>
                <div>{chartData.toy.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">TOG</div>
                <div>{chartData.tog.toFixed(0)}</div>
              </div>
            </div>
          </div>

          {/* Net Flow Position Chart */}
          <div>
            <h4 className="text-sm font-medium mb-4">Net Flow Position (NFP) Calculation</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="component" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {flowData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value >= 0 ? 'hsl(142 71% 45%)' : 'hsl(0 84% 60%)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">NFP Formula:</div>
              <div className="text-xs text-muted-foreground">
                NFP = On Hand + On Order - Qualified Demand
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                = {chartData.on_hand.toFixed(0)} + {chartData.on_order.toFixed(0)} - {chartData.qualified_demand.toFixed(0)} = <span className="font-semibold">{chartData.nfp.toFixed(0)}</span>
              </div>
              <div className="mt-3 text-sm">
                Status: <span className={`font-semibold ${
                  chartData.status === 'GREEN' ? 'text-green-600' :
                  chartData.status === 'YELLOW' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{chartData.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
