
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface DataAlertProps {
  selectedMapping: any;
}

export const DataAlert: React.FC<DataAlertProps> = ({ selectedMapping }) => {
  if (!selectedMapping) return null;

  return (
    <Alert variant="default" className="bg-background border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-sm text-blue-700">
        Showing data integrated using the <span className="font-medium">{selectedMapping.mapping_name}</span> configuration.
        Columns are based on the mapping settings you defined.
      </AlertDescription>
    </Alert>
  );
};
