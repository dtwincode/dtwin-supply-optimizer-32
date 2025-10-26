import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ForecastDataPoint {
  date: string;
  actual: number | null;
  forecast: number;
  product_id: string;
  product_name: string;
}

export const ForecastingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadForecastData(selectedProduct);
    }
  }, [selectedProduct]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('product_master')
        .select('product_id, name, sku')
        .eq('product_type', 'FINISHED_GOOD')
        .limit(50);

      if (error) throw error;
      setProducts(data || []);
      if (data && data.length > 0) {
        setSelectedProduct(data[0].product_id);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadForecastData = async (productId: string) => {
    setLoading(true);
    try {
      // Load historical sales data (last 90 days)
      const { data: historical, error: histError } = await supabase
        .from('historical_sales_data')
        .select('sales_date, quantity_sold')
        .eq('product_id', productId)
        .gte('sales_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('sales_date', { ascending: true });

      if (histError) throw histError;

      // Generate simple moving average forecast (next 30 days)
      const avgDemand = historical && historical.length > 0
        ? historical.reduce((sum, d) => sum + (d.quantity_sold || 0), 0) / historical.length
        : 0;

      const chartData: ForecastDataPoint[] = [];

      // Add historical data
      if (historical) {
        historical.forEach((d) => {
          chartData.push({
            date: new Date(d.sales_date).toLocaleDateString(),
            actual: d.quantity_sold,
            forecast: 0,
            product_id: productId,
            product_name: ''
          });
        });
      }

      // Add forecast data (next 30 days)
      for (let i = 1; i <= 30; i++) {
        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + i);
        chartData.push({
          date: forecastDate.toLocaleDateString(),
          actual: null,
          forecast: Math.round(avgDemand),
          product_id: productId,
          product_name: ''
        });
      }

      setForecastData(chartData);
    } catch (error) {
      console.error('Error loading forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No finished products found. Please add products in Settings or mark existing products as finished goods.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Product Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Finished Product</CardTitle>
          <CardDescription>Choose a finished product to view forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.product_id} value={p.product_id}>
                  {p.name} ({p.sku})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast (90-Day History + 30-Day Forecast)</CardTitle>
          <CardDescription>Actual demand vs forecasted demand</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Actual Demand"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Forecasted Demand"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
