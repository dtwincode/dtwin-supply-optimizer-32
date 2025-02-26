
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
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

const initialNodes = [
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
  strategic: { label: 'Strategic Point', color: '#ef4444' },
  customer_order: { label: 'Customer Order Point', color: '#3b82f6' },
  stock_point: { label: 'Stock Point', color: '#22c55e' },
  intermediate: { label: 'Intermediate Point', color: '#a855f7' },
};

export const DecouplingNetworkBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const { toast } = useToast();

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  const handleNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  const handleDecouplingTypeChange = (type: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode?.id) {
          const color = decouplingTypes[type]?.color;
          return {
            ...node,
            data: {
              ...node.data,
              decouplingType: type,
            },
            style: {
              ...node.style,
              borderColor: color,
              borderWidth: '2px',
            },
          };
        }
        return node;
      })
    );

    toast({
      title: "Decoupling Point Updated",
      description: `${selectedNode?.data?.label} is now a ${decouplingTypes[type]?.label}`,
    });
    
    setSelectedNode(null);
  };

  return (
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

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Decoupling Point</DialogTitle>
            <DialogDescription>
              Select the type of decoupling point for {selectedNode?.data?.label}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Decoupling Point Type</Label>
              <Select
                value={selectedNode?.data?.decouplingType || ''}
                onValueChange={handleDecouplingTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(decouplingTypes).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
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
