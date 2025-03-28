
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react"; 

interface IntegrationActionsProps {
  data: any[];
  selectedMapping: any;
  isIntegrating: boolean;
  hasIntegrated: boolean;
  onRunIntegration: () => void;
}

export const IntegrationActions: React.FC<IntegrationActionsProps> = ({
  data,
  selectedMapping,
  isIntegrating,
  hasIntegrated,
  onRunIntegration
}) => {
  return (
    <div className="flex justify-between items-center mt-4 p-3 border rounded-md bg-muted/30">
      <div className="text-sm text-muted-foreground">
        {data.length > 0 ? 
          `Displaying ${Math.min(data.length, 100)} integrated records` : 
          selectedMapping ? 
            "No data has been integrated yet. Click 'Run Integration' to process your data." : 
            "Select a configuration before running integration."
        }
      </div>
      <Button 
        variant="default" 
        onClick={onRunIntegration} 
        disabled={isIntegrating || !selectedMapping}
        className={isIntegrating ? "bg-blue-400" : ""}
        size="sm"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isIntegrating ? 'animate-spin' : ''}`} />
        {isIntegrating ? "Integration Running..." : hasIntegrated ? "Refresh Integration" : "Run Integration"}
      </Button>
    </div>
  );
};
