import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Position,
  Handle,
  ConnectionMode,
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
import { useToast } from '@/hooks/use-toast';
import { MapPin, CircleDot, Maximize2, Trash2, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type NodeData = {
  label: string;
  decouplingType?: string | null;
  bufferSize?: number;
  leadTime?: number;
  variabilityFactor?: 'high' | 'medium' | 'low';
  demandProfile?: 'high' | 'medium' | 'low';
  moq?: number;
  lotSizeFactor?: number;
  serviceLevel?: number;
  seasonalityFactor?: number;
  replenishmentFrequency?: 'daily' | 'weekly' | 'monthly';
  criticalityFactor?: 'high' | 'medium' | 'low';
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
      bufferSize: [50, 100, 150, 200, 300, 500] as const,
      leadTime: [7, 14, 21, 30, 45, 60, 90] as const,
      variabilityFactors: ['high', 'medium', 'low'] as const,
      demandProfiles: ['high', 'medium', 'low'] as const,
      moqValues: [10, 25, 50, 100, 250, 500] as const,
      lotSizeFactors: [1.0, 1.25, 1.5, 2.0] as const,
      serviceLevels: [0.90, 0.95, 0.98, 0.99] as const,
      replenishmentFrequencies: ['daily', 'weekly', 'monthly'] as const,
      criticalityFactors: ['high', 'medium', 'low'] as const,
      seasonalityFactors: [1.0, 1.2, 1.5, 2.0] as const
    }
  },
  customer_order: { 
    label: 'Customer Order Point', 
    color: '#3b82f6',
    description: 'Where customer tolerance time meets lead time',
    configOptions: {
      leadTime: [1, 2, 3, 5, 7, 14] as const,
      serviceLevel: [0.90, 0.95, 0.98, 0.99] as const,
      replenishmentFrequencies: ['daily', 'weekly'] as const,
      criticalityFactors: ['high', 'medium', 'low'] as const
    }
  },
  stock_point: { 
    label: 'Stock Point', 
    color: '#22c55e',
    description: 'Buffer against supply/demand variability',
    configOptions: {
      bufferSize: [25, 50, 75, 100] as const,
      replenishmentFrequencies: ['daily', 'weekly', 'monthly'] as const,
      variabilityFactors: ['high', 'medium', 'low'] as const,
      demandProfiles: ['high', 'medium', 'low'] as const
    }
  },
  intermediate: { 
    label: 'Intermediate Point', 
    color: '#a855f7',
    description: 'Process decoupling requirements',
    configOptions: {
      bufferSize: [20, 40, 60, 80] as const,
      leadTime: [1, 2, 3, 5] as const,
      moqValues: [5, 10, 20, 50] as const
    }
  },
};

export const DecouplingNetworkBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();

  const onConnect = (params: any) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    
    const newEdge = {
      ...params,
      animated: true,
      style: { 
        stroke: '#9333ea',
        strokeWidth: 2,
      },
    };

    setEdges((eds) => addEdge(newEdge, eds));
    
    toast({
      title: "Connection Created",
      description: "Nodes connected successfully",
    });
  };

  const handleNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'default',
      position,
      data: { 
        label: 'New Node',
        decouplingType: null
      },
      style: { 
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    };

    setNodes((nds) => nds.concat(newNode));

    toast({
      title: "Node Created",
      description: "New node has been added to the network",
    });
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    
    toast({
      title: "Node Deleted",
      description: "The node and its connections have been removed",
    });
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

  const handleUpdatePoint = (config: Partial<NodeData>) => {
    if (!selectedNode) return;
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...config,
            },
          };
        }
        return node;
      }),
    );
  };

  const nodeTypes = {
    default: (nodeProps) => (
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="relative flex flex-col items-center">
            <Handle
              type="target"
              position={Position.Left}
              className="w-4 h-4 !bg-purple-500 border-2 border-white"
              style={{ left: '-12px' }}
            />
            <div className={nodeProps.className}>
              {nodeProps.data.label}
            </div>
            <Handle
              type="source"
              position={Position.Right}
              className="w-4 h-4 !bg-purple-500 border-2 border-white"
              style={{ right: '-12px' }}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem 
            onClick={() => handleDeleteNode(nodeProps.id)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Node
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
  };

  const DraggableNodes = () => (
    <div className="flex gap-2 p-4 border-t">
      <div
        className="flex items-center gap-2 p-2 border rounded cursor-move bg-white hover:bg-gray-50"
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData('application/reactflow', 'default');
          event.dataTransfer.effectAllowed = 'move';
        }}
      >
        <Plus className="w-4 h-4" />
        Drag to add node
      </div>
    </div>
  );

  const NetworkControls = () => (
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
      
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setIsFullScreen(!isFullScreen)}
      >
        <Maximize2 className="w-4 h-4" />
        {isFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
      </Button>
    </div>
  );

  const renderConfigOptions = () => {
    if (!selectedNode || !selectedNode.data.decouplingType) return null;
    
    const type = selectedNode.data.decouplingType;
    const options = decouplingTypes[type].configOptions;

    return Object.entries(options).map(([key, values]) => {
      if (Array.isArray(values)) {
        return (
          <div key={key} className="grid gap-2">
            <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
            <Select
              value={selectedNode.data[key]?.toString()}
              onValueChange={(value) => handleUpdatePoint({ 
                [key]: key.includes('Factor') || key === 'frequency' ? value : Number(value)
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${key}...`} />
              </SelectTrigger>
              <SelectContent>
                {values.map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {typeof value === 'number' ? 
                      (key.includes('serviceLevel') ? `${(value * 100).toFixed(1)}%` : `${value} units`) 
                      : value.charAt(0).toUpperCase() + value.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="space-y-4">
      <div className={`border rounded-lg bg-white ${isFullScreen ? 'fixed inset-0 z-50' : 'h-[600px]'}`}>
        <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b">
          <NetworkControls />
        </div>
        <div className="pt-[73px] h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#9333ea', strokeWidth: 2 },
              animated: true,
            }}
            connectionMode="default"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        <DraggableNodes />
      </div>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Configure {selectedNode?.data.label}</DialogTitle>
            <DialogDescription>
              Set parameters for this decoupling point
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            <div className="grid gap-4 py-4 px-4">
              {renderConfigOptions()}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
