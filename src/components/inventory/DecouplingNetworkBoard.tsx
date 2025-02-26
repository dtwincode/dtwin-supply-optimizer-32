
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

const initialNodes = [
  {
    id: 'supplier-1',
    type: 'input',
    data: { label: 'Supplier Factory' },
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
    data: { label: 'Retail Store' },
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
    data: { label: 'Retail Store' },
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

export const DecouplingNetworkBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  return (
    <div className="h-[600px] border rounded-lg bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
