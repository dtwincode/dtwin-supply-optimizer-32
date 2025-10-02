import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, TrendingDown, Package, AlertTriangle } from 'lucide-react';

interface BufferBreach {
  event_id: number;
  product_id: string;
  location_id: string;
  breach_type: string;
  severity: string | null;
  detected_ts: string;
  current_oh: number | null;
  threshold: number | null;
  acknowledged: boolean | null;
}

interface ReplenishmentOrder {
  proposal_id: number;
  product_id: string;
  location_id: string;
  qty_recommend: number;
  reason: string;
  status: string;
  target_due_date: string | null;
}

const DDMRP: React.FC = () => {
  const [breaches, setBreaches] = useState<BufferBreach[]>([]);
  const [replenishment, setReplenishment] = useState<ReplenishmentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDDMRPData();
  }, []);

  const loadDDMRPData = async () => {
    setIsLoading(true);
    try {
      // Load buffer breaches
      const { data: breachData, error: breachError } = await supabase
        .from('buffer_breach_events')
        .select('*')
        .order('detected_ts', { ascending: false })
        .limit(20);

      if (breachError) throw breachError;
      setBreaches(breachData || []);

      // Load replenishment orders
      const { data: replenishData, error: replenishError } = await supabase
        .from('replenishment_orders')
        .select('*')
        .eq('status', 'DRAFT')
        .order('proposal_ts', { ascending: false })
        .limit(20);

      if (replenishError) throw replenishError;
      setReplenishment(replenishData || []);
    } catch (error) {
      console.error('Error loading DDMRP data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getBreachTypeLabel = (type: string) => {
    switch (type) {
      case 'below_tor': return 'Critical (Below TOR)';
      case 'below_toy': return 'Warning (Below TOY)';
      case 'above_tog': return 'Excess (Above TOG)';
      default: return type;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DDMRP Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Demand Driven Material Requirements Planning - Alerts & Actions
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="h-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Critical Breaches</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {breaches.filter(b => b.severity === 'HIGH').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Require immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{replenishment.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Breaches</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{breaches.length}</div>
                  <p className="text-xs text-muted-foreground">
                    All severity levels
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Buffer Breaches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Buffer Breach Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {breaches.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No buffer breaches detected. All inventory levels are within acceptable ranges.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {breaches.map((breach) => (
                      <div
                        key={breach.event_id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getSeverityColor(breach.severity)} text-white`}>
                              {breach.severity}
                            </Badge>
                            <span className="font-semibold">{breach.product_id}</span>
                            <span className="text-sm text-muted-foreground">@ {breach.location_id}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getBreachTypeLabel(breach.breach_type)} - 
                            On Hand: {breach.current_oh?.toFixed(0) || 0} | 
                            Threshold: {breach.threshold?.toFixed(0) || 0}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(breach.detected_ts).toLocaleString()}
                          </div>
                        </div>
                        {breach.acknowledged && (
                          <Badge variant="outline">Acknowledged</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Replenishment Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Recommended Replenishment Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {replenishment.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No replenishment orders pending. All stock levels are adequate.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {replenishment.map((order) => (
                      <div
                        key={order.proposal_id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{order.status}</Badge>
                            <span className="font-semibold">{order.product_id}</span>
                            <span className="text-sm text-muted-foreground">@ {order.location_id}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Recommended Qty:</span> {order.qty_recommend?.toFixed(0) || 0}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {order.reason} | Due: {order.target_due_date || 'TBD'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DDMRP;
