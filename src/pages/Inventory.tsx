
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { InventoryItem } from "@/types/inventory";
import { EnhancedInventoryTab } from "@/components/inventory/tabs/EnhancedInventoryTab";
import { ClassificationTab } from "@/components/inventory/tabs/ClassificationTab";
import { AIInsightsTab } from "@/components/inventory/tabs/AIInsightsTab";
import { DecouplingTab } from "@/components/inventory/tabs/DecouplingTab";
import { DecouplingAnalytics } from "@/components/inventory/decoupling/DecouplingAnalytics";
import { InventoryInsightsCard } from "@/components/inventory/InventoryInsightsCard";
import { InventoryPlanningInsights } from "@/components/inventory/InventoryPlanningInsights";
import { useToast } from "@/hooks/use-toast";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import { supabase } from "@/lib/supabaseClient";
import { useSkuClassifications } from "@/hooks/useSkuClassifications";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  BarChart, 
  Layers, 
  Grid3X3, 
  TrendingUp, 
  Filter, 
  Network,
  PlusCircle,
  AlertTriangle,
  Settings,
  PieChart
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { EnhancedBufferVisualizer } from "@/components/inventory/buffer/EnhancedBufferVisualizer";
import { Badge } from "@/components/ui/badge";
import { ReplenishmentTab } from "@/components/inventory/tabs/ReplenishmentTab";
import { NetFlowTab } from "@/components/inventory/tabs/NetFlowTab";
import { BufferManagementTab } from "@/components/inventory/tabs/BufferManagementTab";

