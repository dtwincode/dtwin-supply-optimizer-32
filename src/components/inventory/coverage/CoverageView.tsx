import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CoverageKPICards } from './CoverageKPICards';
import { CoverageTable, CoverageItem } from './CoverageTable';
import { CoverageTimelineDrawer } from './CoverageTimelineDrawer';
import { CoverageActionDrawer } from './CoverageActionDrawer';
import { CoverageFooter } from './CoverageFooter';

export const CoverageView: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<CoverageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'red' | 'yellow' | 'green' | 'at-risk'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [bufferProfileFilter, setBufferProfileFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<CoverageItem | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load coverage data
  const loadCoverageData = async () => {
    setIsLoading(true);
    try {
      // Fetch from inventory_planning_view with all required data
      const { data: inventoryData, error: invError } = await supabase
        .from('inventory_planning_view')
        .select('*');

      if (invError) throw invError;

      // Fetch ADU data
      const { data: aduData, error: aduError } = await supabase
        .from('adu_90d_view')
        .select('*');

      if (aduError) throw aduError;

      // Fetch on-hand data
      const { data: onHandData, error: onHandError } = await supabase
        .from('onhand_latest_view')
        .select('*');

      if (onHandError) throw onHandError;

      // Fetch on-order data
      const { data: onOrderData, error: onOrderError } = await supabase
        .from('onorder_view')
        .select('*');

      if (onOrderError) throw onOrderError;

      // Fetch qualified demand (confirmed sales orders)
      const { data: qualifiedDemandData, error: qdError } = await supabase
        .from('open_so')
        .select('product_id, location_id, qty')
        .eq('status', 'CONFIRMED');

      if (qdError) throw qdError;

      // Fetch lead time components
      const { data: dltData, error: dltError } = await supabase
        .from('lead_time_components')
        .select('product_id, location_id, total_lead_time_days');

      if (dltError) throw dltError;

      // Create lookup maps
      const aduMap = new Map(aduData?.map(a => [`${a.product_id}-${a.location_id}`, a.adu_adj || 0]) || []);
      const onHandMap = new Map(onHandData?.map(oh => [`${oh.product_id}-${oh.location_id}`, oh.qty_on_hand || 0]) || []);
      const onOrderMap = new Map(onOrderData?.map(oo => [`${oo.product_id}-${oo.location_id}`, oo.qty_on_order || 0]) || []);
      const dltMap = new Map(dltData?.map(d => [`${d.product_id}-${d.location_id}`, d.total_lead_time_days || 14]) || []);
      
      // Aggregate qualified demand
      const qdMap = new Map<string, number>();
      qualifiedDemandData?.forEach(qd => {
        const key = `${qd.product_id}-${qd.location_id}`;
        qdMap.set(key, (qdMap.get(key) || 0) + (qd.qty || 0));
      });

      // Combine data
      const coverageItems: CoverageItem[] = (inventoryData || [])
        .filter(inv => inv.product_id && inv.location_id && inv.sku && inv.product_name)
        .map(inv => {
        const key = `${inv.product_id}-${inv.location_id}`;
        const adu = aduMap.get(key) || inv.average_daily_usage || 1;
        const onHand = onHandMap.get(key) || inv.current_stock_level || 0;
        const onOrder = onOrderMap.get(key) || 0;
        const qualifiedDemand = qdMap.get(key) || 0;
        const dlt = dltMap.get(key) || inv.lead_time_days || 14;
        
        const nfp = onHand + onOrder - qualifiedDemand;
        const dos = adu > 0 ? nfp / adu : 0;
        
        // Buffer zones from inventory_planning_view
        const tor = inv.tor || 0;
        const toy = inv.toy || 0;
        const tog = inv.tog || 0;
        
        // Calculate execution priority based on buffer position
        let execution_priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
        if (nfp <= tor) execution_priority = 'CRITICAL';
        else if (nfp <= toy) execution_priority = 'HIGH';
        else if (nfp <= tog) execution_priority = 'MEDIUM';
        else execution_priority = 'LOW';
        
        // DDMRP-compliant order quantity calculation
        const targetNFP = tog || (15 * adu); // Use TOG or fallback to 15 days
        const projectedNFP = nfp + onOrder;
        const shouldOrder = projectedNFP < (toy || targetNFP * 0.5);
        
        let suggestedOrderQty = 0;
        if (shouldOrder) {
          const baseOrderQty = Math.max(0, targetNFP - nfp);
          const moq = inv.min_order_qty || 0;
          const rounding = inv.rounding_multiple || 1;
          
          // Apply MOQ and rounding
          suggestedOrderQty = Math.max(moq, Math.ceil(baseOrderQty / rounding) * rounding);
        }

        return {
          product_id: inv.product_id!,
          location_id: inv.location_id!,
          sku: inv.sku!,
          product_name: inv.product_name!,
          adu,
          dlt,
          on_hand: onHand,
          on_order: onOrder,
          qualified_demand: qualifiedDemand,
          nfp,
          dos,
          suggested_order_qty: suggestedOrderQty,
          buffer_profile_id: inv.buffer_profile_id || undefined,
          category: inv.category || undefined,
          tor,
          toy,
          tog,
          execution_priority
        };
      });

      setItems(coverageItems);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading coverage data:', error);
      toast({
        title: 'Error Loading Data',
        description: error instanceof Error ? error.message : 'Failed to load coverage data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoverageData();
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(loadCoverageData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate KPI data
  const kpiData = useMemo(() => {
    const totalSKUs = items.length;
    const redCount = items.filter(i => i.dos < i.dlt).length;
    const yellowCount = items.filter(i => i.dos >= i.dlt && i.dos <= i.dlt * 1.5).length;
    const greenCount = items.filter(i => i.dos > i.dlt * 1.5).length;
    const avgDoS = items.reduce((sum, i) => sum + i.dos, 0) / (totalSKUs || 1);
    
    return {
      avgDoS,
      redBuffersCount: redCount,
      atRiskCount: redCount,
      atRiskPercent: (redCount / totalSKUs) * 100,
      coverageTrend: 0.8, // This would come from historical comparison
      totalSKUs,
      greenPercent: (greenCount / totalSKUs) * 100,
      yellowPercent: (yellowCount / totalSKUs) * 100,
      redPercent: (redCount / totalSKUs) * 100
    };
  }, [items]);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      if (searchTerm && !item.sku.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Location filter
      if (locationFilter !== 'all' && item.location_id !== locationFilter) {
        return false;
      }
      
      // Buffer profile filter
      if (bufferProfileFilter !== 'all' && item.buffer_profile_id !== bufferProfileFilter) {
        return false;
      }
      
      return true;
    });
  }, [items, searchTerm, locationFilter, bufferProfileFilter]);

  // Handle order creation
  const handleCreateOrder = async (item: CoverageItem, quantity: number) => {
    try {
      const { error } = await supabase
        .from('open_pos')
        .insert({
          product_id: item.product_id,
          location_id: item.location_id,
          ordered_qty: quantity,
          received_qty: 0,
          order_date: new Date().toISOString().split('T')[0],
          expected_date: new Date(Date.now() + item.dlt * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'OPEN'
        });

      if (error) throw error;

      toast({
        title: 'Order Created',
        description: `Purchase order for ${quantity} units of ${item.sku} created successfully`,
      });

      // Refresh data
      loadCoverageData();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error Creating Order',
        description: error instanceof Error ? error.message : 'Failed to create purchase order',
        variant: 'destructive'
      });
    }
  };

  // Handle bulk order creation for critical items
  const handleBulkCreateOrders = async (criticalItems: CoverageItem[]) => {
    try {
      const orders = criticalItems
        .filter(item => item.suggested_order_qty > 0)
        .map(item => ({
          product_id: item.product_id,
          location_id: item.location_id,
          ordered_qty: item.suggested_order_qty,
          received_qty: 0,
          order_date: new Date().toISOString().split('T')[0],
          expected_date: new Date(Date.now() + item.dlt * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'OPEN'
        }));

      const { error } = await supabase.from('open_pos').insert(orders);

      if (error) throw error;

      toast({
        title: 'Bulk Orders Created',
        description: `Successfully created ${orders.length} emergency purchase orders`,
      });

      loadCoverageData();
    } catch (error) {
      console.error('Error creating bulk orders:', error);
      toast({
        title: 'Error Creating Bulk Orders',
        description: error instanceof Error ? error.message : 'Failed to create orders',
        variant: 'destructive'
      });
    }
  };

  // Handle export
  const handleExport = () => {
    const csv = [
      ['SKU', 'Product Name', 'Location', 'ADU', 'DLT', 'On Hand', 'On Order', 'Qualified Demand', 'NFP', 'DoS', 'Suggested Order Qty'].join(','),
      ...filteredItems.map(item => [
        item.sku,
        item.product_name,
        item.location_id,
        item.adu.toFixed(2),
        item.dlt,
        item.on_hand.toFixed(0),
        item.on_order.toFixed(0),
        item.qualified_demand.toFixed(0),
        item.nfp.toFixed(0),
        item.dos.toFixed(2),
        item.suggested_order_qty.toFixed(0)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coverage-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const uniqueLocations = Array.from(new Set(items.map(i => i.location_id)));
  const uniqueProfiles = Array.from(new Set(items.map(i => i.buffer_profile_id).filter(Boolean)));
  
  // Critical items (0 DoS or below TOR)
  const criticalItems = items.filter(i => i.dos === 0 || (i.tor && i.nfp <= i.tor));

  return (
    <div className="space-y-6 pb-24">
      {/* Critical Alert Banner */}
      {criticalItems.length > 0 && (
        <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6 animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 bg-destructive rounded-full animate-pulse" />
                <h3 className="text-xl font-bold text-destructive">
                  🚨 CRITICAL STOCKOUT ALERT
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {criticalItems.length} SKUs are at critical levels (0 Days of Supply or below Red Zone). 
                Immediate action required to prevent stockouts.
              </p>
              <div className="flex gap-2">
                <Button 
                  size="lg" 
                  variant="destructive"
                  onClick={() => handleBulkCreateOrders(criticalItems)}
                  className="font-bold"
                >
                  📦 GENERATE {criticalItems.filter(i => i.suggested_order_qty > 0).length} EMERGENCY ORDERS NOW
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setStatusFilter('red')}
                >
                  View Critical Items
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header Bar */}
      <Card className="sticky top-0 z-20 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SKU / Item / Location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 w-full lg:w-auto">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={bufferProfileFilter} onValueChange={setBufferProfileFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Profiles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  {uniqueProfiles.map(prof => (
                    <SelectItem key={prof} value={prof || 'none'}>{prof || 'None'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon"
                onClick={loadCoverageData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>

              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Summary */}
      <CoverageKPICards 
        data={kpiData} 
        onCardClick={(filter) => setStatusFilter(filter as typeof statusFilter)} 
      />

      {/* Coverage Table */}
      <Card>
        <CardContent className="p-6">
          <CoverageTable
            items={filteredItems}
            onRowClick={(item) => {
              setSelectedItem(item);
              setIsTimelineOpen(true);
            }}
            onCreateOrder={(item) => {
              setSelectedItem(item);
              setIsActionOpen(true);
            }}
            statusFilter={statusFilter}
          />
        </CardContent>
      </Card>

      {/* Drawers */}
      <CoverageTimelineDrawer
        item={selectedItem}
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        onConfirmOrder={handleCreateOrder}
      />

      <CoverageActionDrawer
        item={selectedItem}
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onConfirm={handleCreateOrder}
      />

      {/* Footer */}
      <CoverageFooter
        totalItems={items.length}
        redCount={kpiData.redBuffersCount}
        yellowCount={Math.round((kpiData.yellowPercent / 100) * items.length)}
        greenCount={Math.round((kpiData.greenPercent / 100) * items.length)}
        avgDoS={kpiData.avgDoS}
        lastUpdated={lastUpdated}
        onExport={handleExport}
      />
    </div>
  );
};
