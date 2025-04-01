
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryItem } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Filter, AlertTriangle } from "lucide-react";
import { EnhancedInventoryTable } from "../EnhancedInventoryTable";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

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

export const InventoryTab = ({ paginatedData, onRefresh, isRefreshing = false, pagination }: InventoryTabProps) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (error) {
        toast({
          title: "Refresh failed",
          description: "Could not refresh inventory data. Please try again.",
          variant: "destructive",
        });
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

  const getPriorityCount = () => {
    return paginatedData.filter(item => {
      const stockRatio = item.quantity_on_hand && item.max_stock_level 
        ? item.quantity_on_hand / item.max_stock_level 
        : 1;
      return stockRatio < 0.5;  
    }).length;
  };

  if (isRefreshing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Buffer Management</CardTitle>
          <CardDescription>Refreshing inventory data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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

  const priorityCount = getPriorityCount();

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
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
              <div className="flex items-center justify-end">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="priority-mode" 
                    checked={showPriorityOnly} 
                    onCheckedChange={(checked) => setShowPriorityOnly(checked)}
                  />
                  <Label htmlFor="priority-mode" className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                    Priority Mode
                    {priorityCount > 0 && (
                      <span className="ml-1 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                        {priorityCount}
                      </span>
                    )}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />
          
          <EnhancedInventoryTable data={paginatedData} priorityHighlight={showPriorityOnly} />
          
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t flex justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {paginatedData.length} items
          {showPriorityOnly && priorityCount > 0 && ` (${priorityCount} priority items)`}
        </div>
      </CardFooter>
    </Card>
  );
};
