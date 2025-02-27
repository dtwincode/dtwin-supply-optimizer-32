
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowUpDown, 
  Edit, 
  History, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sliders,
  Info 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  InventoryItem, 
  BufferZones, 
  BufferFactorConfig 
} from "@/types/inventory";
import { calculateBufferZones, calculateNetFlowPosition, calculateBufferPenetration } from "@/utils/inventoryUtils";
import { supabase } from "@/integrations/supabase/client";

interface BufferHistoryItem {
  id: string;
  date: string;
  redZone: number;
  yellowZone: number;
  greenZone: number;
  totalBuffer: number;
  profileUsed: string;
  changedBy?: string;
  reason?: string;
}

interface BufferAdjustment {
  sku: string;
  date: string;
  adjustmentType: 'manual' | 'seasonal' | 'trend' | 'system';
  factorApplied: number;
  redZoneBefore: number;
  yellowZoneBefore: number;
  greenZoneBefore: number;
  redZoneAfter: number;
  yellowZoneAfter: number;
  greenZoneAfter: number;
  reason: string;
  appliedBy: string;
}

export function BufferLevelManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [bufferHistory, setBufferHistory] = useState<BufferHistoryItem[]>([]);
  const [bufferAdjustments, setBufferAdjustments] = useState<BufferAdjustment[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'sku', direction: 'asc' });
  const [adjustmentData, setAdjustmentData] = useState({
    adjustmentType: 'manual',
    factor: 10, // percentage
    upOrDown: 'up',
    reason: '',
    applyToAllZones: true,
    redZoneAdjust: true,
    yellowZoneAdjust: true,
    greenZoneAdjust: true
  });
  const { toast } = useToast();

  // Fetch items from inventory
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use mock data based on the inventoryData imported earlier
        setItems(mockInventoryItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  const mockInventoryItems: InventoryItem[] = [
    {
      id: '1',
      sku: 'SKU001',
      name: 'Product A',
      currentStock: 120,
      location: 'Warehouse 1',
      productFamily: 'Electronics',
      onHand: 120,
      onOrder: 50,
      qualifiedDemand: 30,
      netFlowPosition: 140,
      category: 'Electronics',
      subcategory: 'Mobile',
      region: 'North',
      city: 'New York',
      channel: 'Retail',
      warehouse: 'NYC-01',
      adu: 10,
      leadTimeDays: 14,
      variabilityFactor: 0.5,
      redZoneSize: 70,
      yellowZoneSize: 140,
      greenZoneSize: 90,
      bufferPenetration: 35
    },
    {
      id: '2',
      sku: 'SKU002',
      name: 'Product B',
      currentStock: 85,
      location: 'Warehouse 2',
      productFamily: 'Clothing',
      onHand: 85,
      onOrder: 100,
      qualifiedDemand: 60,
      netFlowPosition: 125,
      category: 'Clothing',
      subcategory: 'Shirts',
      region: 'South',
      city: 'Miami',
      channel: 'Online',
      warehouse: 'MIA-02',
      adu: 15,
      leadTimeDays: 7,
      variabilityFactor: 0.7,
      redZoneSize: 80,
      yellowZoneSize: 105,
      greenZoneSize: 70,
      bufferPenetration: 50
    },
    {
      id: '3',
      sku: 'SKU003',
      name: 'Product C',
      currentStock: 35,
      location: 'Warehouse 1',
      productFamily: 'Home',
      onHand: 35,
      onOrder: 0,
      qualifiedDemand: 20,
      netFlowPosition: 15,
      category: 'Home',
      subcategory: 'Kitchen',
      region: 'East',
      city: 'Boston',
      channel: 'Retail',
      warehouse: 'BOS-01',
      adu: 5,
      leadTimeDays: 21,
      variabilityFactor: 0.3,
      redZoneSize: 30,
      yellowZoneSize: 105,
      greenZoneSize: 70,
      bufferPenetration: 85
    }
  ];

  // Generate mock buffer history when selecting an item
  useEffect(() => {
    if (selectedItem) {
      const history: BufferHistoryItem[] = [];
      const currentDate = new Date();
      
      // Generate 10 historical buffer changes going back in time
      for (let i = 0; i < 10; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - (i * 15)); // Every 15 days in the past
        
        const variationFactor = 1 - (i * 0.03); // Small variation factor
        
        history.push({
          id: `history-${i}`,
          date: date.toISOString().split('T')[0],
          redZone: Math.round((selectedItem.redZoneSize || 0) * variationFactor),
          yellowZone: Math.round((selectedItem.yellowZoneSize || 0) * variationFactor),
          greenZone: Math.round((selectedItem.greenZoneSize || 0) * variationFactor),
          totalBuffer: Math.round(((selectedItem.redZoneSize || 0) + (selectedItem.yellowZoneSize || 0) + (selectedItem.greenZoneSize || 0)) * variationFactor),
          profileUsed: i % 3 === 0 ? 'Standard' : i % 3 === 1 ? 'High Variability' : 'Low Variability',
          changedBy: i % 2 === 0 ? 'System' : 'John Smith',
          reason: i % 2 === 0 ? 'Automatic adjustment' : 'Manual override due to seasonal demand increase'
        });
      }
      
      setBufferHistory(history);

      // Generate mock buffer adjustments
      const adjustments: BufferAdjustment[] = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - (i * 30)); // Every 30 days in the past
        
        const adjustmentFactor = 1 + (Math.random() * 0.2 - 0.1); // -10% to +10%
        const adjustmentTypes = ['manual', 'seasonal', 'trend', 'system'];
        
        adjustments.push({
          sku: selectedItem.sku,
          date: date.toISOString().split('T')[0],
          adjustmentType: adjustmentTypes[i % 4] as 'manual' | 'seasonal' | 'trend' | 'system',
          factorApplied: Math.round((adjustmentFactor - 1) * 100),
          redZoneBefore: Math.round((selectedItem.redZoneSize || 0) / adjustmentFactor),
          yellowZoneBefore: Math.round((selectedItem.yellowZoneSize || 0) / adjustmentFactor),
          greenZoneBefore: Math.round((selectedItem.greenZoneSize || 0) / adjustmentFactor),
          redZoneAfter: selectedItem.redZoneSize || 0,
          yellowZoneAfter: selectedItem.yellowZoneSize || 0,
          greenZoneAfter: selectedItem.greenZoneSize || 0,
          reason: ['Seasonal spike', 'Trend adjustment', 'Manual override', 'System calibration', 'Supply variability'][i % 5],
          appliedBy: i % 2 === 0 ? 'System' : 'John Smith'
        });
      }
      
      setBufferAdjustments(adjustments);
    }
  }, [selectedItem]);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    setItems(prevItems => [...prevItems].sort((a, b) => {
      // @ts-ignore - dynamic access
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      // @ts-ignore - dynamic access
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  const openHistoryModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsHistoryOpen(true);
  };

  const openAdjustmentModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustmentOpen(true);
    // Reset adjustment form
    setAdjustmentData({
      adjustmentType: 'manual',
      factor: 10,
      upOrDown: 'up',
      reason: '',
      applyToAllZones: true,
      redZoneAdjust: true,
      yellowZoneAdjust: true,
      greenZoneAdjust: true
    });
  };

  const handleAdjustmentSubmit = () => {
    if (!selectedItem) return;
    
    // Calculate new buffer levels
    const factor = adjustmentData.upOrDown === 'up' 
      ? 1 + (adjustmentData.factor / 100)
      : 1 - (adjustmentData.factor / 100);
    
    const newRedZone = adjustmentData.redZoneAdjust && (selectedItem.redZoneSize || 0) > 0
      ? Math.round((selectedItem.redZoneSize || 0) * factor)
      : selectedItem.redZoneSize || 0;
      
    const newYellowZone = adjustmentData.yellowZoneAdjust && (selectedItem.yellowZoneSize || 0) > 0 
      ? Math.round((selectedItem.yellowZoneSize || 0) * factor)
      : selectedItem.yellowZoneSize || 0;
      
    const newGreenZone = adjustmentData.greenZoneAdjust && (selectedItem.greenZoneSize || 0) > 0
      ? Math.round((selectedItem.greenZoneSize || 0) * factor)
      : selectedItem.greenZoneSize || 0;
    
    // Update the item
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            redZoneSize: newRedZone,
            yellowZoneSize: newYellowZone,
            greenZoneSize: newGreenZone
          };
        }
        return item;
      })
    );
    
    // Add to adjustments history
    const newAdjustment: BufferAdjustment = {
      sku: selectedItem.sku,
      date: new Date().toISOString().split('T')[0],
      adjustmentType: adjustmentData.adjustmentType as 'manual' | 'seasonal' | 'trend' | 'system',
      factorApplied: adjustmentData.upOrDown === 'up' ? adjustmentData.factor : -adjustmentData.factor,
      redZoneBefore: selectedItem.redZoneSize || 0,
      yellowZoneBefore: selectedItem.yellowZoneSize || 0,
      greenZoneBefore: selectedItem.greenZoneSize || 0,
      redZoneAfter: newRedZone,
      yellowZoneAfter: newYellowZone,
      greenZoneAfter: newGreenZone,
      reason: adjustmentData.reason || 'Manual adjustment',
      appliedBy: 'Current User'
    };
    
    setBufferAdjustments(prev => [newAdjustment, ...prev]);
    
    // Close the modal
    setIsAdjustmentOpen(false);
    
    // Show success message
    toast({
      title: "Buffer Levels Adjusted",
      description: `Buffer levels for ${selectedItem.sku} have been updated.`,
    });
  };

  const getTotalBuffer = (item: InventoryItem) => {
    return (item.redZoneSize || 0) + (item.yellowZoneSize || 0) + (item.greenZoneSize || 0);
  };

  const getBufferStatus = (bufferPenetration: number | undefined) => {
    if (!bufferPenetration) return 'unknown';
    if (bufferPenetration <= 33) return 'green';
    if (bufferPenetration <= 66) return 'yellow';
    return 'red';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'green':
        return <Badge className="bg-green-100 text-green-800">Green</Badge>;
      case 'yellow':
        return <Badge className="bg-yellow-100 text-yellow-800">Yellow</Badge>;
      case 'red':
        return <Badge className="bg-red-100 text-red-800">Red</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAdjustmentTypeBadge = (type: string) => {
    switch (type) {
      case 'manual':
        return <Badge variant="outline">Manual</Badge>;
      case 'seasonal':
        return <Badge className="bg-blue-100 text-blue-800">Seasonal</Badge>;
      case 'trend':
        return <Badge className="bg-purple-100 text-purple-800">Trend</Badge>;
      case 'system':
        return <Badge className="bg-gray-100 text-gray-800">System</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Buffer Level Management</CardTitle>
        <CardDescription>
          Monitor and adjust buffer zones for your inventory items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('sku')}>
                <div className="flex items-center gap-1">
                  SKU {renderSortIcon('sku')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Name {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('currentStock')}>
                <div className="flex items-center gap-1">
                  Current Stock {renderSortIcon('currentStock')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('bufferPenetration')}>
                <div className="flex items-center gap-1">
                  Buffer Status {renderSortIcon('bufferPenetration')}
                </div>
              </TableHead>
              <TableHead>Buffer Zones</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const totalBuffer = getTotalBuffer(item);
              const bufferStatus = getBufferStatus(item.bufferPenetration);
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>
                    {getStatusBadge(bufferStatus)}
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.bufferPenetration}% penetration
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Total: {totalBuffer}</span>
                        <span>TOG: {totalBuffer}</span>
                      </div>
                      <div className="h-3 w-full rounded-full overflow-hidden bg-gray-100 flex">
                        <div className="bg-red-200" style={{ width: `${(item.redZoneSize || 0) / totalBuffer * 100}%` }}></div>
                        <div className="bg-yellow-200" style={{ width: `${(item.yellowZoneSize || 0) / totalBuffer * 100}%` }}></div>
                        <div className="bg-green-200" style={{ width: `${(item.greenZoneSize || 0) / totalBuffer * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-600">Red: {item.redZoneSize}</span>
                        <span className="text-yellow-600">Yellow: {item.yellowZoneSize}</span>
                        <span className="text-green-600">Green: {item.greenZoneSize}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openHistoryModal(item)}>
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openAdjustmentModal(item)}>
                        <Sliders className="h-4 w-4 mr-1" />
                        Adjust
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      {/* Buffer History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Buffer History - {selectedItem?.sku}</DialogTitle>
            <DialogDescription>
              Historical changes to buffer levels for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">Buffer Changes</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustment History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Red Zone</TableHead>
                      <TableHead>Yellow Zone</TableHead>
                      <TableHead>Green Zone</TableHead>
                      <TableHead>Total Buffer</TableHead>
                      <TableHead>Buffer Profile</TableHead>
                      <TableHead>Changed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bufferHistory.map((historyItem) => (
                      <TableRow key={historyItem.id}>
                        <TableCell>{historyItem.date}</TableCell>
                        <TableCell>{historyItem.redZone}</TableCell>
                        <TableCell>{historyItem.yellowZone}</TableCell>
                        <TableCell>{historyItem.greenZone}</TableCell>
                        <TableCell>{historyItem.totalBuffer}</TableCell>
                        <TableCell>{historyItem.profileUsed}</TableCell>
                        <TableCell>{historyItem.changedBy || 'System'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="adjustments">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Factor</TableHead>
                      <TableHead>Before (TOG)</TableHead>
                      <TableHead>After (TOG)</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Applied By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bufferAdjustments.map((adjustment, index) => (
                      <TableRow key={`adjustment-${index}`}>
                        <TableCell>{adjustment.date}</TableCell>
                        <TableCell>{getAdjustmentTypeBadge(adjustment.adjustmentType)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {adjustment.factorApplied > 0 ? (
                              <ArrowUp className="text-green-600 h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDown className="text-red-600 h-4 w-4 mr-1" />
                            )}
                            {Math.abs(adjustment.factorApplied)}%
                          </div>
                        </TableCell>
                        <TableCell>
                          {adjustment.redZoneBefore + adjustment.yellowZoneBefore + adjustment.greenZoneBefore}
                        </TableCell>
                        <TableCell>
                          {adjustment.redZoneAfter + adjustment.yellowZoneAfter + adjustment.greenZoneAfter}
                        </TableCell>
                        <TableCell>{adjustment.reason}</TableCell>
                        <TableCell>{adjustment.appliedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Buffer Adjustment Dialog */}
      <Dialog open={isAdjustmentOpen} onOpenChange={setIsAdjustmentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adjust Buffer Levels - {selectedItem?.sku}</DialogTitle>
            <DialogDescription>
              Modify buffer levels for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adjustmentType">Adjustment Type</Label>
                <Select 
                  value={adjustmentData.adjustmentType} 
                  onValueChange={(value) => setAdjustmentData(prev => ({ ...prev, adjustmentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="trend">Trend</SelectItem>
                    <SelectItem value="system">System Recalculation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="factor">Adjustment Factor (%)</Label>
                <div className="flex">
                  <Select 
                    value={adjustmentData.upOrDown}
                    onValueChange={(value) => setAdjustmentData(prev => ({ ...prev, upOrDown: value }))}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="±" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="up">↑</SelectItem>
                      <SelectItem value="down">↓</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="factor"
                    type="number"
                    min="1"
                    max="100"
                    value={adjustmentData.factor}
                    onChange={(e) => setAdjustmentData(prev => ({ 
                      ...prev, 
                      factor: parseInt(e.target.value) || 0 
                    }))}
                    className="ml-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="applyToAllZones">Apply to all zones</Label>
                <Switch 
                  id="applyToAllZones"
                  checked={adjustmentData.applyToAllZones}
                  onCheckedChange={(checked) => {
                    setAdjustmentData(prev => ({
                      ...prev,
                      applyToAllZones: checked,
                      redZoneAdjust: checked,
                      yellowZoneAdjust: checked,
                      greenZoneAdjust: checked
                    }));
                  }}
                />
              </div>
              
              {!adjustmentData.applyToAllZones && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="redZoneAdjust"
                      checked={adjustmentData.redZoneAdjust}
                      onCheckedChange={(checked) => setAdjustmentData(prev => ({ 
                        ...prev, 
                        redZoneAdjust: !!checked 
                      }))}
                    />
                    <Label htmlFor="redZoneAdjust">Red Zone</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="yellowZoneAdjust"
                      checked={adjustmentData.yellowZoneAdjust}
                      onCheckedChange={(checked) => setAdjustmentData(prev => ({ 
                        ...prev, 
                        yellowZoneAdjust: !!checked 
                      }))}
                    />
                    <Label htmlFor="yellowZoneAdjust">Yellow Zone</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="greenZoneAdjust"
                      checked={adjustmentData.greenZoneAdjust}
                      onCheckedChange={(checked) => setAdjustmentData(prev => ({ 
                        ...prev, 
                        greenZoneAdjust: !!checked 
                      }))}
                    />
                    <Label htmlFor="greenZoneAdjust">Green Zone</Label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Adjustment Reason</Label>
              <Input 
                id="reason"
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for adjustment"
              />
            </div>
            
            <div className="pt-2">
              <div className="flex items-center bg-amber-50 p-3 rounded-md">
                <Info className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Buffer adjustments affect planned replenishments and inventory targets. Please ensure changes are reviewed.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustmentOpen(false)}>Cancel</Button>
            <Button onClick={handleAdjustmentSubmit}>Apply Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Add imports that weren't added due to TypeScript errors
import { Checkbox } from "@/components/ui/checkbox";
