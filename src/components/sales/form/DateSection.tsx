
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateSectionProps {
  startDate: string;
  endDate: string;
  handleFormChange: (field: string, value: string) => void;
  formErrors: Record<string, string>;
}

export const DateSection: React.FC<DateSectionProps> = ({
  startDate,
  endDate,
  handleFormChange,
  formErrors,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => handleFormChange("startDate", e.target.value)}
          className={formErrors.startDate ? "border-red-500" : ""}
        />
        {formErrors.startDate && (
          <p className="text-sm text-red-500">{formErrors.startDate}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => handleFormChange("endDate", e.target.value)}
          className={formErrors.endDate ? "border-red-500" : ""}
        />
        {formErrors.endDate && (
          <p className="text-sm text-red-500">{formErrors.endDate}</p>
        )}
      </div>
    </div>
  );
};