function Inventory() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(12);
  const { classifications, loading: classificationsLoading } = useSkuClassifications();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState("inventory");

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

        const productIds = (data || []).map(item => item.product_id);
        
        const { data: productData, error: productError } = await supabase
          .from('product_master')
          .select('*')
          .in('product_id', productIds);

        if (productError) throw productError;

        const locationIds = (data || []).map(item => item.location_id);
        
        const { data: locationData, error: locationError } = await supabase
          .from('location_master')
          .select('*')
          .in('location_id', locationIds);

        if (locationError) throw locationError;

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
            decouplingPointId: item.decoupling_point ? item.inventory_id : null,
            name: product?.name,
            category: product?.category,
            subcategory: product?.subcategory,
            productFamily: product?.product_family,
            currentStock: item.quantity_on_hand,
            leadTimeDays: Math.floor(Math.random() * 30) + 1,
            adu: Math.floor(Math.random() * 100) + 1,
            variabilityFactor: parseFloat((0.5 + Math.random() * 1).toFixed(2))
          };
        });

        const { data: classData, error: classError } = await supabase
          .from('product_classification')
          .select('*')
          .in('product_id', productIds);

        if (classError) throw classError;

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
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchInventoryData();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [searchQuery, selectedLocationId, page, itemsPerPage, autoRefresh, toast]);

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
      // Simply refresh the current page
      const currentPage = page;
      setPage(1);
      setTimeout(() => setPage(currentPage), 0);
    } catch (error) {
      console.error("Error refreshing data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate buffer zones for visualization in the item details
  const calculateBufferZones = (item: InventoryItem | null) => {
    if (!item) return { red: 0, yellow: 0, green: 0 };
    
    const leadTime = item.leadTimeDays || 10;
    const adu = item.adu || 5;
    const variabilityFactor = item.variabilityFactor || 0.5;
    
    return {
      red: Math.round(adu * leadTime * variabilityFactor),
      yellow: Math.round(adu * leadTime * 0.5),
      green: Math.round(adu * leadTime * 0.5 * 0.7)
    };
  };

  // Inventory page content
  const inventoryContent = (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <PageHeader title="Inventory Management" />
        
        <div className="flex flex-wrap items-center gap-3 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData} 
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh">Auto-refresh</Label>
          </div>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium text-sm">Filters</span>
          </div>
          <InventoryFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InventoryInsightsCard />
        <DecouplingAnalytics items={inventoryData} />
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Buffer Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                <div className="font-medium text-lg text-red-700 dark:text-red-400">
                  {inventoryData.filter(item => {
                    const buffer = calculateBufferZones(item);
                    const total = buffer.red + buffer.yellow + buffer.green;
                    const position = item.onHand || 0;
                    const penetration = total > 0 ? ((total - position) / total) * 100 : 0;
                    return penetration >= 80;
                  }).length}
                </div>
                <div className="text-xs text-red-600 dark:text-red-300">Critical</div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <div className="font-medium text-lg text-amber-700 dark:text-amber-400">
                  {inventoryData.filter(item => {
                    const buffer = calculateBufferZones(item);
                    const total = buffer.red + buffer.yellow + buffer.green;
                    const position = item.onHand || 0;
                    const penetration = total > 0 ? ((total - position) / total) * 100 : 0;
                    return penetration >= 40 && penetration < 80;
                  }).length}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-300">Warning</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <div className="font-medium text-lg text-green-700 dark:text-green-400">
                  {inventoryData.filter(item => {
                    const buffer = calculateBufferZones(item);
                    const total = buffer.red + buffer.yellow + buffer.green;
                    const position = item.onHand || 0;
                    const penetration = total > 0 ? ((total - position) / total) * 100 : 0;
                    return penetration < 40;
                  }).length}
                </div>
                <div className="text-xs text-green-600 dark:text-green-300">Healthy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Inventory Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4 sm:px-6 pt-2 overflow-x-auto">
                <TabsList className="grid w-full min-w-max grid-cols-7">
                  <TabsTrigger value="inventory" className="flex items-center text-xs sm:text-sm">
                    <Grid3X3 className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>Data</span>
                  </TabsTrigger>
                  <TabsTrigger value="classification" className="flex items-center text-xs sm:text-sm">
                    <Layers className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>Classification</span>
                  </TabsTrigger>
                  <TabsTrigger value="decoupling" className="flex items-center text-xs sm:text-sm">
                    <Network className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>Decoupling</span>
                  </TabsTrigger>
                  <TabsTrigger value="buffer" className="flex items-center text-xs sm:text-sm">
                    <PieChart className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>Buffer</span>
                  </TabsTrigger>
                  <TabsTrigger value="netflow" className="flex items-center text-xs sm:text-sm">
                    <TrendingUp className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>Net Flow</span>
                  </TabsTrigger>
                  <TabsTrigger value="replenishment" className="flex items-center text-xs sm:text-sm">
                    <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>Replenishment</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai-insights" className="flex items-center text-xs sm:text-sm">
                    <BarChart className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>AI Insights</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="inventory" className="m-0 py-4">
                <EnhancedInventoryTab
                  paginatedData={inventoryData}
                  onCreatePO={handleCreatePO}
                  onRefresh={refreshData}
                  onSelectItem={handleSelectItem}
                />
                <div className="p-4 flex justify-center">
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

              <TabsContent value="decoupling" className="m-0 p-4">
                <DecouplingTab />
              </TabsContent>
              
              <TabsContent value="buffer" className="m-0 p-4">
                <BufferManagementTab />
              </TabsContent>
              
              <TabsContent value="netflow" className="m-0 p-4">
                <NetFlowTab />
              </TabsContent>
              
              <TabsContent value="replenishment" className="m-0 p-4">
                <ReplenishmentTab />
              </TabsContent>

              <TabsContent value="ai-insights" className="m-0">
                <AIInsightsTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-primary" />
                Selected Item
              </div>
              {selectedItem && (
                <Button variant="outline" size="sm" className="h-7 px-2">
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Add Note</span>
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">{selectedItem.sku}</h3>
                  <p className="text-xs text-muted-foreground">{selectedItem.name || 'No product name'}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">On Hand</p>
                      <p className="text-sm font-medium">{selectedItem.onHand}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">Reserved</p>
                      <p className="text-sm font-medium">{selectedItem.reserved_qty || 0}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{selectedItem.location}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedItem.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Buffer Analysis</h3>
                  <EnhancedBufferVisualizer 
                    bufferZones={calculateBufferZones(selectedItem)}
                    netFlowPosition={selectedItem.onHand || 0}
                    adu={selectedItem.adu}
                    showDetailedInfo={true}
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Classification</h3>
                  {selectedItem.classification ? (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Lead Time</p>
                        <Badge className="mt-1" variant="outline">
                          {selectedItem.classification.leadTimeCategory || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Variability</p>
                        <Badge className="mt-1" variant="outline">
                          {selectedItem.classification.variabilityLevel || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Criticality</p>
                        <Badge className="mt-1" variant="outline">
                          {selectedItem.classification.criticality || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No classification data available
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={() => handleCreatePO(selectedItem)}
                    className="w-full"
                  >
                    Create Purchase Order
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-center">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Select an item from the inventory table to view details
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Return the content wrapped in DashboardLayout
  return <DashboardLayout>{inventoryContent}</DashboardLayout>;
}

export default Inventory;
