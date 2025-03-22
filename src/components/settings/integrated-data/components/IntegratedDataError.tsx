
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface IntegratedDataErrorProps {
  error: string | null;
}

export const IntegratedDataError: React.FC<IntegratedDataErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Integration Error</AlertTitle>
      <AlertDescription>
        <p>{error}</p>
        <p className="text-sm mt-2">
          This typically happens when the selected mapping doesn't match your data structure. 
          Try reviewing your configuration or check that you've uploaded the required data files.
        </p>
      </AlertDescription>
    </Alert>
  );
};
