
import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useI18n } from "@/contexts/I18nContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { Card } from "@/components/ui/card";
import { inventoryData } from "@/data/inventoryData";
import { InventoryItem } from "@/types/inventory";
import { useInventory } from "@/hooks/useInventory";
import { DecouplingNetworkBoard } from "@/components/inventory/DecouplingNetworkBoard";
import { InventoryTab } from "@/components/inventory/tabs/InventoryTab";
import { NetworkDecouplingMap } from "@/components/inventory/NetworkDecouplingMap";
import { SKUClassifications } from "@/components/inventory/SKUClassifications";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { ThresholdManagement } from "@/components/inventory/ThresholdManagement";
import { motion } from "framer-motion";
import { InventoryTourGuide } from "@/components/inventory/InventoryTourGuide";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { classifyInventoryItems } from "@/utils/inventoryClassification";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Buffer, Clock, Package, Pin } from "lucide-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";

// Animation variants for staggered child animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Function to transform database items to match InventoryItem interface
const transformDatabaseItems = (items: any[]): InventoryItem[] => {
  return items.map(item => ({
    id: item.id || item.inventory_id || "",
    sku: item.sku || item.product_id || "",
    name: item.name || item.product_id || "",
    currentStock: item.quantity_on_hand || 0,
    category: item.category || "",
    subcategory: item.subcategory || "",
    location: item.location || item.location_id || "",
    productFamily: item.productFamily || "",
    region: item.region || "",
    city: item.city || "",
    channel: item.channel || "",
    warehouse: item.warehouse || "",
    onHand: item.onHand || item.quantity_on_hand || 0,
    onOrder: item.onOrder || 0,
    qualifiedDemand: item.qualifiedDemand || 0,
    netFlowPosition: item.netFlowPosition || 0,
    adu: item.adu || item.average_daily_usage || 0,
    leadTimeDays: item.leadTimeDays || item.lead_time_days || 0,
    variabilityFactor: item.variabilityFactor || item.demand_variability || 0,
    redZoneSize: item.redZoneSize || 0,
    yellowZoneSize: item.yellowZoneSize || 0,
    greenZoneSize: item.greenZoneSize || 0,
    bufferPenetration: item.bufferPenetration || 0,
    planningPriority: item.planningPriority || "",
    decouplingPointId: item.decouplingPointId || "",
    // Map database field to proper interface field
    product_id: item.product_id || "",
    quantity_on_hand: item.quantity_on_hand || 0,
    location_id: item.location_id || "",
    // Additional maps for backward compatibility
    inventory_id: item.inventory_id || "",
    reserved_qty: item.reserved_qty || 0,
    available_qty: item.available_qty || 0,
    last_updated: item.last_updated || "",
    buffer_profile_id: item.buffer_profile_id || "",
    decouplingPoint: item.decoupling_point || false,
    // Cache classification data if available
    classification: item.classification || {
      leadTimeCategory: item.leadTimeCategory || "medium",
      variabilityLevel: item.variabilityLevel || "medium",
      criticality: item.criticality || "medium",
      score: item.score || 50
    }
  }));
};

function Inventory() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "buffer";
  const { toast } = useToast();
  const [tourOpen, setTourOpen] = useState(false);
  const [classified, setClassified] = useState<InventoryItem[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  
  // Use the custom hook with default values
  const { items, loading, error, pagination, paginate, refreshData } = useInventory();
  
  const [paginatedData, setPaginatedData] = useState<InventoryItem[]>([]);

  // Transform database items and classify them
  useEffect(() => {
    if (items && items.length > 0) {
      const transformedItems = transformDatabaseItems(items);
      const classifiedItems = classifyInventoryItems(transformedItems);
      setClassified(classifiedItems);
      setPaginatedData(classifiedItems);
    } else if (!loading && items.length === 0) {
      // If no data from API, use mock data
      const mockClassified = classifyInventoryItems(inventoryData);
      setClassified(mockClassified);
      setPaginatedData(mockClassified);
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
    
    // Filter the data based on the selected location
    if (location) {
      const filtered = classified.filter(item => item.location === location || item.location_id === location);
      setPaginatedData(filtered);
    } else {
      setPaginatedData(classified);
    }
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto py-6 space-y-8"
      >
        <PageHeader
          title={t("navigation.inventory")}
          description="Manage and monitor inventory across all your locations using inventory buffers and decoupling points."
          actions={
            <motion.div variants={itemVariants}>
              <Badge
                className="bg-green-600 text-white ml-2"
                variant="outline"
              >
                Phase 7
              </Badge>
            </motion.div>
          }
        />

        <Separator className="my-6" />

        <motion.div variants={itemVariants} className="mb-6">
          <InventoryFilters onLocationChange={handleLocationChange} />
        </motion.div>

        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="buffer" className="flex items-center gap-2">
              <Buffer className="h-4 w-4" />
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
      </motion.div>

      <InventoryTourGuide open={tourOpen} onOpenChange={setTourOpen} />
    </DashboardLayout>
  );
}

export default Inventory;
