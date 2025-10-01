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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Warehouse, Building2, Users } from 'lucide-react';
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

const nodeTypes = {
  locationNode: ({ data }: any) => (
    <div className={`px-4 py-3 rounded-lg border-2 bg-card shadow-lg ${
      data.isDecouplingPoint ? 'border-primary' : 'border-border'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        {data.type === 'DC' && <Warehouse className="h-4 w-4 text-primary" />}
        {data.type === 'Restaurant' && <Building2 className="h-4 w-4 text-primary" />}
        {data.type === 'Customer' && <Users className="h-4 w-4 text-muted-foreground" />}
        <div className="font-semibold text-sm">{data.label}</div>
      </div>
      {data.isDecouplingPoint && (
        <div className="flex items-center gap-1 mt-1">
          <Shield className="h-3 w-3 text-primary" />
          <span className="text-xs text-primary font-medium">Buffer Point</span>
        </div>
      )}
      {data.region && (
        <div className="text-xs text-muted-foreground mt-1">{data.region}</div>
      )}
    </div>
  ),
};

export function SupplyChainNetwork() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, decouplingPoints: 0, regions: 0 });

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    try {
      // Load locations
      const { data: locations, error: locError } = await supabase
        .from('location_master')
        .select('location_id, location_type, region');

      if (locError) throw locError;

      // Load decoupling points
      const { data: decouplingPoints, error: dpError } = await supabase
        .from('decoupling_points')
        .select('product_id, location_id, buffer_profile_id');

      if (dpError) throw dpError;

      // Group locations by type
      const dcs = locations?.filter((l: LocationNode) => l.location_type === 'DC') || [];
      const restaurants = locations?.filter((l: LocationNode) => l.location_type === 'Restaurant') || [];
      
      // Create nodes
      const flowNodes: Node[] = [];
      const flowEdges: Edge[] = [];

      // Layer 1: Distribution Centers
      dcs.forEach((dc: LocationNode, i: number) => {
        const isDP = decouplingPoints?.some((dp: DecouplingPointData) => dp.location_id === dc.location_id);
        flowNodes.push({
          id: dc.location_id,
          type: 'locationNode',
          position: { x: 300 * i, y: 0 },
          data: {
            label: dc.location_id,
            type: 'DC',
            region: dc.region,
            isDecouplingPoint: isDP,
          },
        });
      });

      // Layer 2: Restaurants (connected to DCs)
      restaurants.forEach((restaurant: LocationNode, i: number) => {
        const isDP = decouplingPoints?.some((dp: DecouplingPointData) => dp.location_id === restaurant.location_id);
        
        // Position restaurants in a grid below DCs
        const col = i % 4;
        const row = Math.floor(i / 4);
        
        flowNodes.push({
          id: restaurant.location_id,
          type: 'locationNode',
          position: { x: 150 + col * 200, y: 200 + row * 150 },
          data: {
            label: restaurant.location_id,
            type: 'Restaurant',
            region: restaurant.region,
            isDecouplingPoint: isDP,
          },
        });

        // Connect restaurants to nearest DC (simplified - in reality would be based on actual routing)
        const nearestDC = dcs[Math.floor(i / (restaurants.length / Math.max(dcs.length, 1)))];
        if (nearestDC) {
          flowEdges.push({
            id: `${nearestDC.location_id}-${restaurant.location_id}`,
            source: nearestDC.location_id,
            target: restaurant.location_id,
            type: 'smoothstep',
            animated: isDP,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isDP ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            },
            style: {
              stroke: isDP ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              strokeWidth: isDP ? 2 : 1,
            },
          });
        }
      });

      // Add customer layer nodes (conceptual)
      const customerNode: Node = {
        id: 'customers',
        type: 'locationNode',
        position: { x: 400, y: 800 },
        data: {
          label: 'End Customers',
          type: 'Customer',
          region: 'All Regions',
          isDecouplingPoint: false,
        },
      };
      flowNodes.push(customerNode);

      // Connect some restaurants to customers (sampling)
      restaurants.slice(0, Math.min(5, restaurants.length)).forEach((restaurant: LocationNode) => {
        flowEdges.push({
          id: `${restaurant.location_id}-customers`,
          source: restaurant.location_id,
          target: 'customers',
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: 'hsl(var(--muted-foreground))',
            strokeWidth: 1,
            strokeDasharray: '5 5',
          },
        });
      });

      setNodes(flowNodes);
      setEdges(flowEdges);

      // Calculate stats
      const uniqueRegions = new Set(locations?.map((l: LocationNode) => l.region).filter(Boolean));
      setStats({
        total: locations?.length || 0,
        decouplingPoints: decouplingPoints?.length || 0,
        regions: uniqueRegions.size,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading network:', error);
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
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Buffer Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.decouplingPoints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.regions}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Supply Chain Network Topology</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Buffer Point
              </Badge>
              <Badge variant="secondary">Flow Direction</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height: '600px', width: '100%' }}>
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
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
              <Controls />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
