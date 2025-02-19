
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
  // Location hierarchy levels
  region: string;
  city: string;
  warehouse: string;
  channel: string;
}

export function IntegratedDataPreview() {
  const [data, setData] = useState<IntegratedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIntegrating, setIsIntegrating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching integrated data...');
      const { data: integratedData, error } = await supabase
        .from('integrated_forecast_data')
        .select('*');

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Raw integrated data:', integratedData);

      if (!integratedData || integratedData.length === 0) {
        console.log('No data found in integrated_forecast_data table');
        setData([]);
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
        region: item.region || 'N/A',
        city: item.city || 'N/A',
        warehouse: item.warehouse || 'N/A',
        channel: item.channel || 'N/A'
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

  const handleIntegration = async () => {
    setIsIntegrating(true);
    try {
      console.log('Starting data integration process...');
      
      // First check if we have historical data
      const { data: historicalData, error: historicalError } = await supabase
        .from('historical_sales_data')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (historicalError) {
        console.error('Historical data query error:', historicalError);
        throw historicalError;
      }
      
      if (!historicalData || historicalData.length === 0) {
        console.log('No historical sales data found');
        throw new Error('No historical sales data found. Please upload historical sales data first.');
      }

      // Log the structure of historical data
      console.log('Found historical sales data:', historicalData);
      console.log('Historical data structure:', {
        hasData: historicalData.length > 0,
        firstRecord: historicalData[0],
        dataStructure: historicalData[0]?.data ? 
          `Array with ${Array.isArray(historicalData[0].data) ? historicalData[0].data.length : 0} items` : 
          'No data array found'
      });

      // Call the populate function
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Integrated Dataset Preview</h3>
              <p className="text-lg text-muted-foreground">
                View and manage the combined forecast data from all sources
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleIntegration}
                disabled={isIntegrating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg"
                size="lg"
              >
                <Database className="h-5 w-5" />
                {isIntegrating ? "Integrating..." : "Integrate Data"}
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchData()}
                disabled={isLoading}
                className="flex items-center gap-2 text-lg"
                size="lg"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading integrated data...</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto border rounded-md">
              <div className="max-h-[600px] overflow-y-auto">
                <div className="min-w-[1600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Date</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Sales Value</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">SKU</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Region</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">City</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Warehouse</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Channel</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Main Product</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Product Line</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Category</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Device Make</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Sub Category</TableHead>
                        <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Device Model</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-center py-4">
                            No integrated data available. Click "Integrate Data" to populate the table.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell className="whitespace-nowrap px-6">{new Date(row.date).toLocaleDateString()}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.actual_value}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.sku}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.region}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.city}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.warehouse}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.channel}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.l1_main_prod}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.l2_prod_line}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.l3_prod_category}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.l4_device_make}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.l5_prod_sub_category}</TableCell>
                            <TableCell className="whitespace-nowrap px-6">{row.l6_device_model}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
