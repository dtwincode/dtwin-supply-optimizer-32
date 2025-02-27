
import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  Position,
  MarkerType,
  NodeTypes,
  NodeProps,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Factory,
  Warehouse,
  Store,
  Truck,
  Package,
  Timer,
  AlertTriangle,
  Info,
  Layers,
  Maximize2,
  MinusCircle,
  PlusCircle,
  Search,
  Sliders,
  ArrowRightLeft,
  Hourglass,
  CheckCircle,
  X,
  MapPin,
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface NetworkNode {
  id: string;
  type: string;
  name: string;
  nodeType: 'supplier' | 'factory' | 'dc' | 'warehouse' | 'store' | 'customer';
  leadTime: number;
  avgDailyUsage?: number;
  onHand?: number;
  capacity?: number;
  decouplingPoint?: boolean;
  decouplingType?: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate' | null;
  coordinates?: { lat: number; lng: number };
  address?: string;
  bufferProfile?: string;
}

interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  transportMode?: 'truck' | 'rail' | 'air' | 'sea';
  transportTime?: number;
  distance?: number;
}

interface NodeData {
  name: string;
  nodeType: 'supplier' | 'factory' | 'dc' | 'warehouse' | 'store' | 'customer';
  leadTime: number;
  avgDailyUsage?: number;
  onHand?: number;
  capacity?: number;
  decouplingPoint?: boolean;
  decouplingType?: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate' | null;
  bufferProfile?: string;
}

const nodeTypes = {
  'supplier': Factory,
  'factory': Factory,
  'dc': Warehouse,
  'warehouse': Warehouse,
  'store': Store,
  'customer': Store
};

