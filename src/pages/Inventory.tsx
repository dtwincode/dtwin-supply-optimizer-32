
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { InventoryItem } from "@/types/inventory";
import { 
  RefreshCw, 
  Filter, 
  Grid3X3, 
  AlertTriangle,
  Info,
  Table as TableIcon,
  LayoutGrid,
  ArrowUpDown,
  Eye
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useSkuClassifications } from "@/hooks/useSkuClassifications";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Import all tabs
import { EnhancedBufferVisualizer } from "@/components/inventory/buffer/EnhancedBufferVisualizer";
import { ADUTab } from "@/components/inventory/tabs/ADUTab";
import { ClassificationTab } from "@/components/inventory/tabs/ClassificationTab";
import { DecouplingTab } from "@/components/inventory/tabs/DecouplingTab";
import { NetFlowTab } from "@/components/inventory/tabs/NetFlowTab";
import { BufferManagementTab } from "@/components/inventory/tabs/BufferManagementTab";
import { ReplenishmentTab } from "@/components/inventory/tabs/ReplenishmentTab";
import { AIInsightsTab } from "@/components/inventory/tabs/AIInsightsTab";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import { InventoryInsightsCard } from "@/components/inventory/InventoryInsightsCard";
import { DecouplingAnalytics } from "@/components/inventory/decoupling/DecouplingAnalytics";

