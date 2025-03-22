
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";

interface NoConfigurationViewProps {
  onConfigureClick: () => void;
}

export const NoConfigurationView: React.FC<NoConfigurationViewProps> = ({ onConfigureClick }) => {
  return (
    <Card className="p-6 text-center border-dashed">
      <Database className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
      <h4 className="text-lg font-medium text-muted-foreground mb-2">No Active Configuration</h4>
      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
        You need to select or create a mapping configuration before you can integrate and view data.
        This step helps connect your product, location, and sales data together.
      </p>
      <Button 
        variant="outline" 
        onClick={onConfigureClick}
        className="mx-auto"
      >
        Get Started with Integration
      </Button>
    </Card>
  );
};
