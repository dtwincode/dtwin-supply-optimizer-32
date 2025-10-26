import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ForecastDataPoint {
  date: string;
  actual: number | null;
  forecast: number | null;
  product_id: string;
  location_id: string;
  product_name: string;
  location_name: string;
}

interface AggregatedForecast {
  dimension: string;
  actual_total: number;
  forecast_total: number;
  variance: number;
  accuracy: number;
}

export const ForecastingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [aggregationLevel, setAggregationLevel] = useState<string>("product-location");
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedForecast[]>([]);
  const [activeModel, setActiveModel] = useState<string>("Simple Moving Average");
  const [modelDetails, setModelDetails] = useState<any>(null);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [selectedModelName, setSelectedModelName] = useState<string>('best');

  useEffect(() => {
    loadMasterData();
  }, []);

  useEffect(() => {
    loadForecastData();
  }, [selectedProduct, selectedLocation, selectedRegion, aggregationLevel, selectedModelName]);

  const loadMasterData = async () => {
    try {
      // Load finished products
      const { data: productsData, error: prodError } = await supabase
        .from('product_master')
        .select('product_id, name, sku, category')
        .eq('product_type', 'FINISHED_GOOD')
        .limit(100);

      if (prodError) throw prodError;
      setProducts(productsData || []);

      // Load locations
      const { data: locationsData, error: locError } = await supabase
        .from('location_master')
        .select('location_id, region, location_type')
        .limit(100);

      if (locError) throw locError;
      setLocations(locationsData || []);

      // Extract unique regions
      const uniqueRegions = [...new Set(locationsData?.map(l => l.region).filter(Boolean) as string[])];
      setRegions(uniqueRegions);

    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const loadForecastData = async () => {
    setLoading(true);
    try {
      console.log('Starting loadForecastData...');
      console.log('Filters:', { selectedProduct, selectedLocation, selectedRegion, aggregationLevel });
      
      // First, determine which locations to query based on region filter
      let locationIds: string[] = [];
      if (selectedRegion !== 'ALL') {
        const filteredLocations = locations.filter(l => l.region === selectedRegion);
        locationIds = filteredLocations.map(l => l.location_id);
        console.log('Filtered locations for region:', locationIds.length);
        
        if (locationIds.length === 0) {
          // No locations match the region filter
          console.log('No locations match the selected region');
          setForecastData([]);
          setAggregatedData([]);
          setLoading(false);
          return;
        }
      }

      // Build query with filters
      let query = supabase
        .from('historical_sales_data')
        .select('sales_date, quantity_sold, product_id, location_id, product_master!historical_sales_data_product_id_fkey(name)')
        .gte('sales_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('sales_date', { ascending: true });

      // Apply product filter
      if (selectedProduct !== 'ALL') {
        query = query.eq('product_id', selectedProduct);
      }

      // Apply location filter
      if (selectedLocation !== 'ALL') {
        query = query.eq('location_id', selectedLocation);
      } else if (selectedRegion !== 'ALL' && locationIds.length > 0) {
        // If region is selected but not specific location, filter by locations in that region
        query = query.in('location_id', locationIds);
      }

      const { data: historical, error: histError } = await query;
      if (histError) {
        console.error('Database query error:', histError);
        throw histError;
      }

      console.log('Historical data fetched:', historical?.length || 0, 'records');

      // Enrich data with region information from locations array
      const filteredData = (historical || []).map((h: any) => ({
        ...h,
        region: locations.find(l => l.location_id === h.location_id)?.region
      }));

      console.log('Enriched data:', filteredData.length, 'records');

      // Fetch all available models for selected product-location
      if (selectedProduct !== 'ALL' && selectedLocation !== 'ALL') {
        const { data: allModels, error: modelError } = await supabase
          .from('forecast_model_selection')
          .select('*')
          .eq('product_id', selectedProduct)
          .eq('location_id', selectedLocation)
          .order('smape', { ascending: true });

        if (!modelError && allModels && allModels.length > 0) {
          setAvailableModels(allModels);
          
          // Set active model based on selection
          if (selectedModelName === 'best') {
            const bestModel = allModels[0];
            setActiveModel(bestModel.model_name);
            setModelDetails(bestModel);
            console.log('Using model:', bestModel.model_name, 'with SMAPE:', bestModel.smape);
          } else {
            const selectedModel = allModels.find(m => m.model_name === selectedModelName) || allModels[0];
            setActiveModel(selectedModel.model_name);
            setModelDetails(selectedModel);
            console.log('Using model:', selectedModel.model_name, 'with SMAPE:', selectedModel.smape);
          }
        } else {
          setActiveModel('Simple Moving Average (Default)');
          setModelDetails(null);
          setAvailableModels([]);
        }
      } else {
        setActiveModel('Aggregated - Multiple Models');
        setModelDetails(null);
        setAvailableModels([]);
      }

      // Aggregate based on level
      const aggregated = aggregateForecasts(filteredData);
      setAggregatedData(aggregated);

      // Generate time series forecast
      const avgDemand = filteredData.length > 0
        ? filteredData.reduce((sum: number, d: any) => sum + (d.quantity_sold || 0), 0) / filteredData.length
        : 0;

      console.log('Filtered data length:', filteredData.length);
      console.log('Average demand:', avgDemand);

      const chartData: ForecastDataPoint[] = [];

      // Add historical data (aggregated by date)
      const dateMap = new Map<string, number>();
      filteredData.forEach((d: any) => {
        const dateKey = new Date(d.sales_date).toISOString().split('T')[0];
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + d.quantity_sold);
      });

      // Sort dates and add to chart
      const sortedDates = Array.from(dateMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      sortedDates.forEach(([date, qty]) => {
        chartData.push({
          date: new Date(date).toLocaleDateString(),
          actual: qty,
          forecast: null,
          product_id: selectedProduct,
          location_id: selectedLocation,
          product_name: '',
          location_name: ''
        });
      });

      // Add forecast data (next 30 days) - start from last historical date
      const lastDate = sortedDates.length > 0 
        ? new Date(sortedDates[sortedDates.length - 1][0])
        : new Date();

      for (let i = 1; i <= 30; i++) {
        const forecastDate = new Date(lastDate);
        forecastDate.setDate(forecastDate.getDate() + i);
        chartData.push({
          date: forecastDate.toLocaleDateString(),
          actual: null,
          forecast: Math.round(avgDemand * (aggregationLevel === 'product-location' ? 1 : (locations.length || 1))),
          product_id: selectedProduct,
          location_id: selectedLocation,
          product_name: '',
          location_name: ''
        });
      }

      console.log('Chart data length:', chartData.length);
      console.log('Sample chart data (first 3):', chartData.slice(0, 3));
      console.log('Sample chart data (last 3):', chartData.slice(-3));
      
      setForecastData(chartData);
    } catch (error) {
      console.error('Error loading forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const aggregateForecasts = (data: any[]): AggregatedForecast[] => {
    const result: AggregatedForecast[] = [];

    switch (aggregationLevel) {
      case 'product':
        // Aggregate by product
        const productMap = new Map<string, { actual: number; count: number }>();
        data.forEach((d: any) => {
          const key = d.product_id;
          const curr = productMap.get(key) || { actual: 0, count: 0 };
          productMap.set(key, {
            actual: curr.actual + d.quantity_sold,
            count: curr.count + 1
          });
        });
        productMap.forEach((val, key) => {
          const forecast = val.actual / val.count * 30; // Simple projection
          result.push({
            dimension: key,
            actual_total: val.actual,
            forecast_total: forecast,
            variance: forecast - val.actual,
            accuracy: val.actual > 0 ? (1 - Math.abs(forecast - val.actual) / val.actual) * 100 : 0
          });
        });
        break;

      case 'location':
        // Aggregate by location
        const locationMap = new Map<string, { actual: number; count: number }>();
        data.forEach((d: any) => {
          const key = d.location_id;
          const curr = locationMap.get(key) || { actual: 0, count: 0 };
          locationMap.set(key, {
            actual: curr.actual + d.quantity_sold,
            count: curr.count + 1
          });
        });
        locationMap.forEach((val, key) => {
          const forecast = val.actual / val.count * 30;
          result.push({
            dimension: key,
            actual_total: val.actual,
            forecast_total: forecast,
            variance: forecast - val.actual,
            accuracy: val.actual > 0 ? (1 - Math.abs(forecast - val.actual) / val.actual) * 100 : 0
          });
        });
        break;

      case 'region':
        // Aggregate by region
        const regionMap = new Map<string, { actual: number; count: number }>();
        data.forEach((d: any) => {
          const key = d.region || 'Unknown';
          const curr = regionMap.get(key) || { actual: 0, count: 0 };
          regionMap.set(key, {
            actual: curr.actual + d.quantity_sold,
            count: curr.count + 1
          });
        });
        regionMap.forEach((val, key) => {
          const forecast = val.actual / val.count * 30;
          result.push({
            dimension: key,
            actual_total: val.actual,
            forecast_total: forecast,
            variance: forecast - val.actual,
            accuracy: val.actual > 0 ? (1 - Math.abs(forecast - val.actual) / val.actual) * 100 : 0
          });
        });
        break;

      default:
        // Product-Location level (most granular)
        const plMap = new Map<string, { actual: number; count: number }>();
        data.forEach((d: any) => {
          const key = `${d.product_id}|${d.location_id}`;
          const curr = plMap.get(key) || { actual: 0, count: 0 };
          plMap.set(key, {
            actual: curr.actual + d.quantity_sold,
            count: curr.count + 1
          });
        });
        plMap.forEach((val, key) => {
          const forecast = val.actual / val.count * 30;
          result.push({
            dimension: key,
            actual_total: val.actual,
            forecast_total: forecast,
            variance: forecast - val.actual,
            accuracy: val.actual > 0 ? (1 - Math.abs(forecast - val.actual) / val.actual) * 100 : 0
          });
        });
    }

    return result.sort((a, b) => b.actual_total - a.actual_total).slice(0, 10);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Hierarchical Forecasting Controls</CardTitle>
          <CardDescription>Select aggregation level and apply filters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Aggregation Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Aggregation Level</label>
            <Select value={aggregationLevel} onValueChange={setAggregationLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product-location">Product-Location (Most Granular)</SelectItem>
                <SelectItem value="product">Product (Aggregated)</SelectItem>
                <SelectItem value="location">Location (Aggregated)</SelectItem>
                <SelectItem value="region">Region (Highest Aggregation)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Regions</SelectItem>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Locations</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l.location_id} value={l.location_id}>
                      {l.location_id} ({l.location_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Products</SelectItem>
                  {products.map((p) => (
                    <SelectItem key={p.product_id} value={p.product_id}>
                      {p.name} ({p.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Model Selector Section */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-medium">Forecast Model</label>
            {selectedProduct !== 'ALL' && selectedLocation !== 'ALL' ? (
              availableModels.length > 0 ? (
                <Select value={selectedModelName} onValueChange={setSelectedModelName}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best">
                      Best Model: {availableModels[0]?.model_name} (SMAPE: {availableModels[0]?.smape?.toFixed(2)}%)
                    </SelectItem>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.model_name}>
                        {model.model_name} (SMAPE: {model.smape?.toFixed(2)}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No models evaluated yet for this product-location. Go to "Model Evaluation" tab to run evaluation.
                  </AlertDescription>
                </Alert>
              )
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Select a specific Product and Location above to choose a forecast model
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="timeseries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeseries">Time Series</TabsTrigger>
          <TabsTrigger value="aggregated">Aggregated View</TabsTrigger>
        </TabsList>

        <TabsContent value="timeseries">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Demand Forecast (90-Day History + 30-Day Forecast)</CardTitle>
                  <CardDescription>Actual vs forecasted demand at selected aggregation level</CardDescription>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    Active Model: {activeModel}
                  </Badge>
                  {modelDetails && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Accuracy: {modelDetails.smape?.toFixed(1)}% SMAPE | 
                      MAE: {modelDetails.mae?.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : forecastData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-2">
                    <AlertCircle className="h-12 w-12 mx-auto opacity-50" />
                    <p>No data available for the selected filters</p>
                    <p className="text-xs">Try selecting different product/location combinations</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
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
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Forecasted Demand"
                      connectNulls={false}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Model Info Card */}
          {modelDetails && selectedProduct !== 'ALL' && selectedLocation !== 'ALL' && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Selected Model Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Model</p>
                    <p className="font-semibold">{modelDetails.model_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">SMAPE</p>
                    <p className="font-semibold">{modelDetails.smape?.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">MAPE</p>
                    <p className="font-semibold">{modelDetails.mape?.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">MAE</p>
                    <p className="font-semibold">{modelDetails.mae?.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RMSE</p>
                    <p className="font-semibold">{modelDetails.rmse?.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Training Samples</p>
                    <p className="font-semibold">{modelDetails.training_samples}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Evaluated</p>
                    <p className="font-semibold text-xs">
                      {new Date(modelDetails.last_evaluated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant="default" className="text-xs">Best Fit</Badge>
                  </div>
                </div>
                {modelDetails.model_params && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Model Parameters:</p>
                    <pre className="text-xs">{JSON.stringify(modelDetails.model_params, null, 2)}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="aggregated">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 by Aggregation Level</CardTitle>
              <CardDescription>Aggregated actual vs forecast comparison</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dimension" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="actual_total" fill="hsl(var(--primary))" name="Actual (90d)" />
                      <Bar dataKey="forecast_total" fill="hsl(var(--destructive))" name="Forecast (30d)" />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Aggregated Table */}
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Dimension</th>
                          <th className="text-right p-2">Actual (90d)</th>
                          <th className="text-right p-2">Forecast (30d)</th>
                          <th className="text-right p-2">Variance</th>
                          <th className="text-right p-2">Accuracy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aggregatedData.map((row, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-2 font-medium">{row.dimension}</td>
                            <td className="text-right p-2">{row.actual_total.toFixed(0)}</td>
                            <td className="text-right p-2">{row.forecast_total.toFixed(0)}</td>
                            <td className="text-right p-2">
                              <Badge variant={row.variance >= 0 ? "default" : "destructive"} className="gap-1">
                                {row.variance >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {Math.abs(row.variance).toFixed(0)}
                              </Badge>
                            </td>
                            <td className="text-right p-2">{row.accuracy.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
