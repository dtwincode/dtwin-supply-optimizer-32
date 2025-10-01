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

      console.log('Loaded locations:', locations);

      // Load decoupling points
      const { data: decouplingPoints, error: dpError } = await supabase
        .from('decoupling_points')
        .select('product_id, location_id, buffer_profile_id');

      if (dpError) throw dpError;

      console.log('Loaded decoupling points:', decouplingPoints);

      // Create a map of locations with decoupling points
      const decouplingLocations = new Set(
        decouplingPoints?.map((dp: DecouplingPointData) => dp.location_id) || []
      );

      // Show all locations - treat any non-restaurant as DC for visualization
      const allLocations = locations || [];
      
      if (allLocations.length === 0) {
        toast.error('No locations found in database');
        setIsLoading(false);
        return;
      }
      
      // Create nodes and edges
      const flowNodes: Node[] = [];
      const flowEdges: Edge[] = [];

      // Position all locations in a hierarchical layout
      const locationsPerRow = 5;
      
      allLocations.forEach((location: any, i: number) => {
        const isDP = decouplingLocations.has(location.location_id);
        const col = i % locationsPerRow;
        const row = Math.floor(i / locationsPerRow);
        
        flowNodes.push({
          id: location.location_id,
          type: 'locationNode',
          position: { x: col * 250, y: row * 180 },
          data: {
            label: location.location_id,
            type: location.location_type || 'Location',
            region: location.region || 'N/A',
            isDecouplingPoint: isDP,
          },
        });

        // Create flow edges between locations if they have decoupling points
        if (i > 0 && isDP) {
          const prevLocation = allLocations[i - 1];
          flowEdges.push({
            id: `${prevLocation.location_id}-${location.location_id}`,
            source: prevLocation.location_id,
            target: location.location_id,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: 'hsl(var(--primary))',
            },
            style: {
              stroke: 'hsl(var(--primary))',
              strokeWidth: 2,
            },
          });
        }
      });

      setNodes(flowNodes);
      setEdges(flowEdges);

      // Calculate stats
      const uniqueRegions = new Set(allLocations.map((l: any) => l.region).filter(Boolean));
      setStats({
        total: allLocations.length,
        decouplingPoints: decouplingLocations.size,
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
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Buffer Point
              </Badge>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span>→</span> Flow Direction
              </div>
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