// Custom Node Component
const CustomNode = ({ data }: NodeProps<NodeData>) => {
  const NodeIcon = nodeTypes[data.nodeType] || Package;
  
  const getNodeColor = () => {
    if (data.decouplingPoint) {
      switch (data.decouplingType) {
        case 'strategic': return 'border-red-500 bg-red-50';
        case 'customer_order': return 'border-blue-500 bg-blue-50';
        case 'stock_point': return 'border-green-500 bg-green-50';
        case 'intermediate': return 'border-purple-500 bg-purple-50';
        default: return 'border-gray-300 bg-white';
      }
    }
    return 'border-gray-300 bg-white';
  };

  const getDecouplingBadge = () => {
    if (!data.decouplingPoint) return null;
    
    let badgeClass = 'text-xs';
    let badgeText = '';
    
    switch (data.decouplingType) {
      case 'strategic':
        badgeClass += ' bg-red-100 text-red-800';
        badgeText = 'Strategic Point';
        break;
      case 'customer_order':
        badgeClass += ' bg-blue-100 text-blue-800';
        badgeText = 'Customer Order';
        break;
      case 'stock_point':
        badgeClass += ' bg-green-100 text-green-800';
        badgeText = 'Stock Point';
        break;
      case 'intermediate':
        badgeClass += ' bg-purple-100 text-purple-800';
        badgeText = 'Intermediate';
        break;
      default:
        badgeClass += ' bg-gray-100 text-gray-800';
        badgeText = 'Decoupling Point';
    }
    
    return <Badge className={badgeClass}>{badgeText}</Badge>;
  };

  return (
    <div className={`px-4 py-2 rounded-md border-2 shadow-sm ${getNodeColor()}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500"
      />
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <NodeIcon className="h-4 w-4" />
          <div className="font-medium">{data.name}</div>
        </div>
        {data.leadTime && (
          <div className="text-xs flex items-center gap-1 text-gray-500">
            <Timer className="h-3 w-3" />
            LT: {data.leadTime} days
          </div>
        )}
        {getDecouplingBadge()}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
};

// Mock data for network
const initialNodes: NetworkNode[] = [
  { id: '1', type: 'customNode', name: 'Supplier A', nodeType: 'supplier', leadTime: 14 },
  { id: '2', type: 'customNode', name: 'Factory 1', nodeType: 'factory', leadTime: 7, decouplingPoint: true, decouplingType: 'strategic', bufferProfile: 'High Variability' },
  { id: '3', type: 'customNode', name: 'DC Northeast', nodeType: 'dc', leadTime: 3, decouplingPoint: true, decouplingType: 'stock_point', bufferProfile: 'Standard' },
  { id: '4', type: 'customNode', name: 'Warehouse NY', nodeType: 'warehouse', leadTime: 1 },
  { id: '5', type: 'customNode', name: 'Store Manhattan', nodeType: 'store', leadTime: 0, decouplingPoint: true, decouplingType: 'customer_order', bufferProfile: 'Low Variability' },
  { id: '6', type: 'customNode', name: 'Warehouse Boston', nodeType: 'warehouse', leadTime: 1 },
  { id: '7', type: 'customNode', name: 'Store Boston', nodeType: 'store', leadTime: 0 },
  { id: '8', type: 'customNode', name: 'Supplier B', nodeType: 'supplier', leadTime: 21 },
  { id: '9', type: 'customNode', name: 'Factory 2', nodeType: 'factory', leadTime: 10, decouplingPoint: true, decouplingType: 'intermediate', bufferProfile: 'Standard' },
];

const initialEdges: NetworkEdge[] = [
  { id: 'e1-2', source: '1', target: '2', label: '14 days', transportMode: 'truck', transportTime: 14 },
  { id: 'e2-3', source: '2', target: '3', label: '3 days', transportMode: 'truck', transportTime: 3 },
  { id: 'e3-4', source: '3', target: '4', label: '1 day', transportMode: 'truck', transportTime: 1 },
  { id: 'e4-5', source: '4', target: '5', label: '0.5 days', transportMode: 'truck', transportTime: 0.5 },
  { id: 'e3-6', source: '3', target: '6', label: '1 day', transportMode: 'truck', transportTime: 1 },
  { id: 'e6-7', source: '6', target: '7', label: '0.5 days', transportMode: 'truck', transportTime: 0.5 },
  { id: 'e8-9', source: '8', target: '9', label: '21 days', transportMode: 'sea', transportTime: 21 },
  { id: 'e9-3', source: '9', target: '3', label: '5 days', transportMode: 'rail', transportTime: 5 },
];

// Generate flow positions for nodes
const initialNodesWithPosition = initialNodes.map((node, index) => {
  // Create a layout with suppliers on left, then factories, DCs, warehouses, and stores on right
  const levels = {
    'supplier': 0,
    'factory': 1,
    'dc': 2,
    'warehouse': 3,
    'store': 4,
    'customer': 5
  };
  
  const level = levels[node.nodeType];
  
  // Count how many nodes of this type we have to stagger them vertically
  const typeCount = initialNodes.filter(n => n.nodeType === node.nodeType).length;
  const typeIndex = initialNodes.filter((n, i) => n.nodeType === node.nodeType && i < index).length;
  
  return {
    ...node,
    position: {
      x: 150 + (level * 250),
      y: 100 + (typeIndex * 120) - ((typeCount - 1) * 60)
    },
    data: {
      name: node.name,
      nodeType: node.nodeType,
      leadTime: node.leadTime,
      avgDailyUsage: node.avgDailyUsage,
      onHand: node.onHand,
      capacity: node.capacity,
      decouplingPoint: node.decouplingPoint,
      decouplingType: node.decouplingType,
      bufferProfile: node.bufferProfile
    }
  };
});

// Format edges with markers and styling
const formattedEdges = initialEdges.map(edge => ({
  ...edge,
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#2563eb' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#2563eb',
  },
}));

// Example products for filtering
const products = [
  { id: 'prod1', name: 'Product A', sku: 'SKU001' },
  { id: 'prod2', name: 'Product B', sku: 'SKU002' },
  { id: 'prod3', name: 'Product C', sku: 'SKU003' },
];

export function NetworkFlowVisualization() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesWithPosition);
  const [edges, setEdges, onEdgesChange] = useEdgesState(formattedEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isNodeDetailsOpen, setIsNodeDetailsOpen] = useState(false);
  const [isEdgeDetailsOpen, setIsEdgeDetailsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeProduct, setActiveProduct] = useState('all');
  const [activeView, setActiveView] = useState('network');
  const [leadTimeMode, setLeadTimeMode] = useState(false);
  const { toast } = useToast();

  // Register node types
  const nodeTypeMapping: NodeTypes = {
    customNode: CustomNode,
  };

  // Calculate total decoupled lead time for a path
  const calculateDLT = () => {
    // This would implement real DLT calculation algorithm
    // For now, just return a dummy value
    return 28; // days
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsNodeDetailsOpen(true);
  };

  const handleEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsEdgeDetailsOpen(true);
  };

  const toggleLeadTimeMode = () => {
    setLeadTimeMode(!leadTimeMode);
    
    // Update the edge labels to show lead times
    if (!leadTimeMode) {
      setEdges(prevEdges => 
        prevEdges.map(edge => ({
          ...edge,
          label: `${edge.transportTime} days`,
          style: { 
            ...edge.style,
            strokeWidth: 2 + (edge.transportTime || 0) / 5,
          }
        }))
      );
      
      toast({
        title: "Lead Time Visualization Enabled",
        description: "Edge thickness now represents lead time duration.",
      });
    } else {
      // Reset to normal
      setEdges(formattedEdges);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Card className={isFullScreen ? "fixed inset-0 z-50 overflow-hidden" : "w-full h-[600px]"}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Supply Chain Network Visualization</CardTitle>
          <CardDescription>
            Interactive supply chain network with decoupling points and lead times
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={toggleLeadTimeMode}>
            <Hourglass className="mr-2 h-4 w-4" />
            {leadTimeMode ? 'Hide Lead Times' : 'Show Lead Times'}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullScreen}>
            <Maximize2 className="mr-2 h-4 w-4" />
            {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={isFullScreen ? "h-[calc(100%-4rem)]" : "h-[540px]"}>
        <Tabs defaultValue="network" value={activeView} onValueChange={setActiveView} className="mb-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="leadtime">Lead Time Analysis</TabsTrigger>
              <TabsTrigger value="path">Path Analysis</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="productFilter" className="text-sm">Product:</Label>
              <Select
                value={activeProduct}
                onValueChange={setActiveProduct}
              >
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Tabs>
        
        <TabsContent value="network" className="h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            nodeTypes={nodeTypeMapping}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
            <Panel position="top-left" className="bg-white p-2 rounded-md shadow-md border">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium mb-1">Decoupling Point Types:</div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Strategic</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Customer Order</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Stock Point</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Intermediate</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </TabsContent>
        
        <TabsContent value="leadtime" className="h-full">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">Total DLT</h3>
                  <div className="text-3xl font-bold mt-2">{calculateDLT()} days</div>
                </div>
                <Hourglass className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Decoupled Lead Time across strategic network points
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">Critical Path</h3>
                  <div className="text-3xl font-bold mt-2">Supplier B → DC</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Longest lead time path in the network
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">Compression Opportunity</h3>
                  <div className="text-3xl font-bold mt-2">26%</div>
                </div>
                <ArrowRightLeft className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Potential lead time reduction with optimization
              </p>
            </Card>
          </div>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">Lead Time Analysis</h3>
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Path</th>
                    <th className="pb-2">Lead Time</th>
                    <th className="pb-2">Transport</th>
                    <th className="pb-2">Production</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Supplier B → Factory 2 → DC</td>
                    <td className="py-2">26 days</td>
                    <td className="py-2">21 days</td>
                    <td className="py-2">5 days</td>
                    <td className="py-2"><Badge className="bg-red-100 text-red-800">Critical</Badge></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Supplier A → Factory 1 → DC</td>
                    <td className="py-2">17 days</td>
                    <td className="py-2">14 days</td>
                    <td className="py-2">3 days</td>
                    <td className="py-2"><Badge className="bg-yellow-100 text-yellow-800">Medium</Badge></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">DC → Warehouse NY → Store</td>
                    <td className="py-2">1.5 days</td>
                    <td className="py-2">1.5 days</td>
                    <td className="py-2">0 days</td>
                    <td className="py-2"><Badge className="bg-green-100 text-green-800">Optimized</Badge></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">DC → Warehouse Boston → Store</td>
                    <td className="py-2">1.5 days</td>
                    <td className="py-2">1.5 days</td>
                    <td className="py-2">0 days</td>
                    <td className="py-2"><Badge className="bg-green-100 text-green-800">Optimized</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="path" className="h-full">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">Select Path</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-blue-50 rounded border border-blue-200">
                      <input 
                        type="radio" 
                        id="path1" 
                        name="path" 
                        className="mr-2" 
                        defaultChecked 
                      />
                      <label htmlFor="path1" className="flex-1 text-sm">
                        Supplier B → Factory 2 → DC → Warehouse NY → Store
                      </label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <input 
                        type="radio" 
                        id="path2" 
                        name="path" 
                        className="mr-2" 
                      />
                      <label htmlFor="path2" className="flex-1 text-sm">
                        Supplier A → Factory 1 → DC → Warehouse Boston → Store
                      </label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <input 
                        type="radio" 
                        id="path3" 
                        name="path" 
                        className="mr-2" 
                      />
                      <label htmlFor="path3" className="flex-1 text-sm">
                        Supplier A → Factory 1 → DC → Warehouse NY → Store
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">Path Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Overall Path Metrics</h3>
                      <Badge className="bg-red-100 text-red-800">Critical Path</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded border">
                        <div className="text-sm text-gray-500">Total Lead Time</div>
                        <div className="text-xl font-bold">28.5 days</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded border">
                        <div className="text-sm text-gray-500">Decoupling Points</div>
                        <div className="text-xl font-bold">2</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded border">
                        <div className="text-sm text-gray-500">DLT</div>
                        <div className="text-xl font-bold">26 days</div>
                      </div>
                    </div>
                    
                    <div className="border rounded overflow-hidden">
                      <div className="bg-gray-50 p-2 border-b">
                        <h3 className="font-medium">Path Nodes</h3>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col space-y-2">
                          {['Supplier B', 'Factory 2', 'DC Northeast', 'Warehouse NY', 'Store Manhattan'].map((node, index, arr) => (
                            <React.Fragment key={node}>
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  {index === 0 ? (
                                    <Factory className="h-5 w-5 text-blue-600" />
                                  ) : index === arr.length - 1 ? (
                                    <Store className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <Warehouse className="h-5 w-5 text-blue-600" />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <div className="font-medium">{node}</div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    {(index === 1 || index === 2) && (
                                      <div className="flex items-center gap-1">
                                        <Badge className="h-4 px-1">
                                          {index === 1 ? 'Strategic Point' : 'Stock Point'}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {index === 0 && (
                                  <div className="ml-auto">
                                    <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                                      <AlertTriangle className="h-3 w-3" />
                                      21 days
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              {index < arr.length - 1 && (
                                <div className="border-l-2 border-dashed border-gray-300 h-6 ml-5"></div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </CardContent>
      
      {/* Node Details Dialog */}
      <Dialog open={isNodeDetailsOpen} onOpenChange={setIsNodeDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedNode?.data?.name}</DialogTitle>
            <DialogDescription>
              Node details and configuration
            </DialogDescription>
          </DialogHeader>
          
          {selectedNode && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Node Type</Label>
                  <div className="flex items-center mt-1">
                    {selectedNode.data.nodeType === 'supplier' && <Factory className="h-4 w-4 mr-2" />}
                    {selectedNode.data.nodeType === 'factory' && <Factory className="h-4 w-4 mr-2" />}
                    {selectedNode.data.nodeType === 'dc' && <Warehouse className="h-4 w-4 mr-2" />}
                    {selectedNode.data.nodeType === 'warehouse' && <Warehouse className="h-4 w-4 mr-2" />}
                    {selectedNode.data.nodeType === 'store' && <Store className="h-4 w-4 mr-2" />}
                    <span className="capitalize">{selectedNode.data.nodeType}</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm">Lead Time</Label>
                  <div className="flex items-center mt-1">
                    <Timer className="h-4 w-4 mr-2" />
                    <span>{selectedNode.data.leadTime} days</span>
                  </div>
                </div>
              </div>
              
              {selectedNode.data.decouplingPoint && (
                <div className="border rounded-md p-3 bg-blue-50">
                  <div className="font-medium flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Decoupling Point
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Type</Label>
                      <div className="text-sm mt-1">
                        {selectedNode.data.decouplingType === 'strategic' && 'Strategic Point'}
                        {selectedNode.data.decouplingType === 'customer_order' && 'Customer Order Point'}
                        {selectedNode.data.decouplingType === 'stock_point' && 'Stock Point'}
                        {selectedNode.data.decouplingType === 'intermediate' && 'Intermediate Point'}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-500">Buffer Profile</Label>
                      <div className="text-sm mt-1">
                        {selectedNode.data.bufferProfile || 'Not configured'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4 mt-2">
                <h4 className="text-sm font-medium mb-2">Connected Nodes</h4>
                <div className="space-y-2">
                  {edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(edge => {
                      const isSource = edge.source === selectedNode.id;
                      const connectedNodeId = isSource ? edge.target : edge.source;
                      const connectedNode = nodes.find(n => n.id === connectedNodeId);
                      
                      return (
                        <div key={edge.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center">
                            {!isSource && <ArrowRightLeft className="h-4 w-4 text-gray-400 mr-2" />}
                            <span>{connectedNode?.data.name}</span>
                            {isSource && <ArrowRightLeft className="h-4 w-4 text-gray-400 ml-2" />}
                          </div>
                          <Badge variant="outline">{edge.label}</Badge>
                        </div>
                      );
                    })}
                </div>
              </div>
              
              {!selectedNode.data.decouplingPoint && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // In a real app, this would open a dialog to configure the node as a decoupling point
                      toast({
                        title: "Feature Coming Soon",
                        description: "Decoupling point configuration will be available in the next update.",
                      });
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Configure as Decoupling Point
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edge Details Dialog */}
      <Dialog open={isEdgeDetailsOpen} onOpenChange={setIsEdgeDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Connection Details</DialogTitle>
            <DialogDescription>
              {edges.find(e => e.id === selectedEdge?.id)?.label} transport time
            </DialogDescription>
          </DialogHeader>
          
          {selectedEdge && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">
                      {nodes.find(n => n.id === selectedEdge.source)?.data.name}
                    </div>
                    <div className="text-xs text-gray-500">Source</div>
                  </div>
                </div>
                <ArrowRightLeft className="h-5 w-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">
                      {nodes.find(n => n.id === selectedEdge.target)?.data.name}
                    </div>
                    <div className="text-xs text-gray-500">Target</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Transport Mode</Label>
                  <div className="flex items-center mt-1">
                    <Truck className="h-4 w-4 mr-2" />
                    <span className="capitalize">
                      {initialEdges.find(e => e.id === selectedEdge.id)?.transportMode || 'Truck'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm">Transport Time</Label>
                  <div className="flex items-center mt-1">
                    <Timer className="h-4 w-4 mr-2" />
                    <span>
                      {initialEdges.find(e => e.id === selectedEdge.id)?.transportTime || '0'} days
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <h4 className="text-sm font-medium mb-2">Lead Time Impact</h4>
                <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800">
                        This connection is part of the critical path in your supply chain network. 
                        Reducing transport time here would decrease the overall Decoupled Lead Time (DLT).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEdgeDetailsOpen(false)}>Close</Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "Lead time optimization features will be available in the next update.",
                    });
                    setIsEdgeDetailsOpen(false);
                  }}
                >
                  Optimize Lead Time
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
