import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuMapping {
  sku: string;
  product_id: string;
  menu_items_count: number;
  sales_impact_percentage: number;
  is_core_item: boolean;
  criticality_score: number;
}

export function MenuMappingTab() {
  const [data, setData] = useState<MenuMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: menuData, error } = await supabase
        .from('menu_mapping')
        .select('*')
        .order('criticality_score', { ascending: false });

      if (error) throw error;
      setData(menuData || []);
    } catch (error) {
      console.error("Error fetching menu mapping:", error);
      toast({
        title: "Error",
        description: "Failed to load menu mapping data",
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
            <CardTitle>Menu Mapping</CardTitle>
            <CardDescription>
              Map products to menu items and define criticality for strategic decoupling decisions
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
                <TableHead className="text-right">Menu Items</TableHead>
                <TableHead className="text-right">Sales Impact %</TableHead>
                <TableHead>Core Item</TableHead>
                <TableHead className="text-right">Criticality Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No menu mapping data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={`${item.sku}-${item.product_id}`}>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.product_id}</TableCell>
                    <TableCell className="text-right">{item.menu_items_count}</TableCell>
                    <TableCell className="text-right">{item.sales_impact_percentage.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant={item.is_core_item ? "default" : "secondary"}>
                        {item.is_core_item ? "Core" : "Standard"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          item.criticality_score >= 80 ? "destructive" : 
                          item.criticality_score >= 60 ? "default" : "secondary"
                        }
                      >
                        {item.criticality_score}
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
