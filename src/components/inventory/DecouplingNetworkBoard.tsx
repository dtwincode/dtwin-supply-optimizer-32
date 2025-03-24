
import React from 'react';
import { DecouplingNetwork } from '@/types/inventory/decouplingTypes';
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

interface DecouplingNetworkBoardProps {
  network: DecouplingNetwork;
}

export const DecouplingNetworkBoard: React.FC<DecouplingNetworkBoardProps> = ({ network }) => {
  const { language } = useLanguage();
  
  return (
    <div className="border rounded-md p-4 bg-white h-[500px] overflow-auto">
      <h3 className="text-lg font-medium mb-4">{getTranslation('common.inventory.networkVisualization', language)}</h3>
      
      {/* Simplified network representation for now */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="font-medium mb-2">
            {getTranslation('common.inventory.nodes', language)} ({network.nodes.length})
          </h4>
          <ul className="space-y-2">
            {network.nodes.map(node => (
              <li key={node.id} className="p-2 bg-gray-50 rounded-md flex justify-between">
                <div>
                  <span className="font-medium">{node.label}</span>
                  <span className="ml-2 text-sm text-muted-foreground">({node.type})</span>
                </div>
                {node.decouplingType && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {node.decouplingType.replace('_', ' ')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">
            {getTranslation('common.inventory.links', language)} ({network.links.length})
          </h4>
          <ul className="space-y-2">
            {network.links.map((link, index) => (
              <li key={index} className="p-2 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <span>{link.source}</span>
                  <span className="text-gray-400">→</span>
                  <span>{link.target}</span>
                </div>
                {link.label && (
                  <span className="text-xs text-muted-foreground block mt-1">
                    {getTranslation('common.inventory.type', language)}: {link.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground text-center">
        {language === 'ar' 
          ? "ملاحظة: سيتم تنفيذ التصور المتقدم مع وضع العقد المناسب والاتصالات في تحديث مستقبلي."
          : "Note: Advanced visualization with proper node positioning and connections will be implemented in a future update."}
      </div>
    </div>
  );
};
