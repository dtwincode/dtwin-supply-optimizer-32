
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
  product_name: string;
  l1_main_prod: string;
  region: string;
  city: string;
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
        .select('*')
        .limit(10);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Raw integrated data:', integratedData);

      const transformedData: IntegratedData[] = (integratedData || []).map(item => ({
        date: item.date,
        actual_value: item.actual_value,
        sku: item.sku,
        product_name: item.l1_main_prod,
        l1_main_prod: item.l1_main_prod,
        region: item.region,
        city: item.city,
        warehouse: item.warehouse
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
      const { data: result, error } = await supabase.rpc('populate_integrated_forecast_data');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Data integration completed successfully.",
      });
      
      // Refresh the data after integration
      await fetchData();
    } catch (error) {
      console.error('Integration error:', error);
      toast({
        title: "Integration Failed",
        description: "Failed to integrate data. Please ensure you have uploaded historical sales data.",
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
              <h3 className="text-lg font-medium">Integrated Data Preview</h3>
              <p className="text-sm text-muted-foreground">
                Review and manage integrated forecast data
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
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Main Product</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead className="text-right">Actual Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No integrated data available. Click "Integrate Data" to populate the table.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                        <TableCell>{row.sku}</TableCell>
                        <TableCell>{row.product_name}</TableCell>
                        <TableCell>{row.l1_main_prod}</TableCell>
                        <TableCell>{row.region}</TableCell>
                        <TableCell>{row.city}</TableCell>
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
