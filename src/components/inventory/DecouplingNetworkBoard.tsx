import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, CircleDot } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type NodeData = {
  label: string;
  decouplingType?: string | null;
  bufferSize?: number;
  leadTime?: number;
  variabilityFactor?: number;
  demandProfile?: 'high' | 'medium' | 'low';
};

const initialNodes: Node<NodeData>[] = [
  {
    id: 'supplier-1',
    type: 'input',
    data: { 
      label: 'Supplier Factory',
      decouplingType: null
    },
    position: { x: 100, y: 50 },
    style: { 
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '10px',
      width: 180,
    },
  },
  {
    id: 'dc-1',
    type: 'default',
    data: { 
      label: 'Regional Distribution Center',
      decouplingType: null
    },
    position: { x: 400, y: 50 },
    style: { 
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '10px',
      width: 180,
    },
  },
  {
    id: 'dc-2',
    type: 'default',
    data: { 
      label: 'Local Distribution Center',
      decouplingType: null
    },
    position: { x: 400, y: 200 },
    style: { 
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '10px',
      width: 180,
    },
  },
  {
    id: 'retail-1',
    type: 'output',
    data: { 
      label: 'Retail Store',
      decouplingType: null
    },
    position: { x: 700, y: 50 },
    style: { 
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '10px',
      width: 180,
    },
  },
  {
    id: 'retail-2',
    type: 'output',
    data: { 
      label: 'Retail Store',
      decouplingType: null
    },
    position: { x: 700, y: 200 },
    style: { 
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '10px',
      width: 180,
    },
  },
];

const initialEdges = [
  { 
    id: 'e1-2', 
    source: 'supplier-1', 
    target: 'dc-1', 
    animated: true,
    style: { stroke: '#9333ea' }
  },
  { 
    id: 'e1-3', 
    source: 'supplier-1', 
    target: 'dc-2', 
    animated: true,
    style: { stroke: '#9333ea' }
  },
  { 
    id: 'e2-4', 
    source: 'dc-1', 
    target: 'retail-1', 
    animated: true,
    style: { stroke: '#9333ea' }
  },
  { 
    id: 'e3-5', 
    source: 'dc-2', 
    target: 'retail-2', 
    animated: true,
    style: { stroke: '#9333ea' }
  },
];

const decouplingTypes = {
  strategic: { 
    label: 'Strategic Point', 
    color: '#ef4444',
    description: 'Long lead times, high demand aggregation points',
    configOptions: {
      bufferSize: [50, 100, 150],
      leadTime: [7, 14, 30, 45],
      variabilityFactors: ['high', 'medium', 'low'] as const,
      demandProfiles: ['high', 'medium', 'low'] as const
    }
  },
  customer_order: { 
    label: 'Customer Order Point', 
    color: '#3b82f6',
    description: 'Where customer tolerance time meets lead time'
  },
  stock_point: { 
    label: 'Stock Point', 
    color: '#22c55e',
    description: 'Buffer against supply/demand variability'
  },
  intermediate: { 
    label: 'Intermediate Point', 
    color: '#a855f7',
    description: 'Process decoupling requirements'
  },
};

export const DecouplingNetworkBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const { toast } = useToast();

  const onConnect = (params: any) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    
    if (sourceNode?.data.decouplingType || targetNode?.data.decouplingType) {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#ef4444' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      
      toast({
        title: "Connection Created",
        description: "Decoupling point connected successfully",
      });
    }
  };

  const handleNodeClick = (_, node) => {
    if (node.data.decouplingType === 'strategic') {
      setSelectedNode(node);
    }
  };

  const handleAddDecouplingPoint = (type: string) => {
    const newNode: Node<NodeData> = {
      id: `decoupling-${Date.now()}`,
      type: 'default',
      data: { 
        label: decouplingTypes[type].label,
        decouplingType: type,
        bufferSize: type === 'strategic' ? 100 : undefined,
        leadTime: type === 'strategic' ? 14 : undefined,
        variabilityFactor: type === 'strategic' ? 'medium' : undefined,
        demandProfile: type === 'strategic' ? 'medium' : undefined
      },
      position: { x: 400, y: 300 },
      style: {
        background: '#ffffff',
        border: `2px solid ${decouplingTypes[type].color}`,
        borderRadius: '50%',
        padding: '8px',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    
    toast({
      title: "Decoupling Point Added",
      description: "Connect this point to locations in your network",
    });
  };

  const handleUpdateStrategicPoint = (config: Partial<NodeData>) => {
    if (!selectedNode) return;

    const processedConfig: Partial<NodeData> = {
      ...config,
      bufferSize: config.bufferSize ? Number(config.bufferSize) : undefined,
      leadTime: config.leadTime ? Number(config.leadTime) : undefined,
    };

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...processedConfig,
            },
          };
        }
        return node;
      })
    );

    toast({
      title: "Strategic Point Updated",
      description: "Configuration saved successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 border-b">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Add Decoupling Point
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <h4 className="font-medium leading-none">Select Decoupling Point Type</h4>
              <div className="grid gap-2">
                {Object.entries(decouplingTypes).map(([key, { label, color, description }]) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="justify-start gap-2 h-auto p-3"
                    onClick={() => handleAddDecouplingPoint(key)}
                  >
                    <CircleDot className="w-4 h-4" style={{ color }} />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-xs text-muted-foreground">{description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-[600px] border rounded-lg bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Strategic Point</DialogTitle>
            <DialogDescription>
              Set parameters for this strategic decoupling point
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Buffer Size</Label>
              <Select
                value={selectedNode?.data.bufferSize?.toString()}
                onValueChange={(value) => handleUpdateStrategicPoint({ bufferSize: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select buffer size..." />
                </SelectTrigger>
                <SelectContent>
                  {decouplingTypes.strategic.configOptions.bufferSize.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} units
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Lead Time</Label>
              <Select
                value={selectedNode?.data.leadTime?.toString()}
                onValueChange={(value) => handleUpdateStrategicPoint({ leadTime: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead time..." />
                </SelectTrigger>
                <SelectContent>
                  {decouplingTypes.strategic.configOptions.leadTime.map((days) => (
                    <SelectItem key={days} value={days.toString()}>
                      {days} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Variability Factor</Label>
              <Select
                value={selectedNode?.data.variabilityFactor?.toString()}
                onValueChange={(value) => handleUpdateStrategicPoint({ variabilityFactor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select variability..." />
                </SelectTrigger>
                <SelectContent>
                  {decouplingTypes.strategic.configOptions.variabilityFactors.map((factor) => (
                    <SelectItem key={factor} value={factor}>
                      {factor.charAt(0).toUpperCase() + factor.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Demand Profile</Label>
              <Select
                value={selectedNode?.data.demandProfile}
                onValueChange={(value) => handleUpdateStrategicPoint({ demandProfile: value as 'high' | 'medium' | 'low' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select demand profile..." />
                </SelectTrigger>
                <SelectContent>
                  {decouplingTypes.strategic.configOptions.demandProfiles.map((profile) => (
                    <SelectItem key={profile} value={profile}>
                      {profile.charAt(0).toUpperCase() + profile.slice(1)} Demand
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
