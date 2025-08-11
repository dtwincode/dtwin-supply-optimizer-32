
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ValidationError } from "./types";

interface ValidationErrorDisplayProps {
  errors: ValidationError[];
}

export function ValidationErrorDisplay({ errors }: ValidationErrorDisplayProps) {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p>Found {errors.length} errors:</p>
          <ul className="list-disc pl-4 max-h-32 overflow-y-auto">
            {errors.slice(0, 5).map((error, index) => (
              <li key={index} className="text-sm">
                Row {error.row}: {error.message}
              </li>
            ))}
            {errors.length > 5 && (
              <li className="text-sm">
                ... and {errors.length - 5} more errors
              </li>
            )}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}
