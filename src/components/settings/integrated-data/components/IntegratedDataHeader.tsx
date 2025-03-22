
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IntegratedDataHeaderProps {
  selectedMapping: any;
  onConfigureClick: () => void;
}

export const IntegratedDataHeader: React.FC<IntegratedDataHeaderProps> = ({ 
  selectedMapping, 
  onConfigureClick 
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Integrated Data Preview</h3>
        <p className="text-sm text-muted-foreground">
          View and manage integrated forecast data
        </p>
      </div>
      <div className="flex items-center gap-4">
        {selectedMapping && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
              <span className="text-xs font-medium">Active Config:</span>
              <span className="font-semibold">{selectedMapping.mapping_name}</span>
            </Badge>
          </div>
        )}
        <Button 
          onClick={onConfigureClick}
          variant={selectedMapping ? "outline" : "default"}
        >
          {selectedMapping ? "Change Configuration" : "Configure Integration"}
        </Button>
      </div>
    </div>
  );
};
