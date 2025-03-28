
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";

interface NoDataViewProps {
  selectedMapping: any;
  onRunIntegration: () => void;
  onViewConfiguration: () => void;
}

export const NoDataView: React.FC<NoDataViewProps> = ({ 
  selectedMapping, 
  onRunIntegration, 
  onViewConfiguration 
}) => {
  return (
    <Card className="p-6 text-center border-dashed">
      <Database className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
      <h4 className="text-lg font-medium text-muted-foreground mb-2">No Integrated Data Available</h4>
      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
        Data integration needs to be configured and run before any data will appear here.
        Your configuration "{selectedMapping.mapping_name}" is ready but hasn't been run yet.
      </p>
      <div className="flex justify-center gap-2">
        <Button 
          variant="outline" 
          onClick={onViewConfiguration}
        >
          View Configuration
        </Button>
        <Button
          variant="default"
          onClick={onRunIntegration}
        >
          Run Integration
        </Button>
      </div>
    </Card>
  );
};