function Inventory() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const { classifications, loading: classificationsLoading } = useSkuClassifications();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [activeMainTab, setActiveMainTab] = useState("inventory-data");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [itemDetailsOpen, setItemDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        // Build the base query
        let query = supabase.from('inventory_data').select(`
          inventory_id,
          product_id, 
          quantity_on_hand,
          reserved_qty,
          location_id,
          last_updated,
          decoupling_point
        `);

        // Apply filters if provided
        if (searchQuery) {
          query = query.ilike('product_id', `%${searchQuery}%`);
        }

        if (selectedLocationId && selectedLocationId !== 'all') {
          query = query.eq('location_id', selectedLocationId);
        }

        // Get paginated data
        const { data, error, count } = await query
          .order('last_updated', { ascending: false })
          .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
          .select('*', { count: 'exact' });

        if (error) throw error;

        // Transform data to fit our component model
        const transformedItems: InventoryItem[] = (data || []).map(item => {
          // Find classification data for this item
          const itemClassification = classifications.find(c => c.sku === item.product_id);

          return {
            id: item.inventory_id,
            inventory_id: item.inventory_id,
            product_id: item.product_id,
            sku: item.product_id,
            quantity_on_hand: item.quantity_on_hand,
            onHand: item.quantity_on_hand,
            reserved_qty: item.reserved_qty || 0,
            location_id: item.location_id,
            location: item.location_id,
            last_updated: item.last_updated,
            decoupling_point: item.decoupling_point,
            decouplingPointId: item.decoupling_point ? item.inventory_id : null,
            name: `Product ${item.product_id}`,
            category: "General",
            subcategory: "Standard",
            currentStock: item.quantity_on_hand,
            leadTimeDays: Math.floor(Math.random() * 30) + 1,
            adu: Math.floor(Math.random() * 100) + 1,
            variabilityFactor: parseFloat((0.5 + Math.random() * 1).toFixed(2)),
            classification: itemClassification?.classification
          } as InventoryItem;
        });

        setInventoryData(transformedItems);
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
    
    // Set up auto-refresh timer if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchInventoryData();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [searchQuery, selectedLocationId, page, itemsPerPage, autoRefresh, toast, classifications]);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Refresh the current page
      const currentPage = page;
      setPage(1);
      setTimeout(() => setPage(currentPage), 0);
      toast({
        title: "Data refreshed",
        description: "Inventory data has been updated",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh inventory data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setItemDetailsOpen(true);
  };

  // Calculate buffer zones for visualization
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

  // Calculate buffer status for an inventory item
  const getBufferStatus = (item: InventoryItem) => {
    const buffer = calculateBufferZones(item);
    const total = buffer.red + buffer.yellow + buffer.green;
    const position = item.onHand || 0;
    const penetration = total > 0 ? ((total - position) / total) * 100 : 0;
    
    if (penetration >= 80) return 'critical';
    if (penetration >= 40) return 'warning';
    return 'healthy';
  };

  // Get totals for buffer status cards
  const getCriticalCount = () => {
    return inventoryData.filter(item => getBufferStatus(item) === 'critical').length;
  };
  
  const getWarningCount = () => {
    return inventoryData.filter(item => getBufferStatus(item) === 'warning').length;
  };
  
  const getHealthyCount = () => {
    return inventoryData.filter(item => getBufferStatus(item) === 'healthy').length;
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <PageHeader title="Inventory Management" />
            
            <div className="flex flex-wrap items-center gap-3">
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

          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
            <TabsList className="mb-4 inline-flex overflow-x-auto w-full">
              <TabsTrigger value="inventory-data">Inventory Data</TabsTrigger>
              <TabsTrigger value="classification">Classification</TabsTrigger>
              <TabsTrigger value="buffer-management">Buffer Management</TabsTrigger>
              <TabsTrigger value="decoupling">Decoupling Points</TabsTrigger>
              <TabsTrigger value="netflow">Net Flow Position</TabsTrigger>
              <TabsTrigger value="adu">ADU Analysis</TabsTrigger>
              <TabsTrigger value="replenishment">Replenishment</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            </TabsList>

            {/* Inventory Data Tab */}
            <TabsContent value="inventory-data" className="w-full">
              <div className="grid gap-6">
                <div className="bg-card p-4 rounded-lg border shadow-sm">
                  <div className="flex justify-between items-center mb-4">
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
                              {getCriticalCount()}
                            </div>
                            <div className="text-xs text-red-600 dark:text-red-300">Critical</div>
                          </div>
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                            <div className="font-medium text-lg text-amber-700 dark:text-amber-400">
                              {getWarningCount()}
                            </div>
                            <div className="text-xs text-amber-600 dark:text-amber-300">Warning</div>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                            <div className="font-medium text-lg text-green-700 dark:text-green-400">
                              {getHealthyCount()}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-300">Healthy</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center">
                        <Grid3X3 className="h-5 w-5 mr-2 text-primary" />
                        Inventory Items
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Input 
                          placeholder="Search by SKU, name or location" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-[250px]"
                        />
                        <div className="border rounded-md p-1">
                          <Button
                            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className="px-2"
                          >
                            <TableIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('cards')}
                            className="px-2"
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={refreshData} 
                          disabled={loading}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : inventoryData.length === 0 ? (
                      <div className="flex flex-col justify-center items-center h-64">
                        <p className="text-muted-foreground mb-2">No inventory items found</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={refreshData}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    ) : viewMode === 'table' ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">
                                <div className="flex items-center">
                                  SKU
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                              </TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead className="text-right">On Hand</TableHead>
                              <TableHead>Buffer Status</TableHead>
                              <TableHead>Decoupling</TableHead>
                              <TableHead className="w-[60px] text-right">Details</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {inventoryData.map((item) => {
                              const bufferStatus = getBufferStatus(item);
                              const bufferZones = calculateBufferZones(item);
                              const total = bufferZones.red + bufferZones.yellow + bufferZones.green;
                              
                              return (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.sku}</TableCell>
                                  <TableCell>{item.name || `Product ${item.sku}`}</TableCell>
                                  <TableCell>{item.location}</TableCell>
                                  <TableCell className="text-right">{item.onHand}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <Badge 
                                        variant={
                                          bufferStatus === 'critical' ? 'destructive' : 
                                          bufferStatus === 'warning' ? 'warning' : 'success'
                                        }
                                        className="w-fit"
                                      >
                                        {bufferStatus === 'critical' ? 'Critical' : 
                                         bufferStatus === 'warning' ? 'Warning' : 'Healthy'}
                                      </Badge>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {item.onHand} / {total}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {item.decoupling_point ? (
                                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                        Decoupling Point
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
                                        Regular
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleViewDetails(item)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {inventoryData.map((item) => {
                          const bufferStatus = getBufferStatus(item);
                          
                          return (
                            <Card key={item.id} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                  <CardTitle className="text-base">{item.sku}</CardTitle>
                                  <Badge 
                                    variant={
                                      bufferStatus === 'critical' ? 'destructive' : 
                                      bufferStatus === 'warning' ? 'warning' : 'success'
                                    }
                                  >
                                    {bufferStatus === 'critical' ? 'Critical' : 
                                     bufferStatus === 'warning' ? 'Warning' : 'Healthy'}
                                  </Badge>
                                </div>
                                <CardDescription>{item.name || `Product ${item.sku}`}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Location:</span>
                                    <span>{item.location}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">On Hand:</span>
                                    <span>{item.onHand}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Decoupling:</span>
                                    <span>{item.decoupling_point ? 'Yes' : 'No'}</span>
                                  </div>
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="w-full mt-2"
                                    onClick={() => handleViewDetails(item)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="p-4 flex justify-center">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Item Details Dialog */}
                <Dialog open={itemDetailsOpen} onOpenChange={setItemDetailsOpen}>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Item Details: {selectedItem?.sku}</DialogTitle>
                      <DialogDescription>
                        Detailed information about this inventory item
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedItem && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">SKU</p>
                                <p className="text-sm font-medium">{selectedItem.sku}</p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Name</p>
                                <p className="text-sm font-medium">{selectedItem.name || `Product ${selectedItem.sku}`}</p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="text-sm font-medium">{selectedItem.location}</p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Last Updated</p>
                                <p className="text-sm font-medium">
                                  {selectedItem.last_updated 
                                    ? new Date(selectedItem.last_updated).toLocaleDateString() 
                                    : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Inventory Status</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">On Hand</p>
                                <p className="text-sm font-medium">{selectedItem.onHand}</p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Reserved</p>
                                <p className="text-sm font-medium">{selectedItem.reserved_qty || 0}</p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">ADU</p>
                                <p className="text-sm font-medium">{selectedItem.adu || 'N/A'}</p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Lead Time</p>
                                <p className="text-sm font-medium">{selectedItem.leadTimeDays || 'N/A'} days</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Buffer Analysis</h4>
                          <div className="p-3 border rounded-md">
                            <EnhancedBufferVisualizer 
                              bufferZones={calculateBufferZones(selectedItem)}
                              netFlowPosition={selectedItem.onHand || 0}
                              adu={selectedItem.adu}
                              showDetailedInfo={true}
                            />
                          </div>
                        </div>
                        
                        {selectedItem.classification && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">SKU Classification</h4>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Lead Time</p>
                                <p className="text-sm font-medium capitalize">
                                  {selectedItem.classification.leadTimeCategory || 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Variability</p>
                                <p className="text-sm font-medium capitalize">
                                  {selectedItem.classification.variabilityLevel || 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Criticality</p>
                                <p className="text-sm font-medium capitalize">
                                  {selectedItem.classification.criticality || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Decoupling Status</h4>
                          <div className="p-3 rounded-md border">
                            {selectedItem.decoupling_point ? (
                              <div className="flex items-center">
                                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                                <p className="text-sm">
                                  This item is a <span className="font-medium">decoupling point</span> in the supply chain
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <div className="h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
                                <p className="text-sm">Regular inventory item (not a decoupling point)</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>

            {/* Classification Tab */}
            <TabsContent value="classification" className="w-full">
              <ClassificationTab />
            </TabsContent>

            {/* Buffer Management Tab */}
            <TabsContent value="buffer-management" className="w-full">
              <BufferManagementTab />
            </TabsContent>

            {/* Decoupling Tab */}
            <TabsContent value="decoupling" className="w-full">
              <DecouplingTab />
            </TabsContent>

            {/* Net Flow Position Tab */}
            <TabsContent value="netflow" className="w-full">
              <NetFlowTab />
            </TabsContent>

            {/* ADU Analysis Tab */}
            <TabsContent value="adu" className="w-full">
              <ADUTab />
            </TabsContent>

            {/* Replenishment Tab */}
            <TabsContent value="replenishment" className="w-full">
              <ReplenishmentTab />
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="ai-insights" className="w-full">
              <AIInsightsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Inventory;
