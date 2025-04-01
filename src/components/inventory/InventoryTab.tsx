
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { BufferStatusBadge } from "./BufferStatusBadge";
import { BufferVisualizer } from "./BufferVisualizer";
import { CreatePODialog } from "./CreatePODialog";
import { InventoryItem } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { calculateBufferZones } from "@/utils/inventoryUtils";

interface BufferZones {
  red: number;
  yellow: number;
  green: number;
}

interface NetFlowPosition {
  onHand: number;
  onOrder: number;
  qualifiedDemand: number;
  netFlowPosition: number;
}

const calculateNetFlowPosition = (item: InventoryItem): NetFlowPosition => {
  try {
    const onHand = item.onHand || item.quantity_on_hand || 0;
    const onOrder = item.onOrder || 0;
    const qualifiedDemand = item.qualifiedDemand || 0;
    const netFlowPosition = onHand + onOrder - qualifiedDemand;
    
    return { onHand, onOrder, qualifiedDemand, netFlowPosition };
  } catch (error) {
    console.error("Error calculating net flow position:", error);
    return { onHand: 0, onOrder: 0, qualifiedDemand: 0, netFlowPosition: 0 };
  }
};

const calculateBufferPenetration = (netFlowPosition: number, bufferZones: BufferZones): number => {
  try {
    const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
    if (totalBuffer <= 0) return 0;
    
    const penetration = ((totalBuffer - netFlowPosition) / totalBuffer) * 100;
    return Math.max(0, Math.min(100, penetration));
  } catch (error) {
    console.error("Error calculating buffer penetration:", error);
    return 0;
  }
};

const getBufferStatus = (bufferPenetration: number): 'green' | 'yellow' | 'red' => {
  try {
    if (bufferPenetration <= 33) return 'green';
    if (bufferPenetration <= 66) return 'yellow';
    return 'red';
  } catch (error) {
    console.error("Error determining buffer status:", error);
    return 'green';
  }
};

interface InventoryTabProps {
  paginatedData: InventoryItem[];
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export const InventoryTab = ({ 
  paginatedData, 
  onRefresh, 
  isRefreshing = false,
  pagination 
}: InventoryTabProps) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [itemBuffers, setItemBuffers] = useState<Record<string, {
    bufferZones: BufferZones;
    netFlow: NetFlowPosition;
    bufferPenetration: number;
    status: 'green' | 'yellow' | 'red';
  }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBufferData = async () => {
      try {
        console.log("Loading buffer data for", paginatedData.length, "items");
        if (!paginatedData || paginatedData.length === 0) {
          setItemBuffers({});
          setLoading(false);
          return;
        }
        
        const bufferData: Record<string, any> = {};
        
        for (const item of paginatedData) {
          const uniqueKey = item.id || `${item.product_id}-${item.location_id}` || `${item.sku}-${item.location}`;
          if (!uniqueKey) {
            console.warn("Item without unique key:", item);
            continue;
          }
          
          console.log("Processing item:", uniqueKey, item);
          
          // Calculate buffer zones
          const bufferZones = await calculateBufferZones(item);
          console.log("Buffer zones calculated:", bufferZones);
          
          // Calculate net flow position
          const netFlow = calculateNetFlowPosition(item);
          console.log("Net flow calculated:", netFlow);
          
          // Calculate buffer penetration
          const bufferPenetration = calculateBufferPenetration(netFlow.netFlowPosition, bufferZones);
          console.log("Buffer penetration calculated:", bufferPenetration);
          
          // Determine buffer status
          const status = getBufferStatus(bufferPenetration);
          console.log("Buffer status determined:", status);
          
          bufferData[uniqueKey] = {
            bufferZones,
            netFlow,
            bufferPenetration,
            status
          };
        }
        
        console.log("Buffer data populated:", bufferData);
        setItemBuffers(bufferData);
        setError(null);
      } catch (error) {
        console.error("Error calculating buffer data:", error);
        setError("Failed to load buffer data");
        toast({
          title: t("common.error") || "Error",
          description: t("common.inventory.errorLoading") || "Failed to load inventory data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadBufferData();
  }, [paginatedData, toast, t]);

  const handleRefresh = async () => {
    if (onRefresh) {
      try {
        await onRefresh();
        toast({
          title: "Data refreshed",
          description: "Inventory data has been updated.",
        });
      } catch (error) {
        toast({
          title: "Refresh failed",
          description: "Could not refresh inventory data. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center">{t("common.inventory.loadingData") || "Loading inventory data..."}</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Buffer Management</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {!paginatedData || paginatedData.length === 0 ? (
        <div className="text-center py-10 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">{t("common.inventory.noItems") || "No inventory items found"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedData.map((item) => {
            const uniqueKey = item.id || `${item.product_id}-${item.location_id}` || `${item.sku}-${item.location}`;
            if (!uniqueKey) {
              return null;
            }
            
            const bufferData = itemBuffers[uniqueKey];
            
            if (!bufferData) {
              console.warn("No buffer data found for item:", uniqueKey);
              return (
                <div key={uniqueKey} className="text-muted-foreground text-center p-4 border rounded">
                  {t("common.inventory.loadingItem") || "Loading item..."}
                </div>
              );
            }

            return (
              <div key={uniqueKey} className="bg-white border rounded-md overflow-hidden">
                <Table>
                  <InventoryTableHeader />
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{item.sku || item.product_id || "N/A"}</TableCell>
                      <TableCell>{item.name || item.product_id || "N/A"}</TableCell>
                      <TableCell>{typeof item.onHand === 'number' ? item.onHand : (typeof item.quantity_on_hand === 'number' ? item.quantity_on_hand : "N/A")}</TableCell>
                      <TableCell>
                        <BufferStatusBadge status={bufferData.status} />
                      </TableCell>
                      <TableCell>
                        <BufferVisualizer 
                          netFlowPosition={bufferData.netFlow.netFlowPosition}
                          bufferZones={bufferData.bufferZones}
                          adu={item.adu || item.average_daily_usage}
                        />
                      </TableCell>
                      <TableCell>{item.location || item.location_id || "N/A"}</TableCell>
                      <TableCell>{item.productFamily || "N/A"}</TableCell>
                      <TableCell>{item.classification?.leadTimeCategory || "N/A"}</TableCell>
                      <TableCell>{item.classification?.variabilityLevel || "N/A"}</TableCell>
                      <TableCell>{item.classification?.criticality || "N/A"}</TableCell>
                      <TableCell>{item.classification?.score ?? "N/A"}</TableCell>
                      <TableCell>
                        <CreatePODialog 
                          item={item}
                          bufferZones={bufferData.bufferZones}
                          onSuccess={() => handleRefresh()}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </div>
      )}
      
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <span className="py-2 px-3 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
