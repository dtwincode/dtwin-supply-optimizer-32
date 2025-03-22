
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ValuesSectionProps {
  targetValue: string;
  confidence: string;
  notes: string;
  handleFormChange: (field: string, value: string) => void;
  formErrors: Record<string, string>;
}

export const ValuesSection: React.FC<ValuesSectionProps> = ({
  targetValue,
  confidence,
  notes,
  handleFormChange,
  formErrors,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="targetValue">Target Value ($)</Label>
        <Input
          id="targetValue"
          type="number"
          min="0"
          value={targetValue}
          onChange={(e) => handleFormChange("targetValue", e.target.value)}
          className={formErrors.targetValue ? "border-red-500" : ""}
        />
        {formErrors.targetValue && (
          <p className="text-sm text-red-500">{formErrors.targetValue}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confidence">Confidence (%)</Label>
        <Input
          id="confidence"
          type="number"
          min="0"
          max="100"
          value={confidence}
          onChange={(e) => handleFormChange("confidence", e.target.value)}
          className={formErrors.confidence ? "border-red-500" : ""}
        />
        {formErrors.confidence && (
          <p className="text-sm text-red-500">{formErrors.confidence}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes or comments..."
          value={notes}
          onChange={(e) => handleFormChange("notes", e.target.value)}
        />
      </div>
    </>
  );
};
