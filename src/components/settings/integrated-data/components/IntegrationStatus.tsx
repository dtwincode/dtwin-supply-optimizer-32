
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface IntegrationStatusProps {
  isIntegrating: boolean;
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({ isIntegrating }) => {
  if (!isIntegrating) return null;

  return (
    <Alert className="bg-amber-50 border-amber-200">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Integration in Progress</AlertTitle>
      <AlertDescription className="text-amber-700">
        Data integration is running. This process may take several minutes depending on the size of your data.
        You can continue using other parts of the application while waiting.
      </AlertDescription>
    </Alert>
  );
};
