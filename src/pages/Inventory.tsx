
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { InventoryItem, SKUClassification } from "@/types/inventory";
import { InventoryTab } from "@/components/inventory/tabs/InventoryTab";
import { ClassificationTab } from "@/components/inventory/tabs/ClassificationTab";
import { AIInsightsTab } from "@/components/inventory/tabs/AIInsightsTab";
import { ThresholdManagement } from "@/components/inventory/ThresholdManagement";
import { ThresholdScheduler } from "@/components/inventory/ThresholdScheduler";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";
import { useToast } from "@/hooks/use-toast";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import { supabase } from "@/lib/supabaseClient";
import { useSkuClassifications } from "@/hooks/useSkuClassifications";

function Inventory() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const { classifications, loading: classificationsLoading } = useSkuClassifications();

  // Fetch inventory data from the database
  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        let query = supabase.from('inventory_data').select(`
          inventory_id,
          product_id, 
          quantity_on_hand,
          reserved_qty,
          location_id,
          last_updated,
          buffer_profile_id,
          decoupling_point
        `);

        if (searchQuery) {
          query = query.ilike('product_id', `%${searchQuery}%`);
        }

        if (selectedLocationId && selectedLocationId !== 'all') {
          query = query.eq('location_id', selectedLocationId);
        }

        const { data, error, count } = await query
          .order('last_updated', { ascending: false })
          .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
          .select('*', { count: 'exact' });

        if (error) throw error;

        // Get additional product info
        const productIds = (data || []).map(item => item.product_id);
        
        const { data: productData, error: productError } = await supabase
          .from('product_master')
          .select('*')
          .in('product_id', productIds);

        if (productError) throw productError;

        // Get location info
        const locationIds = (data || []).map(item => item.location_id);
        
        const { data: locationData, error: locationError } = await supabase
          .from('location_master')
          .select('*')
          .in('location_id', locationIds);

        if (locationError) throw locationError;

        // Transform inventory data with joined info
        const transformedItems: InventoryItem[] = (data || []).map(item => {
          const product = productData?.find(p => p.product_id === item.product_id);
          const location = locationData?.find(l => l.location_id === item.location_id);
          
          return {
            id: item.inventory_id,
            inventory_id: item.inventory_id,
            product_id: item.product_id,
            sku: item.product_id,
            quantity_on_hand: item.quantity_on_hand,
            onHand: item.quantity_on_hand,
            reserved_qty: item.reserved_qty,
            location_id: item.location_id,
            location: location?.warehouse,
            last_updated: item.last_updated,
            decoupling_point: item.decoupling_point,
            name: product?.name,
            category: product?.category,
            subcategory: product?.subcategory,
            productFamily: product?.product_family,
            currentStock: item.quantity_on_hand,
            // Classification data will be added in the next step
          };
        });

        // Get SKU classifications for these products
        const { data: classData, error: classError } = await supabase
          .from('product_classification')
          .select('*')
          .in('product_id', productIds);

        if (classError) throw classError;

        // Add classification data to inventory items
        const finalItems = transformedItems.map(item => {
          const classification = classData?.find(c => c.product_id === item.product_id && 
            (c.location_id === item.location_id || !c.location_id));
          
          if (classification) {
            return {
              ...item,
              classification: {
                leadTimeCategory: classification.lead_time_category as 'short' | 'medium' | 'long',
                variabilityLevel: classification.variability_level as 'low' | 'medium' | 'high',
                criticality: classification.criticality as 'low' | 'medium' | 'high',
                score: classification.score
              }
            };
          }
          
          return item;
        });

        setInventoryData(finalItems);
        setTotalItems(count || 0);
      } catch (err) {
        console.error('Error fetching inventory data:', err);
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
    
    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchInventoryData();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [searchQuery, selectedLocationId, page, itemsPerPage, autoRefresh, toast]);

  // Sample SKU classifications for the card view
  const sampleClassifications: SKUClassification[] = [
    {
      id: "1",
      sku: "SKU001",
      classification: {
        leadTimeCategory: "short",
        variabilityLevel: "low",
        criticality: "high",
        score: 85
      },
      category: "Electronics",
      last_updated: "2023-11-01"
    },
    {
      id: "2",
      sku: "SKU002",
      classification: {
        leadTimeCategory: "medium",
        variabilityLevel: "medium",
        criticality: "medium",
        score: 65
      },
      category: "Appliances",
      last_updated: "2023-11-02"
    },
    {
      id: "3",
      sku: "SKU003",
      classification: {
        leadTimeCategory: "long",
        variabilityLevel: "high",
        criticality: "low",
        score: 45
      },
      category: "Furniture",
      last_updated: "2023-11-03"
    }
  ];

  const handleCreatePO = (item: InventoryItem) => {
    console.log("Creating PO for item:", item);
    toast({
      title: "Purchase Order Created",
      description: `Created new PO for ${item.sku || item.product_id}`,
    });
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      // Refresh will be implemented by triggering the useEffect that loads data
      setPage(page); // This should trigger a reload with the same page
    } catch (error) {
      console.error("Error refreshing data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" />

      <div className="flex justify-between items-center">
        <InventoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLocationId={selectedLocationId}
          setSelectedLocationId={setSelectedLocationId}
        />

        <div className="flex items-center space-x-2">
          <Switch
            id="auto-refresh"
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
          />
          <Label htmlFor="auto-refresh">Auto-refresh</Label>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <SKUClassifications classifications={classifications || []} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="inventory">
            <TabsList className="bg-background p-0 pl-6 pt-2">
              <TabsTrigger value="inventory">Inventory Data</TabsTrigger>
              <TabsTrigger value="classification">Classification</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="m-0">
              <InventoryTab
                paginatedData={inventoryData}
                onCreatePO={handleCreatePO}
                onRefresh={refreshData}
              />
              <div className="p-6 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </TabsContent>

            <TabsContent value="classification" className="m-0">
              <ClassificationTab />
            </TabsContent>

            <TabsContent value="ai-insights" className="m-0">
              <AIInsightsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ThresholdManagement />
        <ThresholdScheduler />
      </div>
    </div>
  );
}

export default Inventory;
