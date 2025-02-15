
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ForecastingDateRange } from "@/components/forecasting/ForecastingDateRange";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TimeFilterProps {
  isExpanded: boolean;
  onToggle: () => void;
  trainingFromDate: string;
  trainingToDate: string;
  testingFromDate: string;
  testingToDate: string;
  setTrainingFromDate: (date: string) => void;
  setTrainingToDate: (date: string) => void;
  setTestingFromDate: (date: string) => void;
  setTestingToDate: (date: string) => void;
}

export function TimeFilter({
  isExpanded,
  onToggle,
  trainingFromDate,
  trainingToDate,
  testingFromDate,
  testingToDate,
  setTrainingFromDate,
  setTrainingToDate,
  setTestingFromDate,
  setTestingToDate,
}: TimeFilterProps) {
  return (
    <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-primary">Time Period Selection</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isExpanded ? "Click to collapse" : "Click to expand"}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-primary" />
          ) : (
            <ChevronDown className="h-5 w-5 text-primary" />
          )}
        </div>
      </Button>

      {isExpanded && (
        <div className="p-6 space-y-6 border-t bg-primary/5">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-base font-medium mb-4">Training Period</h4>
              <ForecastingDateRange
                fromDate={new Date(trainingFromDate)}
                toDate={new Date(trainingToDate)}
                setFromDate={(date) => setTrainingFromDate(date.toISOString())}
                setToDate={(date) => setTrainingToDate(date.toISOString())}
              />
            </Card>
            <Card className="p-6">
              <h4 className="text-base font-medium mb-4">Testing Period</h4>
              <ForecastingDateRange
                fromDate={new Date(testingFromDate)}
                toDate={new Date(testingToDate)}
                setFromDate={(date) => setTestingFromDate(date.toISOString())}
                setToDate={(date) => setTestingToDate(date.toISOString())}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
