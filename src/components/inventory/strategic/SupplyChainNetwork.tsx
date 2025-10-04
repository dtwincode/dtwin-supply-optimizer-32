import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Warehouse, Building2, Users, RefreshCw, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LocationNode {
  location_id: string;
  location_type: string | null;
  region: string | null;
}

interface DecouplingPointData {
  product_id: string;
  location_id: string;
  buffer_profile_id: string;
}

interface AlignmentStatus {
  locationId: string;
  aligned: boolean;
  hasDecoupling: boolean;
  hasBuffer: boolean;
  issues: string[];
}

const nodeTypes = {
  locationNode: ({ data }: any) => (
    <div className={`px-4 py-3 rounded-lg border-2 bg-card shadow-lg min-w-[140px] relative ${
      data.isDecouplingPoint ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      {/* Alignment Badge */}
      {data.alignmentStatus && (
        <div className="absolute -top-2 -right-2">
          {data.alignmentStatus.aligned ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 h-6 w-6 rounded-full p-0 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </Badge>
          ) : data.alignmentStatus.hasDecoupling && !data.alignmentStatus.hasBuffer ? (
            <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center" title="Empty Decouple: No buffer profile">
              <XCircle className="h-4 w-4" />
            </Badge>
          ) : data.alignmentStatus.hasBuffer && !data.alignmentStatus.hasDecoupling ? (
            <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600 h-6 w-6 rounded-full p-0 flex items-center justify-center" title="Orphan Buffer: Buffer without decoupling">
              <AlertTriangle className="h-4 w-4 text-white" />
            </Badge>
          ) : null}
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-1">
        {data.type === 'DC' && <Warehouse className="h-5 w-5 text-primary" />}
        {data.type === 'Restaurant' && <Building2 className="h-5 w-5 text-primary" />}
        {data.type === 'Customer' && <Users className="h-4 w-4 text-muted-foreground" />}
        <div className="font-semibold text-sm">{data.label}</div>
      </div>
      {data.isDecouplingPoint && (
        <div className="flex items-center gap-1 mt-2 bg-primary/10 px-2 py-1 rounded">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs text-primary font-bold">BUFFER POINT</span>
        </div>
      )}
      {data.region && (
        <div className="text-xs text-muted-foreground mt-1">{data.region}</div>
      )}
      {data.level && (
        <div className="text-xs text-muted-foreground font-mono mt-1">Level {data.level}</div>
      )}
    </div>
  ),
};

export function SupplyChainNetwork() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ 
    total: 0, 
    decouplingPoints: 0, 
    regions: 0, 
    dcs: 0, 
    restaurants: 0,
    misalignments: 0,
  });
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [alignmentData, setAlignmentData] = useState<AlignmentStatus[]>([]);

  useEffect(() => {
    loadNetworkData();
    
    // Subscribe to decoupling points changes for real-time sync
    const channel = supabase
      .channel('decoupling-points-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'decoupling_points'
        },
        (payload) => {
          console.log('[SupplyChainNetwork] Decoupling point changed:', payload);
          toast.info('Decoupling points updated - refreshing network');
          loadNetworkData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadNetworkData = async () => {
    try {
      console.log('[SupplyChainNetwork] Starting data load...');
      
      // Load locations
      const { data: locations, error: locError } = await supabase
        .from('location_master')
        .select('location_id, location_type, region');

      if (locError) {
        console.error('[SupplyChainNetwork] Location error:', locError);
        throw locError;
      }

      console.log('[SupplyChainNetwork] Loaded locations:', locations?.length, locations);

      // Load decoupling points
      const { data: decouplingPoints, error: dpError } = await supabase
        .from('decoupling_points')
        .select('product_id, location_id, buffer_profile_id');

      if (dpError) {
        console.error('[SupplyChainNetwork] Decoupling error:', dpError);
        throw dpError;
      }

      console.log('[SupplyChainNetwork] Loaded decoupling points:', decouplingPoints?.length, decouplingPoints);

      // Load product master to check buffer profiles
      const { data: products } = await supabase
        .from('product_master')
        .select('product_id, buffer_profile_id');

      // Create alignment status for each location
      const alignmentStatuses: AlignmentStatus[] = [];
      const locationAlignment: Record<string, AlignmentStatus> = {};

      locations?.forEach((location) => {
        const locationDecouplingPoints = decouplingPoints?.filter(
          (dp: DecouplingPointData) => dp.location_id === location.location_id
        ) || [];
        
        const locationProductsWithBuffers = locationDecouplingPoints.filter((dp: DecouplingPointData) => {
          const product = products?.find(p => p.product_id === dp.product_id);
          return product?.buffer_profile_id && product.buffer_profile_id !== 'BP_DEFAULT';
        });

        const hasDecoupling = locationDecouplingPoints.length > 0;
        const hasBuffer = locationProductsWithBuffers.length > 0;
        const aligned = (hasDecoupling && hasBuffer) || (!hasDecoupling && !hasBuffer);

        const issues: string[] = [];
        if (hasDecoupling && !hasBuffer) issues.push('empty_decouple');
        if (hasBuffer && !hasDecoupling) issues.push('orphan_buffer');

        const status: AlignmentStatus = {
          locationId: location.location_id,
          aligned,
          hasDecoupling,
          hasBuffer,
          issues,
        };

        alignmentStatuses.push(status);
        locationAlignment[location.location_id] = status;
      });

      setAlignmentData(alignmentStatuses);

      // Create a map of locations with decoupling points
      const decouplingLocations = new Set(
        decouplingPoints?.map((dp: DecouplingPointData) => dp.location_id) || []
      );

      const allLocations = locations || [];

      // Separate locations by type for hierarchical layout
      const dcs = allLocations.filter((l: any) => 
        l.location_type?.toUpperCase().includes('DISTRIBUTION') || 
        l.location_type?.toUpperCase() === 'DC'
      );
      const restaurants = allLocations.filter((l: any) => 
        l.location_type?.toUpperCase() === 'RESTAURANT'
      );
      const others = allLocations.filter((l: any) => 
        !l.location_type?.toUpperCase().includes('DISTRIBUTION') && 
        l.location_type?.toUpperCase() !== 'DC' && 
        l.location_type?.toUpperCase() !== 'RESTAURANT'
      );
      
      if (allLocations.length === 0) {
        console.error('[SupplyChainNetwork] No locations found!');
        toast.error('No locations found in database');
        setIsLoading(false);
        return;
      }

      console.log('[SupplyChainNetwork] Categorized locations:', { 
        total: allLocations.length, 
        dcs: dcs.length, 
        restaurants: restaurants.length,
        others: others.length,
        decouplingLocations: decouplingLocations.size 
      });

      // Create nodes and edges
      const flowNodes: Node[] = [];
      const flowEdges: Edge[] = [];

      // Layer 0: Other locations (old system) - Level i=0
      others.forEach((location: any, i: number) => {
        const isDP = decouplingLocations.has(location.location_id);
        flowNodes.push({
          id: location.location_id,
          type: 'locationNode',
          position: { x: 150 + i * 200, y: 80 },
          data: {
            label: location.location_id,
            type: location.location_type || 'Location',
            region: location.region || 'N/A',
            isDecouplingPoint: isDP,
            level: 0,
            alignmentStatus: locationAlignment[location.location_id],
          },
        });

        // Connect old locations to DCs
        const nearestDC = dcs.find((dc: any) => 
          dc.region === location.region
        ) || dcs[0];

        if (nearestDC) {
          flowEdges.push({
            id: `${location.location_id}-${nearestDC.location_id}`,
            source: location.location_id,
            target: nearestDC.location_id,
            type: 'smoothstep',
            animated: isDP,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isDP ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            },
            style: {
              stroke: isDP ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              strokeWidth: isDP ? 3 : 1.5,
            },
          });
        }
      });

      // Layer 1: Distribution Centers (top of supply chain) - Level i=1
      dcs.forEach((dc: any, i: number) => {
        const isDP = decouplingLocations.has(dc.location_id);
        flowNodes.push({
          id: dc.location_id,
          type: 'locationNode',
          position: { x: 150 + i * 450, y: 300 },
          data: {
            label: dc.location_id,
            type: 'DC',
            region: dc.region || 'N/A',
            isDecouplingPoint: isDP,
            level: 1,
            alignmentStatus: locationAlignment[dc.location_id],
          },
        });
      });

      // Layer 2: Restaurants grouped by region (Level i=2)
      const regionDCMap: Record<string, string> = {
        'Midwest': 'DC_MIDWEST_CHI',
        'Southeast': 'DC_SOUTHEAST_ATL',
        'West': 'DC_WEST_LA',
      };

      restaurants.forEach((restaurant: any, i: number) => {
        const isDP = decouplingLocations.has(restaurant.location_id);
        const region = restaurant.region || 'Unknown';
        
        const dcId = regionDCMap[region];
        const dcIndex = dcs.findIndex((dc: any) => dc.location_id === dcId);
        
        const restaurantsInRegion = restaurants.filter((r: any) => r.region === region);
        const indexInRegion = restaurantsInRegion.findIndex((r: any) => r.location_id === restaurant.location_id);
        
        const baseX = 150 + (dcIndex >= 0 ? dcIndex : 1) * 450;
        const offsetX = (indexInRegion % 2) * 200 - 100;
        const offsetY = Math.floor(indexInRegion / 2) * 160;
        
        flowNodes.push({
          id: restaurant.location_id,
          type: 'locationNode',
          position: { x: baseX + offsetX, y: 550 + offsetY },
          data: {
            label: restaurant.location_id,
            type: 'Restaurant',
            region: region,
            isDecouplingPoint: isDP,
            level: 2,
            alignmentStatus: locationAlignment[restaurant.location_id],
          },
        });

        // Create edge from DC to Restaurant
        if (dcId && dcs.some((dc: any) => dc.location_id === dcId)) {
          flowEdges.push({
            id: `${dcId}-${restaurant.location_id}`,
            source: dcId,
            target: restaurant.location_id,
            type: 'smoothstep',
            animated: isDP,
            label: isDP ? '🛡️' : '',
            labelStyle: { fontSize: 18 },
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: { fill: 'hsl(var(--primary))', fillOpacity: 0.1 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: isDP ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            },
            style: {
              stroke: isDP ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              strokeWidth: isDP ? 3 : 2,
            },
          });
        }
      });

      console.log('[SupplyChainNetwork] Created network:', { 
        nodes: flowNodes.length, 
        edges: flowEdges.length,
        firstNode: flowNodes[0],
        firstEdge: flowEdges[0],
      });

      console.log('[SupplyChainNetwork] Setting nodes and edges to state...');
      setNodes(flowNodes);
      setEdges(flowEdges);

      console.log('[SupplyChainNetwork] Nodes and edges set successfully');

      // Calculate stats
      const uniqueRegions = new Set(allLocations.map((l: any) => l.region).filter(Boolean));
      const misalignmentCount = alignmentStatuses.filter(s => !s.aligned).length;
      
      setStats({
        total: allLocations.length,
        decouplingPoints: decouplingLocations.size,
        regions: uniqueRegions.size,
        dcs: dcs.length,
        restaurants: restaurants.length,
        misalignments: misalignmentCount,
      });
      
      setLastSync(new Date());
      setIsLoading(false);
      console.log('[SupplyChainNetwork] Data load complete');
    } catch (error) {
      console.error('[SupplyChainNetwork] Error loading network:', error);
      toast.error('Failed to load supply chain network');
      setIsLoading(false);
    }
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    toast.info(`Location: ${node.data.label}`, {
      description: `Type: ${node.data.type} | Region: ${node.data.region}`,
    });
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Help Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Understanding the Supply Chain Network</AlertTitle>
        <AlertDescription className="space-y-2 mt-2">
          <p className="text-sm">
            This visualization shows your complete supply chain flow from warehouses to restaurants:
          </p>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li><strong>Level 0 (Top):</strong> Legacy/Other locations</li>
            <li><strong>Level 1 (Middle):</strong> Distribution Centers (DCs) - Hub locations</li>
            <li><strong>Level 2 (Bottom):</strong> Restaurants - Final delivery points</li>
            <li><strong>🛡️ Buffer Points:</strong> Locations highlighted with shield icon are strategic decoupling points (where inventory buffers are maintained)</li>
            <li><strong>Flow Direction:</strong> Arrows show material flow from DCs to restaurants</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            <CheckCircle className="h-3 w-3 inline mr-1" />
            This network automatically syncs with your Strategic Decoupling Points in real-time.
          </p>
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All network nodes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Warehouse className="h-3 w-3" />
              DCs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dcs}</div>
            <p className="text-xs text-muted-foreground mt-1">Distribution Centers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Restaurants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.restaurants}</div>
            <p className="text-xs text-muted-foreground mt-1">Delivery points</p>
          </CardContent>
        </Card>
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-1 text-primary">
              <Shield className="h-3 w-3" />
              Buffer Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.decouplingPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">Strategic positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.regions}</div>
            <p className="text-xs text-muted-foreground mt-1">Geographic areas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Supply Chain Network Topology</CardTitle>
              <CardDescription className="mt-1">
                Visual representation of your supply chain structure
                {lastSync && (
                  <span className="text-xs ml-2">
                    • Last synced: {lastSync.toLocaleTimeString()}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info('Refreshing network...');
                  loadNetworkData();
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
          {/* Legend */}
          <div className="flex gap-4 items-center mt-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <Warehouse className="h-4 w-4 text-primary" />
              <span>Distribution Center</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Restaurant</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Other Location</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold">Buffer Point (Strategic)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>→</span>
              <span>Material Flow</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="default" className="bg-green-500 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </Badge>
              <span>Aligned</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                <XCircle className="h-3 w-3" />
              </Badge>
              <span>Empty Decouple</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="bg-orange-500 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 text-white" />
              </Badge>
              <span>Orphan Buffer</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height: '600px', width: '100%' }} className="bg-muted/5">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.1}
              maxZoom={1.5}
              defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
              <Controls />
            </ReactFlow>
            {nodes.length === 0 && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="text-center">
                  <p className="text-muted-foreground">No network data to display</p>
                  <p className="text-sm text-muted-foreground mt-2">Check console for errors</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
