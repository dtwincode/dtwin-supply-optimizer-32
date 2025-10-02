import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface SupplierPerformance {
  supplier_id: string;
  on_time_delivery_rate: number | null;
  quality_score: number | null;
  quality_reject_rate: number | null;
  alternate_suppliers_count: number | null;
  reliability_score: number | null;
  last_updated: string | null;
}

export function SupplierPerformanceTab() {
  const [data, setData] = useState<SupplierPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: supplierData, error } = await supabase
        .from('supplier_performance')
        .select('*')
        .order('reliability_score', { ascending: false });

      if (error) throw error;
      setData(supplierData || []);
    } catch (error) {
      console.error("Error fetching supplier performance:", error);
      toast({
        title: "Error",
        description: "Failed to load supplier performance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPerformanceBadge = (score: number) => {
    if (score >= 0.9) return "default";
    if (score >= 0.8) return "secondary";
    return "destructive";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Supplier Performance</CardTitle>
            <CardDescription>
              Supplier reliability metrics affecting decoupling decisions (10% weight)
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
                <TableHead>Supplier ID</TableHead>
                <TableHead>On-Time Delivery</TableHead>
                <TableHead>Quality Score</TableHead>
                <TableHead className="text-right">Reject Rate</TableHead>
                <TableHead className="text-right">Alt Suppliers</TableHead>
                <TableHead>Reliability Score</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No supplier performance data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.supplier_id}>
                    <TableCell className="font-medium">{item.supplier_id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{((item.on_time_delivery_rate || 0) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(item.on_time_delivery_rate || 0) * 100} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{((item.quality_score || 0) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(item.quality_score || 0) * 100} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {((item.quality_reject_rate || 0) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">{item.alternate_suppliers_count || 0}</TableCell>
                    <TableCell>
                      <Badge variant={getPerformanceBadge(item.reliability_score || 0)}>
                        {((item.reliability_score || 0) * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.last_updated ? new Date(item.last_updated).toLocaleDateString() : "N/A"}
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
