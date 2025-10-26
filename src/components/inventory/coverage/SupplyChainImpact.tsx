import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowDown, ArrowUp, Building2, Store, Warehouse } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CoverageItem } from './CoverageTable';

interface LocationNode {
  location_id: string;
  echelon_type: string;
  echelon_level: number;
  buffer_strategy: string;
  nfp?: number;
  dos?: number;
  status?: 'safe' | 'warning' | 'critical';
}

interface SupplyChainImpactProps {
  item: CoverageItem;
}

export const SupplyChainImpact: React.FC<SupplyChainImpactProps> = ({ item }) => {
  const [upstreamLocations, setUpstreamLocations] = useState<LocationNode[]>([]);
  const [downstreamLocations, setDownstreamLocations] = useState<LocationNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplyChainData();
  }, [item.location_id, item.product_id]);

  const loadSupplyChainData = async () => {
    setLoading(true);
    try {
      // Get current location info
      const { data: currentLocation } = await supabase
        .from('location_hierarchy')
        .select('*')
        .eq('location_id', item.location_id)
        .single();

      if (!currentLocation) {
        setLoading(false);
        return;
      }

      // Get upstream (parent) locations
      if (currentLocation.parent_location_id) {
        const { data: upstreamData } = await supabase
          .from('location_hierarchy')
          .select('*')
          .eq('location_id', currentLocation.parent_location_id);

        if (upstreamData) {
          // Get inventory status for upstream locations
          const upstreamWithStatus = await Promise.all(
            upstreamData.map(async (loc) => {
              const { data: invData } = await supabase
                .from('inventory_net_flow_view')
                .select('nfp')
                .eq('location_id', loc.location_id)
                .eq('product_id', item.product_id)
                .single();

              const nfp = invData?.nfp || 0;
              const dos = item.adu > 0 ? nfp / item.adu : 0;

              return {
                ...loc,
                nfp,
                dos,
                status: dos < item.dlt ? 'critical' : dos < item.dlt * 1.5 ? 'warning' : 'safe'
              } as LocationNode;
            })
          );

          setUpstreamLocations(upstreamWithStatus);
        }
      }

      // Get downstream (child) locations
      const { data: downstreamData } = await supabase
        .from('location_hierarchy')
        .select('*')
        .eq('parent_location_id', item.location_id);

      if (downstreamData) {
        // Get inventory status for downstream locations
        const downstreamWithStatus = await Promise.all(
          downstreamData.map(async (loc) => {
            const { data: invData } = await supabase
              .from('inventory_net_flow_view')
              .select('nfp')
              .eq('location_id', loc.location_id)
              .eq('product_id', item.product_id)
              .single();

            const nfp = invData?.nfp || 0;
            const dos = item.adu > 0 ? nfp / item.adu : 0;

            return {
              ...loc,
              nfp,
              dos,
              status: dos < item.dlt ? 'critical' : dos < item.dlt * 1.5 ? 'warning' : 'safe'
            } as LocationNode;
          })
        );

        setDownstreamLocations(downstreamWithStatus);
      }
    } catch (error) {
      console.error('Error loading supply chain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEchelonIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'warehouse':
      case 'dc':
        return <Warehouse className="h-4 w-4" />;
      case 'store':
      case 'retail':
        return <Store className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string, dos: number) => {
    if (status === 'critical') {
      return <Badge variant="destructive" className="text-xs">LOW: {dos.toFixed(1)}d</Badge>;
    } else if (status === 'warning') {
      return <Badge className="bg-yellow-500 text-white text-xs">WATCH: {dos.toFixed(1)}d</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-700 text-xs">OK: {dos.toFixed(1)}d</Badge>;
  };

  const criticalUpstream = upstreamLocations.filter(l => l.status === 'critical').length;
  const criticalDownstream = downstreamLocations.filter(l => l.status === 'critical').length;

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Supply Chain Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Loading supply chain data...</p>
        </CardContent>
      </Card>
    );
  }

  if (upstreamLocations.length === 0 && downstreamLocations.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Supply Chain Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No multi-echelon dependencies found for this location.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Supply Chain Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upstream (Supplier) Locations */}
        {upstreamLocations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs font-medium">Upstream Suppliers</p>
            </div>
            <div className="space-y-2 pl-5">
              {upstreamLocations.map((loc) => (
                <div key={loc.location_id} className="flex items-center justify-between text-xs bg-muted/50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    {getEchelonIcon(loc.echelon_type)}
                    <span className="font-medium">{loc.location_id}</span>
                    <span className="text-muted-foreground">({loc.echelon_type})</span>
                  </div>
                  {getStatusBadge(loc.status || 'safe', loc.dos || 0)}
                </div>
              ))}
              {criticalUpstream > 0 && (
                <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                  <AlertTriangle className="h-3 w-3" />
                  <span>
                    {criticalUpstream} upstream location{criticalUpstream > 1 ? 's' : ''} LOW → May affect supply in {item.dlt} days
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Downstream (Customer) Locations */}
        {downstreamLocations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs font-medium">Downstream Locations Fed</p>
            </div>
            <div className="space-y-2 pl-5">
              {downstreamLocations.map((loc) => (
                <div key={loc.location_id} className="flex items-center justify-between text-xs bg-muted/50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    {getEchelonIcon(loc.echelon_type)}
                    <span className="font-medium">{loc.location_id}</span>
                    <span className="text-muted-foreground">({loc.echelon_type})</span>
                  </div>
                  {getStatusBadge(loc.status || 'safe', loc.dos || 0)}
                </div>
              ))}
              {criticalDownstream > 0 && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2 rounded">
                  <AlertTriangle className="h-3 w-3" />
                  <span>
                    {criticalDownstream} downstream location{criticalDownstream > 1 ? 's' : ''} will stockout if not replenished
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {(criticalUpstream > 0 || criticalDownstream > 0) && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-destructive">
              ⚠️ Action Required: Order now to prevent network-wide stockouts
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
