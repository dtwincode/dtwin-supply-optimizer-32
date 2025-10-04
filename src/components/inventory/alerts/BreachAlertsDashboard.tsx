import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryFilter } from "../InventoryFilterContext";

interface BufferBreach {
  event_id: number;
  product_id: string;
  location_id: string;
  breach_type: 'below_tor' | 'below_toy' | 'above_tog';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detected_ts: string;
  current_oh: number;
  threshold: number;
  acknowledged: boolean;
  acknowledged_at: string | null;
}

export function BreachAlertsDashboard() {
  const { toast } = useToast();
  const { filters } = useInventoryFilter();
  const [breaches, setBreaches] = useState<BufferBreach[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterAcknowledged, setFilterAcknowledged] = useState<string>("unacknowledged");

  useEffect(() => {
    loadBreaches();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('buffer-breaches')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'buffer_breach_events'
        },
        (payload) => {
          console.log('New breach detected:', payload);
          loadBreaches();
          toast({
            title: "New Buffer Breach Detected",
            description: `${payload.new.product_id} at ${payload.new.location_id}`,
            variant: "destructive",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  const loadBreaches = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('buffer_breach_events')
        .select('*')
        .order('detected_ts', { ascending: false });

      // Apply inventory filters
      if (filters.locationId) {
        query = query.eq('location_id', filters.locationId);
      }
      
      // Apply local filters
      if (filterSeverity !== 'all') {
        query = query.eq('severity', filterSeverity.toUpperCase());
      }
      if (filterAcknowledged === 'unacknowledged') {
        query = query.eq('acknowledged', false);
      } else if (filterAcknowledged === 'acknowledged') {
        query = query.eq('acknowledged', true);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setBreaches((data || []) as BufferBreach[]);
    } catch (error: any) {
      toast({
        title: "Error loading breaches",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (eventId: number) => {
    try {
      const { error } = await supabase
        .from('buffer_breach_events')
        .update({ 
          acknowledged: true, 
          acknowledged_at: new Date().toISOString() 
        })
        .eq('event_id', eventId);

      if (error) throw error;

      toast({
        title: "Breach acknowledged",
        description: "Alert has been marked as acknowledged",
      });
      loadBreaches();
    } catch (error: any) {
      toast({
        title: "Error acknowledging breach",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'LOW':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'destructive' | 'default' | 'secondary'> = {
      HIGH: 'destructive',
      MEDIUM: 'default',
      LOW: 'secondary',
    };
    return <Badge variant={variants[severity] || 'default'}>{severity}</Badge>;
  };

  const getBreachTypeLabel = (breachType: string) => {
    const labels: Record<string, string> = {
      below_tor: 'Below Red Zone',
      below_toy: 'Below Yellow Zone',
      above_tog: 'Above Green Zone',
    };
    return labels[breachType] || breachType;
  };

  const stats = {
    total: breaches.length,
    high: breaches.filter(b => b.severity === 'HIGH' && !b.acknowledged).length,
    medium: breaches.filter(b => b.severity === 'MEDIUM' && !b.acknowledged).length,
    low: breaches.filter(b => b.severity === 'LOW' && !b.acknowledged).length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Buffer Breach Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring of DDMRP buffer threshold breaches
          </p>
        </div>
        <Button onClick={loadBreaches} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Breaches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              High Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.high}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Medium Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.medium}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Low Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.low}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Label>Severity</Label>
              <Select value={filterSeverity} onValueChange={(val) => { setFilterSeverity(val); loadBreaches(); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Status</Label>
              <Select value={filterAcknowledged} onValueChange={(val) => { setFilterAcknowledged(val); loadBreaches(); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Breach List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Breaches</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${breaches.length} breach(es) found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Breach Type</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breaches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No breaches found
                  </TableCell>
                </TableRow>
              ) : (
                breaches.map((breach) => (
                  <TableRow key={breach.event_id} className={breach.acknowledged ? 'opacity-60' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(breach.severity)}
                        {getSeverityBadge(breach.severity)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{breach.product_id}</TableCell>
                    <TableCell>{breach.location_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getBreachTypeLabel(breach.breach_type)}</Badge>
                    </TableCell>
                    <TableCell>{breach.current_oh?.toFixed(0) || 'N/A'}</TableCell>
                    <TableCell>{breach.threshold?.toFixed(0) || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(breach.detected_ts).toLocaleDateString()} {new Date(breach.detected_ts).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {breach.acknowledged ? (
                        <Badge variant="secondary">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Acknowledged
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!breach.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(breach.event_id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
