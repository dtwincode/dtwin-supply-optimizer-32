
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DisaggregationRulesDialog } from "./DisaggregationRulesDialog";
import { Separator } from "@/components/ui/separator";

interface DistributionCalendarProps {
  selectedDate: Date;
  selectedSKU: string;
  distributionData: any[];
  onSelectDate: (date: Date) => void;
  disaggregationRules: any[];
  onUpdateRules: (rules: any[]) => void;
}

export const DistributionCalendar = ({
  selectedDate,
  selectedSKU,
  distributionData,
  onSelectDate,
  disaggregationRules,
  onUpdateRules
}: DistributionCalendarProps) => {
  return (
    <Card className="p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Distribution Calendar</h3>
          <DisaggregationRulesDialog 
            rules={disaggregationRules}
            onUpdateRules={onUpdateRules}
          />
        </div>
        <Separator />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onSelectDate(date)}
              className="rounded-md border"
            />
          </div>
          <div className="flex-1 space-y-4">
            <h4 className="font-medium">Distribution for {format(selectedDate, 'MMM dd, yyyy')}</h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Planned: {Math.round(distributionData.find(d => d.sku === selectedSKU)?.optimalQuantity / 30 || 0)} units
              </p>
              <p className="text-sm text-muted-foreground">
                Minimum: {Math.round(distributionData.find(d => d.sku === selectedSKU)?.minQuantity / 30 || 0)} units
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum: {Math.round(distributionData.find(d => d.sku === selectedSKU)?.maxQuantity / 30 || 0)} units
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
