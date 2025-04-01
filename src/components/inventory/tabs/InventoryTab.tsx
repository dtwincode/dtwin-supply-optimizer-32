
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryItem } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Filter } from "lucide-react";
import { EnhancedInventoryTable } from "../EnhancedInventoryTable";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface InventoryTabProps {
  paginatedData: InventoryItem[];
  onRefresh?: () => Promise<void>;
}

export const InventoryTab = ({ paginatedData, onRefresh }: InventoryTabProps) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState<'table' | 'card'>('table');

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast({
          title: "Data refreshed",
          description: "Inventory data has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Refresh failed",
          description: "Could not refresh inventory data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = [
        "SKU", 
        "Name", 
        "Current Stock", 
        "Product Family", 
        "Lead Time", 
        "Variability", 
        "Safety Stock", 
        "Min Level", 
        "Max Level", 
        "Location"
      ];
      
      const csvRows = [headers];
      
      paginatedData.forEach(item => {
        csvRows.push([
          item.product_id || "",
          item.name || "",
          String(item.quantity_on_hand || 0),
          item.productFamily || "",
          String(item.lead_time_days || 0),
          String(item.demand_variability || 0),
          String(item.safety_stock || 0),
          String(item.min_stock_level || 0),
          String(item.max_stock_level || 0),
          item.location_id || ""
        ]);
      });
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `inventory_data_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Inventory data has been exported to CSV.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export inventory data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!paginatedData || paginatedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Buffer Management</CardTitle>
          <CardDescription>No inventory data available</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <p className="text-muted-foreground mb-4">
              No inventory items found. Try adjusting your filters or refreshing the data.
            </p>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Inventory Buffer Management</CardTitle>
            <CardDescription>View and manage inventory buffers across all locations</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Buffer Visualization Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-red-200 mr-2"></div>
                <span className="text-gray-700">Red Zone (Safety Stock)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-yellow-200 mr-2"></div>
                <span className="text-gray-700">Yellow Zone (Min-Safety)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-200 mr-2"></div>
                <span className="text-gray-700">Green Zone (Max-Min)</span>
              </div>
            </div>
          </div>

          <Separator />
          
          <EnhancedInventoryTable data={paginatedData} />
        </div>
      </CardContent>
      <CardFooter className="border-t flex justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {paginatedData.length} items
        </div>
      </CardFooter>
    </Card>
  );
};
