
import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useI18n } from "@/contexts/I18nContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";
import { Classification } from "@/types/inventory/classificationTypes";
import { useInventory } from "@/hooks/useInventory";
import { InventoryTab } from "@/components/inventory/InventoryTab";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { ThresholdManagement } from "@/components/inventory/ThresholdManagement";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Pin, Clock, BarChart } from "lucide-react";
import { fetchLocationWithNames } from "@/lib/inventory-planning.service";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import { DecouplingDashboard } from "@/components/inventory/decoupling/DecouplingDashboard";

const mergeInventoryData = (items: InventoryItem[]): InventoryItem[] => {
  return items.map(item => {
    // Create a unique ID if none exists
    const id = item.id || `${item.sku}-${item.location}` || `${item.sku}-${item.location}`;

    // Ensure classification data exists
    const classification: Classification = item.classification || {
      leadTimeCategory: item.leadTimeDays && item.leadTimeDays > 30 ? "long" : item.leadTimeDays && item.leadTimeDays > 15 ? "medium" : "short",
      variabilityLevel: item.variabilityFactor && item.variabilityFactor > 1 ? "high" : item.variabilityFactor && item.variabilityFactor > 0.5 ? "medium" : "low",
      criticality: item.decouplingPointId ? "high" : "low",
      score: item.maxStockLevel || 0
    };
    
    // Ensure basic inventory data exists
    return {
      ...item,
      id,
      sku: item.sku || "",
      name: item.name || item.sku || "",
      onHand: item.onHand || item.currentStock || 0,
      currentStock: item.currentStock || item.onHand || 0,
      location: item.location || "",
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
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [locations, setLocations] = useState<{
    id: string;
    name: string;
  }[]>([]);

  const {
    items,
    loading,
    error,
    pagination,
    paginate,
    refreshData,
    isRefreshing
  } = useInventory(1, 25, searchQuery, locationFilter, priorityOnly);
  const [paginatedData, setPaginatedData] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationData = await fetchLocationWithNames();
        setLocations([{
          id: 'all',
          name: 'All Locations'
        }, ...locationData]);
      } catch (err) {
        console.error('Error loading locations:', err);
      }
    };
    loadLocations();
  }, []);

  useEffect(() => {
    if (items && items.length > 0) {
      console.log("Processing inventory items:", items);
      const processedItems = mergeInventoryData(items);
      console.log("Processed inventory items:", processedItems);
      setClassified(processedItems);
      setPaginatedData(processedItems);
    } else if (!loading && items.length === 0) {
      console.log("No inventory items found");
      setClassified([]);
      setPaginatedData([]);
    }
  }, [items, loading]);

  const handleTabChange = (value: string) => {
    setSearchParams({
      tab: value
    });
  };

  const handleLocationChange = (location: string) => {
    setLocationFilter(location);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePriorityChange = (showPriority: boolean) => {
    setPriorityOnly(showPriority);
  };

  const handleRefresh = async () => {
    try {
      console.log("Refreshing inventory data");
      await refreshData();
    } catch (err) {
      console.error("Error refreshing data:", err);
      toast({
        title: "Error",
        description: "Failed to refresh inventory data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const paginationProps = {
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    onPageChange: paginate
  };

  return <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <PageHeader title={t("navigation.inventory")} description="Manage and monitor inventory across all your locations using inventory buffers and decoupling points.">
          <Badge className="bg-green-600 text-white ml-2" variant="outline">
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
            priorityOnly={priorityOnly}
            setPriorityOnly={handlePriorityChange}
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
            <Card className="p-0">
              <InventoryTab 
                paginatedData={paginatedData} 
                onRefresh={handleRefresh} 
                isRefreshing={isRefreshing}
                pagination={paginationProps}
              />
            </Card>
          </TabsContent>

          <TabsContent value="decoupling">
            <Card className="p-6">
              <DecouplingDashboard />
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
    </DashboardLayout>;
}

export default Inventory;
