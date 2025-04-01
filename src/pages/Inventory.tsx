
import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useI18n } from "@/contexts/I18nContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";
import { useInventory } from "@/hooks/useInventory";
import { DecouplingNetworkBoard } from "@/components/inventory/DecouplingNetworkBoard";
import { InventoryTab } from "@/components/inventory/tabs/InventoryTab";
import { NetworkDecouplingMap } from "@/components/inventory/NetworkDecouplingMap";
import { SKUClassifications } from "@/components/inventory/SKUClassifications";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { ThresholdManagement } from "@/components/inventory/ThresholdManagement";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Pin, Clock, BarChart } from "lucide-react";
import { fetchLocationWithNames } from "@/lib/inventory-planning.service";
import InventoryFilters from "@/components/inventory/InventoryFilters";

// Function to merge item properties
const mergeInventoryData = (items: InventoryItem[]): InventoryItem[] => {
  return items.map(item => {
    // Generate a unique ID if not available
    const id = item.id || `${item.product_id}-${item.location_id}`;
    
    // Create classification if not available
    const classification = item.classification || {
      leadTimeCategory: item.lead_time_days && item.lead_time_days > 30 
        ? "long" 
        : item.lead_time_days && item.lead_time_days > 15 
        ? "medium" 
        : "short",
      variabilityLevel: item.demand_variability && item.demand_variability > 1 
        ? "high" 
        : item.demand_variability && item.demand_variability > 0.5 
        ? "medium" 
        : "low",
      criticality: item.decoupling_point ? "high" : "low",
      score: item.max_stock_level || 0
    };
    
    return {
      ...item,
      id,
      // Ensure sku and name are set
      sku: item.sku || item.product_id || "",
      name: item.name || item.product_id || "",
      // Ensure stock values are set
      onHand: item.onHand || item.quantity_on_hand || 0,
      currentStock: item.currentStock || item.quantity_on_hand || 0,
      // Standardize location
      location: item.location || item.location_id || "",
      classification
    };
  });
};

function Inventory() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "buffer";
  const { toast } = useToast();
  const [classified, setClassified] = useState<InventoryItem[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<{id: string, name: string}[]>([]);
  
  // Use the custom hook with default values
  const { items, loading, error, pagination, paginate, refreshData } = useInventory(1, 10, searchQuery, locationFilter);
  const [paginatedData, setPaginatedData] = useState<InventoryItem[]>([]);

  // Load locations for filter dropdown
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationData = await fetchLocationWithNames();
        setLocations([
          { id: 'all', name: 'All Locations' },
          ...locationData
        ]);
      } catch (err) {
        console.error('Error loading locations:', err);
      }
    };
    
    loadLocations();
  }, []);

  // Process and format inventory data
  useEffect(() => {
    if (items && items.length > 0) {
      const processedItems = mergeInventoryData(items);
      setClassified(processedItems);
      setPaginatedData(processedItems);
    } else if (!loading && items.length === 0) {
      setClassified([]);
      setPaginatedData([]);
    }
  }, [items, loading]);

  const handleCreatePO = useCallback((item: InventoryItem) => {
    toast({
      title: "Purchase Order Created",
      description: `A new purchase order has been created for ${item.sku || item.product_id}`,
    });
  }, [toast]);

  const handleTabChange = (value: string) => {
    // Update the URL query parameters
    setSearchParams({ tab: value });
  };

  const handleLocationChange = (location: string) => {
    setLocationFilter(location);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = async () => {
    try {
      await refreshData();
      toast({
        title: "Data Refreshed",
        description: "Inventory data has been refreshed from the database.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to refresh inventory data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <PageHeader
          title={t("navigation.inventory")}
          description="Manage and monitor inventory across all your locations using inventory buffers and decoupling points."
        >
          <Badge
            className="bg-green-600 text-white ml-2"
            variant="outline"
          >
            Phase 7
          </Badge>
        </PageHeader>

        <Separator className="my-6" />

        <div className="mb-6">
          <InventoryFilters 
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            selectedLocationId={locationFilter}
            setSelectedLocationId={handleLocationChange}
          />
        </div>

        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="buffer" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Buffer Management
            </TabsTrigger>
            <TabsTrigger value="decoupling" className="flex items-center gap-2">
              <Pin className="h-4 w-4" />
              Decoupling Points
            </TabsTrigger>
            <TabsTrigger value="classification" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Classification
            </TabsTrigger>
            <TabsTrigger value="thresholds" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Thresholds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buffer">
            <InventoryTab 
              paginatedData={paginatedData} 
              onCreatePO={handleCreatePO}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="decoupling">
            <Card className="p-6">
              <NetworkDecouplingMap />
              <DecouplingNetworkBoard />
            </Card>
          </TabsContent>

          <TabsContent value="classification">
            <Card className="p-6">
              <SKUClassifications />
            </Card>
          </TabsContent>

          <TabsContent value="thresholds">
            <Card className="p-6">
              <ThresholdManagement />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default Inventory;
