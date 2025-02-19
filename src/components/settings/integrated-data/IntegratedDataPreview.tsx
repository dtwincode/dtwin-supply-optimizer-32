
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: integratedData, error } = await supabase
          .from('integrated_forecast_data')
          .select(`
            date,
            actual_value,
            sku,
            product_hierarchy (
              name,
              l1_main_prod
            ),
            location_hierarchy (
              region,
              city,
              warehouse
            )
          `)
          .limit(10);

        if (error) throw error;

        // Transform the joined data to match IntegratedData interface
        const transformedData: IntegratedData[] = (integratedData || []).map(item => ({
          date: item.date,
          actual_value: item.actual_value,
          sku: item.sku,
          product_name: item.product_hierarchy?.name || '',
          l1_main_prod: item.product_hierarchy?.l1_main_prod || '',
          region: item.location_hierarchy?.region || '',
          city: item.location_hierarchy?.city || '',
          warehouse: item.location_hierarchy?.warehouse || ''
        }));

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching integrated data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Loading integrated data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Integrated Data Preview</h3>
          <p className="text-sm text-muted-foreground">
            This table shows the integrated forecast data structure with related product and location information.
          </p>
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
                  <TableHead>Actual Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell>{row.product_name}</TableCell>
                    <TableCell>{row.l1_main_prod}</TableCell>
                    <TableCell>{row.region}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.warehouse}</TableCell>
                    <TableCell>{row.actual_value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
