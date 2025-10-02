import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MOQData {
  sku: string;
  product_id: string;
  supplier_id: string | null;
  moq_units: number;
  avg_daily_demand: number;
  days_coverage: number | null;
  moq_rigidity_score: number;
}

export function MOQDataTab() {
  const [data, setData] = useState<MOQData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: moqData, error } = await supabase
        .from('moq_data')
        .select('*')
        .order('moq_rigidity_score', { ascending: false });

      if (error) throw error;
      setData(moqData || []);
    } catch (error) {
      console.error("Error fetching MOQ data:", error);
      toast({
        title: "Error",
        description: "Failed to load MOQ data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Minimum Order Quantity (MOQ) Data</CardTitle>
            <CardDescription>
              Supplier MOQ constraints and rigidity scoring affecting buffer calculations
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
                <TableHead>SKU</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">MOQ Units</TableHead>
                <TableHead className="text-right">Avg Daily Demand</TableHead>
                <TableHead className="text-right">Days Coverage</TableHead>
                <TableHead className="text-right">Rigidity Score</TableHead>
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
                    No MOQ data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={`${item.sku}-${item.product_id}`}>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.product_id}</TableCell>
                    <TableCell>{item.supplier_id || "N/A"}</TableCell>
                    <TableCell className="text-right">{item.moq_units}</TableCell>
                    <TableCell className="text-right">{item.avg_daily_demand.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{(item.days_coverage || 0).toFixed(1)} days</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          item.moq_rigidity_score >= 80 ? "destructive" : 
                          item.moq_rigidity_score >= 60 ? "default" : "secondary"
                        }
                      >
                        {item.moq_rigidity_score}
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
