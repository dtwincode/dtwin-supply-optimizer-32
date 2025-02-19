
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface IntegratedData {
  date: string;
  actual_value: number;
  sku: string;
  // Product hierarchy levels
  l1_main_prod: string;
  l2_prod_line: string;
  l3_prod_category: string;
  l4_device_make: string;
  l5_prod_sub_category: string;
  l6_device_model: string;
  l7_device_color: string;
  l8_device_storage: string;
  // Location hierarchy levels
  region: string;
  city: string;
  country: string;
  channel: string;
  sub_channel: string;
  warehouse: string;
}

export function IntegratedDataPreview() {
  const [data, setData] = useState<IntegratedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIntegrating, setIsIntegrating] = useState(false);

  const fetchData = async () => {
    try {
      console.log('Fetching integrated data...');
      const { data: integratedData, error } = await supabase
        .from('integrated_forecast_data')
        .select(`
          date,
          actual_value,
          sku,
          l1_main_prod,
          l2_prod_line,
          l3_prod_category,
          l4_device_make,
          l5_prod_sub_category,
          l6_device_model,
          l7_device_color,
          l8_device_storage,
          region,
          city,
          country,
          channel,
          sub_channel,
          warehouse
        `);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Raw integrated data:', integratedData);

      if (!integratedData || integratedData.length === 0) {
        console.log('No data found in integrated_forecast_data table');
        setData([]);
        setIsLoading(false);
        return;
      }

      const transformedData: IntegratedData[] = integratedData.map(item => ({
        date: item.date,
        actual_value: item.actual_value || 0,
        sku: item.sku || 'N/A',
        l1_main_prod: item.l1_main_prod || 'N/A',
        l2_prod_line: item.l2_prod_line || 'N/A',
        l3_prod_category: item.l3_prod_category || 'N/A',
        l4_device_make: item.l4_device_make || 'N/A',
        l5_prod_sub_category: item.l5_prod_sub_category || 'N/A',
        l6_device_model: item.l6_device_model || 'N/A',
        l7_device_color: item.l7_device_color || 'N/A',
        l8_device_storage: item.l8_device_storage || 'N/A',
        region: item.region || 'N/A',
        city: item.city || 'N/A',
        country: item.country || 'N/A',
        channel: item.channel || 'N/A',
        sub_channel: item.sub_channel || 'N/A',
        warehouse: item.warehouse || 'N/A'
      }));

      console.log('Transformed data:', transformedData);
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching integrated data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch integrated data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIntegration = async () => {
    setIsIntegrating(true);
    try {
      console.log('Starting data integration process...');
      
      // Check if we have the required data
      const { data: historicalData, error: historicalError } = await supabase
        .from('historical_sales_data')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (historicalError) throw historicalError;
      
      if (!historicalData || historicalData.length === 0) {
        throw new Error('No historical sales data found');
      }

      console.log('Found historical sales data:', historicalData);

      // Proceed with integration
      const { data: result, error } = await supabase.rpc('populate_integrated_forecast_data');
      
      if (error) {
        console.error('Integration function error:', error);
        throw error;
      }
      
      console.log('Integration completed, result:', result);
      
      toast({
        title: "Success",
        description: "Data integration completed successfully.",
      });
      
      // Refresh the data after integration
      await fetchData();
    } catch (error: any) {
      console.error('Integration error:', error);
      toast({
        title: "Integration Failed",
        description: error.message || "Failed to integrate data. Please ensure you have uploaded historical sales data.",
        variant: "destructive",
      });
    } finally {
      setIsIntegrating(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Integrated Dataset Preview</h3>
              <p className="text-sm text-muted-foreground">
                View and manage the combined forecast data from all sources
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleIntegration}
                disabled={isIntegrating}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                {isIntegrating ? "Integrating..." : "Integrate Data"}
              </Button>
              <Button
                variant="outline"
                onClick={fetchData}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading integrated data...</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>SKU</TableHead>
                    {/* Product Hierarchy */}
                    <TableHead>Main Product</TableHead>
                    <TableHead>Product Line</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Device Make</TableHead>
                    <TableHead>Sub Category</TableHead>
                    <TableHead>Device Model</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Storage</TableHead>
                    {/* Location Hierarchy */}
                    <TableHead>Region</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Sub Channel</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead className="text-right">Actual Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={17} className="text-center py-4">
                        No integrated data available. Click "Integrate Data" to populate the table.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                        <TableCell>{row.sku}</TableCell>
                        <TableCell>{row.l1_main_prod}</TableCell>
                        <TableCell>{row.l2_prod_line}</TableCell>
                        <TableCell>{row.l3_prod_category}</TableCell>
                        <TableCell>{row.l4_device_make}</TableCell>
                        <TableCell>{row.l5_prod_sub_category}</TableCell>
                        <TableCell>{row.l6_device_model}</TableCell>
                        <TableCell>{row.l7_device_color}</TableCell>
                        <TableCell>{row.l8_device_storage}</TableCell>
                        <TableCell>{row.region}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>{row.channel}</TableCell>
                        <TableCell>{row.sub_channel}</TableCell>
                        <TableCell>{row.warehouse}</TableCell>
                        <TableCell className="text-right">{row.actual_value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
