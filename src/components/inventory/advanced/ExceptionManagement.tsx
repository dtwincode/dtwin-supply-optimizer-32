import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { useInventoryFilter } from '../InventoryFilterContext';
import { AlertTriangle, TrendingDown, Package, Clock, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInventoryConfig } from '@/hooks/useInventoryConfig';

interface Exception {
  id: number;
  type: 'buffer_breach' | 'stockout_risk' | 'excess_inventory' | 'slow_moving';
  severity: 'critical' | 'high' | 'medium' | 'low';
  sku: string;
  product_name: string;
  location: string;
  description: string;
  recommendation: string;
  value: number;
  status: 'open' | 'acknowledged' | 'resolved';
}

export const ExceptionManagement: React.FC = () => {
  const { filters } = useInventoryFilter();
  const { getConfig } = useInventoryConfig();
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedException, setSelectedException] = useState<Exception | null>(null);

  useEffect(() => {
    loadExceptions();
  }, [filters]);

  const loadExceptions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();
      
      let filtered = data;
      if (filters.productCategory) {
        filtered = filtered.filter(item => item.category === filters.productCategory);
      }
      if (filters.locationId) {
        filtered = filtered.filter(item => item.location_id === filters.locationId);
      }

      const detectedExceptions: Exception[] = [];

      const stockoutDaysThreshold = getConfig('stockout_risk_days_threshold', 7);
      const slowMoverDaysThreshold = getConfig('slow_mover_days_threshold', 30);
      const slowMoverADUThreshold = getConfig('slow_mover_adu_threshold', 1);
      const excessStockMultiplier = 1.2;

      filtered.forEach(item => {
        // Buffer breach exceptions
        if (item.buffer_status === 'RED') {
          detectedExceptions.push({
            id: item.id,
            type: 'buffer_breach',
            severity: 'critical',
            sku: item.sku,
            product_name: item.product_name,
            location: item.location_id,
            description: `NFP below red zone (${item.nfp.toFixed(0)} < ${item.tor.toFixed(0)})`,
            recommendation: `Expedite order of ${Math.ceil(item.tor - item.nfp)} units`,
            value: item.tor - item.nfp,
            status: 'open'
          });
        }

        // Stockout risk
        if (item.on_hand < item.average_daily_usage * stockoutDaysThreshold && item.average_daily_usage > 0) {
          detectedExceptions.push({
            id: item.id + 10000,
            type: 'stockout_risk',
            severity: 'high',
            sku: item.sku,
            product_name: item.product_name,
            location: item.location_id,
            description: `Only ${(item.on_hand / item.average_daily_usage).toFixed(1)} days of supply remaining`,
            recommendation: 'Review replenishment schedule',
            value: item.on_hand / item.average_daily_usage,
            status: 'open'
          });
        }

        // Excess inventory
        if (item.nfp > item.tog * excessStockMultiplier) {
          detectedExceptions.push({
            id: item.id + 20000,
            type: 'excess_inventory',
            severity: 'medium',
            sku: item.sku,
            product_name: item.product_name,
            location: item.location_id,
            description: `NFP exceeds TOG by ${((item.nfp / item.tog - 1) * 100).toFixed(0)}%`,
            recommendation: 'Consider redistribution or promotions',
            value: item.nfp - item.tog,
            status: 'open'
          });
        }

        // Slow moving
        if (item.average_daily_usage < slowMoverADUThreshold && item.on_hand > slowMoverDaysThreshold) {
          detectedExceptions.push({
            id: item.id + 30000,
            type: 'slow_moving',
            severity: 'low',
            sku: item.sku,
            product_name: item.product_name,
            location: item.location_id,
            description: `Low turnover: ${item.average_daily_usage.toFixed(2)} units/day`,
            recommendation: 'Review demand forecast and buffer settings',
            value: item.on_hand,
            status: 'open'
          });
        }
      });

      setExceptions(detectedExceptions.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }));
    } catch (error) {
      console.error('Error loading exceptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buffer_breach': return AlertTriangle;
      case 'stockout_risk': return TrendingDown;
      case 'excess_inventory': return Package;
      case 'slow_moving': return Clock;
      default: return AlertTriangle;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'buffer_breach': return 'Buffer Breach';
      case 'stockout_risk': return 'Stockout Risk';
      case 'excess_inventory': return 'Excess Inventory';
      case 'slow_moving': return 'Slow Moving';
      default: return type;
    }
  };

  const filteredExceptions = activeTab === 'all' 
    ? exceptions 
    : exceptions.filter(e => e.type === activeTab);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-96 bg-muted animate-pulse rounded" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Exception Management</h3>
        <div className="flex gap-2">
          <Badge variant="outline">{exceptions.length} Total</Badge>
          <Badge className="bg-red-500">{exceptions.filter(e => e.severity === 'critical').length} Critical</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({exceptions.length})</TabsTrigger>
          <TabsTrigger value="buffer_breach">Breaches ({exceptions.filter(e => e.type === 'buffer_breach').length})</TabsTrigger>
          <TabsTrigger value="stockout_risk">Stockout ({exceptions.filter(e => e.type === 'stockout_risk').length})</TabsTrigger>
          <TabsTrigger value="excess_inventory">Excess ({exceptions.filter(e => e.type === 'excess_inventory').length})</TabsTrigger>
          <TabsTrigger value="slow_moving">Slow ({exceptions.filter(e => e.type === 'slow_moving').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredExceptions.map(exception => {
              const Icon = getTypeIcon(exception.type);
              return (
                <div
                  key={exception.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`${getSeverityColor(exception.severity)} rounded-full p-2`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{exception.sku}</span>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(exception.type)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exception.location}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {exception.product_name}
                        </div>
                        <div className="text-sm mb-2">{exception.description}</div>
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          💡 {exception.recommendation}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedException(exception)}>
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredExceptions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <div>No {activeTab !== 'all' ? getTypeLabel(activeTab).toLowerCase() : ''} exceptions found</div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedException} onOpenChange={() => setSelectedException(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exception Details</DialogTitle>
          </DialogHeader>
          {selectedException && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <p className="text-lg font-semibold">{selectedException.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                  <p className="text-lg">{selectedException.product_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-lg">{selectedException.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Exception Type</label>
                  <Badge variant="outline">{getTypeLabel(selectedException.type)}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severity</label>
                  <Badge className={getSeverityColor(selectedException.severity)}>
                    {selectedException.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Value</label>
                  <p className="text-lg font-semibold">{selectedException.value.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1">{selectedException.description}</p>
              </div>
              
              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-muted-foreground">Recommendation</label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  💡 {selectedException.recommendation}
                </div>
              </div>

              <div className="pt-4 border-t flex gap-2">
                <Button className="flex-1" onClick={() => setSelectedException(null)}>
                  Close
                </Button>
                <Button className="flex-1" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
