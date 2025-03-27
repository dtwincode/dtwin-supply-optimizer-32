
import React from "react";
import { DecouplingNetwork } from "@/types/inventory/decouplingTypes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DecouplingNetworkBoardProps {
  network: DecouplingNetwork;
}

export const DecouplingNetworkBoard: React.FC<DecouplingNetworkBoardProps> = ({ network }) => {
  // Early return for empty network
  if (!network.nodes || network.nodes.length === 0) {
    return (
      <div className="p-4 border rounded-md">
        <p className="text-center text-muted-foreground">No decoupling points configured</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md">
      <div className="mb-4">
        <h3 className="text-sm font-medium">Network Overview</h3>
        <p className="text-xs text-muted-foreground">
          {network.nodes.length} nodes and {network.links.length} connections
        </p>
      </div>
      
      <div className="grid gap-3">
        {network.nodes.map((node) => (
          <Card key={node.id} className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{node.label}</div>
                <div className="text-xs text-muted-foreground">ID: {node.id}</div>
              </div>
              <Badge variant={node.type === 'decoupling' ? 'default' : 'outline'}>
                {node.type === 'decoupling' ? (node.decouplingType || 'decoupling') : node.type}
              </Badge>
            </div>
            
            {/* Display connections */}
            {network.links
              .filter(link => link.source === node.id || link.target === node.id)
              .map((link, index) => (
                <div key={`${link.source}-${link.target}-${index}`} className="mt-2 text-xs">
                  {link.source === node.id ? 'Connects to:' : 'Connected from:'} 
                  <span className="font-medium ml-1">
                    {link.source === node.id 
                      ? network.nodes.find(n => n.id === link.target)?.label || link.target
                      : network.nodes.find(n => n.id === link.source)?.label || link.source}
                  </span>
                  {link.label && <span className="text-muted-foreground ml-1">({link.label})</span>}
                </div>
              ))}
          </Card>
        ))}
      </div>
    </div>
  );
};
