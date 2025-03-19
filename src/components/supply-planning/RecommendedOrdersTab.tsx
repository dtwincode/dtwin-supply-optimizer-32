
import { useState, useEffect } from "react";
import { useInventory } from "@/hooks/useInventory";
import { InventoryItem } from "@/types/inventory";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { PlusCircle, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { calculateBufferZones, calculateNetFlowPosition, shouldCreatePurchaseOrder, calculateOrderQuantity } from "@/utils/inventoryUtils";
import { useCreatePurchaseOrder } from "@/hooks/useCreatePurchaseOrder";

export const RecommendedOrdersTab = () => {
  const { items, loading, error } = useInventory();
  const { language } = useLanguage();
  const { toast } = useToast();
  const createPurchaseOrder = useCreatePurchaseOrder();
  const [processingItem, setProcessingItem] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [itemsWithOrderData, setItemsWithOrderData] = useState<(InventoryItem & { orderQuantity: number })[]>([]);

  // Process items to determine which need replenishment
  useEffect(() => {
    const processItems = async () => {
      const itemsNeedingReplenishment: InventoryItem[] = [];
      const itemsWithData: (InventoryItem & { orderQuantity: number })[] = [];

      for (const item of items) {
        try {
          const bufferZones = await calculateBufferZones(item);
          const netFlow = calculateNetFlowPosition(item);
          const shouldOrder = shouldCreatePurchaseOrder(netFlow.netFlowPosition, bufferZones);
          
          if (shouldOrder) {
            itemsNeedingReplenishment.push(item);
            
            const orderQuantity = calculateOrderQuantity(
              netFlow.netFlowPosition,
              bufferZones,
              item.minimumOrderQuantity || 0
            );
            
            itemsWithData.push({
              ...item,
              orderQuantity
            });
          }
        } catch (err) {
          console.error(`Error processing item ${item.sku}:`, err);
        }
      }
      
      setFilteredItems(itemsNeedingReplenishment);
      setItemsWithOrderData(itemsWithData);
    };
    
    if (items.length > 0 && !loading) {
      processItems();
    }
  }, [items, loading]);

  const handleCreatePO = async (item: InventoryItem & { orderQuantity: number }) => {
    try {
      setProcessingItem(item.sku);
      
      await createPurchaseOrder({
        sku: item.sku,
        quantity: item.orderQuantity,
        status: 'planned',
        supplier: item.preferredSupplier || '',
        expectedDeliveryDate: new Date(Date.now() + (item.leadTimeDays || 30) * 24 * 60 * 60 * 1000)
      });
      
      toast({
        title: getTranslation("supplyPlanning.notifications.poCreated", language),
        description: getTranslation("supplyPlanning.notifications.poCreatedDesc", language)
      });
    } catch (err) {
      console.error("Error creating PO:", err);
      toast({
        title: getTranslation("supplyPlanning.notifications.poError", language),
        description: getTranslation("supplyPlanning.notifications.poErrorDesc", language),
        variant: "destructive"
      });
    } finally {
      setProcessingItem(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p>{getTranslation("inventory.loadingData", language)}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p>{getTranslation("inventory.errorLoading", language)}</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">
          {getTranslation("supplyPlanning.recommendedOrders", language)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {getTranslation("supplyPlanning.recommendedOrdersDesc", language)}
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{getTranslation("inventory.sku", language)}</TableHead>
            <TableHead>{getTranslation("inventory.name", language)}</TableHead>
            <TableHead>
              <div className="flex items-center">
                {getTranslation("supplyPlanning.currentStock", language)}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                {getTranslation("supplyPlanning.recommendedQty", language)}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>{getTranslation("supplyPlanning.supplier", language)}</TableHead>
            <TableHead>{getTranslation("supplyPlanning.leadTime", language)}</TableHead>
            <TableHead className="text-right">{getTranslation("inventory.actions", language)}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsWithOrderData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                {getTranslation("supplyPlanning.noRecommendedOrders", language)}
              </TableCell>
            </TableRow>
          ) : (
            itemsWithOrderData.map((item) => (
              <TableRow key={item.sku}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.orderQuantity}</TableCell>
                <TableCell>{item.preferredSupplier || "-"}</TableCell>
                <TableCell>{item.leadTimeDays} {getTranslation("supplyPlanning.days", language)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => handleCreatePO(item)}
                    disabled={processingItem === item.sku}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {processingItem === item.sku
                      ? getTranslation("supplyPlanning.creating", language)
                      : getTranslation("supplyPlanning.createPO", language)}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
