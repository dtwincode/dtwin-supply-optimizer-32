
import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useInventory } from "@/hooks/useInventory";
import { InventoryItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import InventoryFilters from "./InventoryFilters";
import InventorySummaryCards from "./InventorySummaryCards";
import { InventoryTable } from "./InventoryTable";
import { InventoryChart } from "./InventoryChart";
import { NetworkDecouplingMap } from "./NetworkDecouplingMap";
import { SKUClassifications } from "./SKUClassifications";
import { createPurchaseOrder } from "@/services/inventoryService";

export const InventoryDashboard = () => {
  const { 
    items, 
    loading, 
    filters, 
    pagination, 
    updateFilters, 
    changePage, 
    refreshData 
  } = useInventory();
  
  const { toast } = useToast();

  const handleCreatePurchaseOrder = useCallback(async (item: InventoryItem) => {
    try {
      const result = await createPurchaseOrder(item.sku, 100);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        refreshData();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    }
  }, [toast, refreshData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Manage and track inventory levels
          </p>
          <div className="flex gap-2">
            <InventoryFilters
              searchQuery={filters.searchQuery || ""}
              setSearchQuery={query => updateFilters({ searchQuery: query })}
            />
          </div>
        </div>
      </div>

      <InventorySummaryCards />
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">SKU Classifications</h3>
        <SKUClassifications classifications={[]} />
      </Card>
      
      <NetworkDecouplingMap />
      
      <InventoryChart data={items} />

      <Card>
        <InventoryTable 
          items={items}
          loading={loading}
          pagination={pagination}
          onPageChange={changePage}
          onCreatePO={handleCreatePurchaseOrder}
        />
      </Card>
    </div>
  );
};
