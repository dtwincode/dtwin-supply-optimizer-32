import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StorageRequirement {
  storage_type: string;
  sku: string;
  product_id: string;
  units_per_carton: number;
  cartons_per_pallet: number;
  cubic_meters_per_unit: number;
  storage_footprint_per_1000_units: number | null;
  storage_intensity_score: number;
}

export function StorageRequirementsTab() {
  const [data, setData] = useState<StorageRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: storageData, error } = await supabase
        .from('storage_requirements')
        .select('*')
        .order('storage_intensity_score', { ascending: false });

      if (error) throw error;
      setData(storageData || []);
    } catch (error) {
      console.error("Error fetching storage requirements:", error);
      toast({
        title: "Error",
        description: "Failed to load storage requirements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStorageTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      'FROZEN': 'destructive',
      'CHILLED': 'default',
      'DRY': 'secondary',
      'AMBIENT': 'secondary'
    };
    return variants[type] || 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Storage Requirements</CardTitle>
            <CardDescription>
              Physical storage characteristics and space intensity scoring
            </CardDescription>
          </div>
          <Button onClick={fetchData} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Storage Type</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead className="text-right">Units/Carton</TableHead>
                <TableHead className="text-right">Cartons/Pallet</TableHead>
                <TableHead className="text-right">m³/Unit</TableHead>
                <TableHead className="text-right">Footprint/1K</TableHead>
                <TableHead className="text-right">Intensity Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No storage requirements data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={`${item.storage_type}-${item.sku}-${item.product_id}`}>
                    <TableCell>
                      <Badge variant={getStorageTypeBadge(item.storage_type)}>
                        {item.storage_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.product_id}</TableCell>
                    <TableCell className="text-right">{item.units_per_carton}</TableCell>
                    <TableCell className="text-right">{item.cartons_per_pallet}</TableCell>
                    <TableCell className="text-right">{item.cubic_meters_per_unit.toFixed(3)}</TableCell>
                    <TableCell className="text-right">{(item.storage_footprint_per_1000_units || 0).toFixed(0)}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          item.storage_intensity_score >= 80 ? "destructive" : 
                          item.storage_intensity_score >= 60 ? "default" : "secondary"
                        }
                      >
                        {item.storage_intensity_score}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
