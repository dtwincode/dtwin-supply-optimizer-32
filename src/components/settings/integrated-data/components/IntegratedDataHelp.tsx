
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

interface IntegratedDataHelpProps {
  visible: boolean;
  onDismiss: () => void;
}

export const IntegratedDataHelp: React.FC<IntegratedDataHelpProps> = ({ visible, onDismiss }) => {
  if (!visible) return null;

  return (
    <Card className="p-4 border-blue-200 bg-blue-50">
      <div className="flex gap-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="font-medium text-blue-800">How to integrate your data</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal pl-4">
            <li>Start by clicking "Configure Integration" to set up a mapping configuration</li>
            <li>Review available data sources (product hierarchy, location hierarchy, and historical sales)</li>
            <li>Define mapping relationships between product and location identifiers</li>
            <li>Select which columns from your historical data to include</li>
            <li>Save your configuration and activate it</li>
            <li>Click "Run Integration" to process your data</li>
          </ol>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-700 hover:text-blue-800 hover:bg-blue-100 p-0 h-auto"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </Card>
  );
};
