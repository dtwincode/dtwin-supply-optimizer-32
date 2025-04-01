
import React, { useCallback, useState } from 'react';
import { DecouplingNetwork } from '@/types/inventory/decouplingTypes';
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  MarkerType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DecouplingNetworkBoardProps {
  network?: DecouplingNetwork;
}

// Custom node renderer
const CustomNode = ({ data }: { data: any }) => {
  const nodeClass = data.decouplingType ? 
    `border-2 ${getDecouplingTypeColor(data.decouplingType)}` : 
    'border';

  return (
    <div className={`px-4 py-2 rounded-md bg-white shadow-sm ${nodeClass}`}>
      <div className="flex flex-col items-center gap-1">
        <div className="font-medium">{data.label}</div>
        <div className="text-xs text-gray-500">{data.type}</div>
        {data.decouplingType && (
          <Badge className="text-xs" variant="outline">
            {data.decouplingType.replace('_', ' ')}
          </Badge>
        )}
      </div>
    </div>
  );
};

// Helper function to determine node color based on decoupling type
const getDecouplingTypeColor = (type: string): string => {
  switch (type) {
    case 'strategic':
      return 'border-red-500';
    case 'customer_order':
      return 'border-blue-500';
    case 'stock_point':
      return 'border-green-500';
    case 'intermediate':
      return 'border-purple-500';
    default:
      return 'border-gray-300';
  }
};

export const DecouplingNetworkBoard: React.FC<DecouplingNetworkBoardProps> = ({ network }) => {
  const { language } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);
  
  // Create default empty network if none is provided
  const safeNetwork = network || { nodes: [], links: [] };
  
  // Convert network data to ReactFlow nodes and edges
  const initialNodes: Node[] = safeNetwork.nodes.map((node, index) => ({
    id: node.id,
    position: getNodePosition(node.id, index, safeNetwork.nodes.length),
    data: { 
      label: node.label,
      type: node.type,
      decouplingType: node.decouplingType
    },
    type: 'custom',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

  const initialEdges: Edge[] = safeNetwork.links.map((link, index) => ({
    id: `e-${index}`,
    source: link.source,
    target: link.target,
    label: link.label,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    style: { stroke: '#2563eb' },
    animated: true,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Helper function to calculate node positions in a hierarchical layout
  function getNodePosition(id: string, index: number, totalNodes: number): { x: number, y: number } {
    const levelMapping: Record<string, number> = {};
    
    // Identify source nodes (those that are not targets in any link)
    const targetIds = new Set(safeNetwork.links.map(link => link.target));
    const sourceIds = new Set(safeNetwork.nodes.map(node => node.id).filter(id => !targetIds.has(id)));
    
    // Assign levels based on distance from source
    let currentLevel = 0;
    let currentNodes = Array.from(sourceIds);
    
    while (currentNodes.length > 0) {
      const nextNodes: string[] = [];
      
      currentNodes.forEach(nodeId => {
        levelMapping[nodeId] = currentLevel;
        
        // Find nodes connected to this node
        safeNetwork.links
          .filter(link => link.source === nodeId)
          .forEach(link => {
            if (!levelMapping.hasOwnProperty(link.target)) {
              nextNodes.push(link.target);
            }
          });
      });
      
      currentLevel++;
      currentNodes = nextNodes;
    }
    
    // For any nodes not yet assigned (isolated nodes), assign to level 0
    safeNetwork.nodes.forEach(node => {
      if (!levelMapping.hasOwnProperty(node.id)) {
        levelMapping[node.id] = 0;
      }
    });
    
    // Calculate horizontal position based on level
    const level = levelMapping[id] || 0;
    const x = 150 + (level * 250);
    
    // Calculate vertical position within level
    const nodesAtThisLevel = Object.entries(levelMapping).filter(([_, l]) => l === level).length;
    const indexInLevel = Object.entries(levelMapping)
      .filter(([_, l]) => l === level)
      .findIndex(([nodeId, _]) => nodeId === id);
    
    const verticalSpacing = 120;
    const totalHeight = nodesAtThisLevel * verticalSpacing;
    const y = 100 + (indexInLevel * verticalSpacing) - (totalHeight / 2) + (verticalSpacing / 2);
    
    return { x, y };
  }

  // Node types definition for ReactFlow
  const nodeTypes = {
    custom: CustomNode,
  };

  // Toggle help panel
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  // If no network data is available, display an empty state message
  if (!network || (safeNetwork.nodes.length === 0 && safeNetwork.links.length === 0)) {
    return (
      <div className="border rounded-md p-4 bg-white h-[500px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {getTranslation('common.inventory.noNetworkData', language) || 'No network data available'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {getTranslation('common.inventory.emptyNetworkDescription', language) || 
             'No decoupling points have been configured yet. Add decoupling points to visualize your supply chain network.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 bg-white h-[500px]">
      <h3 className="text-lg font-medium mb-4">{getTranslation('common.inventory.networkVisualization', language)}</h3>
      
      <div className="h-[400px] border rounded-md">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <MiniMap 
            nodeStrokeColor={(n) => {
              const type = n.data?.decouplingType;
              if (!type) return '#eee';
              
              switch(type) {
                case 'strategic': return '#ef4444';
                case 'customer_order': return '#3b82f6';
                case 'stock_point': return '#22c55e';
                case 'intermediate': return '#a855f7';
                default: return '#eee';
              }
            }}
            nodeColor={(n) => {
              const type = n.data?.decouplingType;
              if (!type) return '#ffffff';
              
              switch(type) {
                case 'strategic': return '#fee2e2';
                case 'customer_order': return '#dbeafe';
                case 'stock_point': return '#dcfce7';
                case 'intermediate': return '#f3e8ff';
                default: return '#ffffff';
              }
            }}
          />
          <Background gap={12} size={1} />
          
          {/* Information panel */}
          <Panel position="top-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={toggleHelp}
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                  >
                    <Info size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {language === 'ar' ? "معلومات الشبكة" : "Network Information"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Panel>
          
          {showHelp && (
            <Panel position="top-left" className="w-64">
              <Card>
                <CardContent className="p-3 text-xs space-y-2">
                  <div>
                    <p className="font-medium mb-1">{getTranslation('common.inventory.nodes', language)}</p>
                    <p>{getTranslation('common.inventory.nodesDescription', language)}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">{getTranslation('common.inventory.links', language)}</p>
                    <p>{getTranslation('common.inventory.linksDescription', language)}</p>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <AlertCircle size={12} className="mr-1" />
                    <p>{getTranslation('common.inventory.networkHelp', language)}</p>
                  </div>
                </CardContent>
              </Card>
            </Panel>
          )}
        </ReactFlow>
      </div>
      
      <div className="mt-4 grid grid-cols-4 gap-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs">Strategic</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs">Customer Order</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs">Stock Point</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-xs">Intermediate</span>
        </div>
      </div>
    </div>
  );
};
