
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  RefreshCw, 
  ShoppingCart, 
  Filter,
  BarChart3,
  Search,
  LayoutGrid,
  ListFilter,
  ArrowUpDown
} from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import { EnhancedBufferVisualizer } from "@/components/inventory/buffer/EnhancedBufferVisualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedInventoryTabProps {
  paginatedData: InventoryItem[];
  onCreatePO: (item: InventoryItem) => void;
  onRefresh: () => Promise<void>;
  onSelectItem?: (item: InventoryItem) => void;
}

export function EnhancedInventoryTab({ 
  paginatedData, 
  onCreatePO, 
  onRefresh,
  onSelectItem 
}: EnhancedInventoryTabProps) {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("sku");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filter the data based on local search
  const filteredData = paginatedData.filter(item => 
    item.sku?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
    item.name?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(localSearchQuery.toLowerCase())
  );
  
  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField as keyof InventoryItem];
    const bValue = b[sortField as keyof InventoryItem];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
  
  // Calculate buffer zones for visualization
  const calculateBufferZones = (item: InventoryItem) => {
    const leadTime = item.leadTimeDays || 10;
    const adu = item.adu || 5;
    const variabilityFactor = item.variabilityFactor || 0.5;
    
    return {
      red: Math.round(adu * leadTime * variabilityFactor),
      yellow: Math.round(adu * leadTime * 0.5),
      green: Math.round(adu * leadTime * 0.5 * 0.7)
    };
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU, name or location..."
              className="pl-8 w-full sm:w-[250px]"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Tabs defaultValue="view" className="w-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="table" 
                onClick={() => setViewMode("table")}
                className="flex items-center gap-1 px-3"
              >
                <ListFilter className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </TabsTrigger>
              <TabsTrigger 
                value="cards" 
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-1 px-3"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-card rounded-md border shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('sku')}
                  >
                    <div className="flex items-center gap-1">
                      SKU
                      {sortField === 'sku' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortField === 'name' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center gap-1">
                      Location
                      {sortField === 'location' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('onHand')}
                  >
                    <div className="flex items-center gap-1">
                      On Hand
                      {sortField === 'onHand' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Buffer Status</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Decoupling
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length > 0 ? (
                  sortedData.map((item) => {
                    const bufferZones = calculateBufferZones(item);
                    const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
                    const netFlowPosition = item.onHand || 0;
                    
                    return (
                      <TableRow 
                        key={item.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onSelectItem && onSelectItem(item)}
                      >
                        <TableCell className="font-medium whitespace-nowrap">{item.sku}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{item.name || "-"}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.location}</TableCell>
                        <TableCell>{item.onHand}</TableCell>
                        <TableCell>
                          <div className="w-40">
                            <EnhancedBufferVisualizer 
                              bufferZones={bufferZones}
                              netFlowPosition={netFlowPosition}
                              compact={true}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.decouplingPointId ? (
                            <Badge className="bg-blue-100 text-blue-800">Decoupling Point</Badge>
                          ) : (
                            <Badge variant="outline">Regular</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreatePO(item);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Create PO
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedData.length > 0 ? (
            sortedData.map((item) => {
              const bufferZones = calculateBufferZones(item);
              const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
              const netFlowPosition = item.onHand || 0;
              
              return (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectItem && onSelectItem(item)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{item.sku}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {item.name || "-"}
                        </p>
                      </div>
                      {item.decouplingPointId ? (
                        <Badge className="bg-blue-100 text-blue-800">Decoupling Point</Badge>
                      ) : (
                        <Badge variant="outline">Regular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-muted/50 p-2 rounded">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium truncate">{item.location}</p>
                      </div>
                      <div className="bg-muted/50 p-2 rounded">
                        <p className="text-xs text-muted-foreground">On Hand</p>
                        <p className="font-medium">{item.onHand}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Buffer Status</p>
                      <EnhancedBufferVisualizer 
                        bufferZones={bufferZones}
                        netFlowPosition={netFlowPosition}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreatePO(item);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Create PO
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground border rounded-md">
              No inventory items found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
