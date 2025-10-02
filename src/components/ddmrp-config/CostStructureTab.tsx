import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InventoryCarryingCost {
  location_id: string;
  product_category: string;
  storage_cost_per_unit_per_day: number;
  insurance_rate_annual: number | null;
  obsolescence_rate_annual: number | null;
  opportunity_cost_rate_annual: number | null;
}

interface WarehouseCostStructure {
  location_id: string;
  rent_per_sqm_monthly: number | null;
  utilities_cost_monthly: number | null;
  labor_cost_monthly: number | null;
  total_storage_sqm: number | null;
}

export function CostStructureTab() {
  const [carryingCosts, setCarryingCosts] = useState<InventoryCarryingCost[]>([]);
  const [warehouseCosts, setWarehouseCosts] = useState<WarehouseCostStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [carryingRes, warehouseRes] = await Promise.all([
        supabase.from('inventory_carrying_costs').select('*').order('location_id'),
        supabase.from('warehouse_cost_structure').select('*').order('location_id')
      ]);

      if (carryingRes.error) throw carryingRes.error;
      if (warehouseRes.error) throw warehouseRes.error;

      setCarryingCosts(carryingRes.data || []);
      setWarehouseCosts(warehouseRes.data || []);
    } catch (error) {
      console.error("Error fetching cost data:", error);
      toast({
        title: "Error",
        description: "Failed to load cost structure data",
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
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Structure
            </CardTitle>
            <CardDescription>
              Inventory carrying costs and warehouse operating expenses
            </CardDescription>
          </div>
          <Button onClick={fetchData} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="carrying">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="carrying">Inventory Carrying Costs</TabsTrigger>
            <TabsTrigger value="warehouse">Warehouse Operating Costs</TabsTrigger>
          </TabsList>

          <TabsContent value="carrying">
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Storage Cost/Unit/Day</TableHead>
                    <TableHead className="text-right">Insurance %</TableHead>
                    <TableHead className="text-right">Obsolescence %</TableHead>
                    <TableHead className="text-right">Opportunity Cost %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : carryingCosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No carrying cost data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    carryingCosts.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.location_id}</TableCell>
                        <TableCell>{item.product_category}</TableCell>
                        <TableCell className="text-right">
                          ${item.storage_cost_per_unit_per_day.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.insurance_rate_annual || 0) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.obsolescence_rate_annual || 0) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.opportunity_cost_rate_annual || 0) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="warehouse">
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Rent/m²/Month</TableHead>
                    <TableHead className="text-right">Utilities/Month</TableHead>
                    <TableHead className="text-right">Labor/Month</TableHead>
                    <TableHead className="text-right">Total m²</TableHead>
                    <TableHead className="text-right">Total Monthly Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : warehouseCosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No warehouse cost data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    warehouseCosts.map((item, idx) => {
                      const totalCost = 
                        ((item.rent_per_sqm_monthly || 0) * (item.total_storage_sqm || 0)) +
                        (item.utilities_cost_monthly || 0) +
                        (item.labor_cost_monthly || 0);
                      
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.location_id}</TableCell>
                          <TableCell className="text-right">
                            ${(item.rent_per_sqm_monthly || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${(item.utilities_cost_monthly || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ${(item.labor_cost_monthly || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {(item.total_storage_sqm || 0).toLocaleString()} m²
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${totalCost.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
