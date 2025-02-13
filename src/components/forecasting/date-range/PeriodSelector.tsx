
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimePeriod = "weekly" | "monthly" | "quarterly" | "yearly";

interface PeriodSelectorProps {
  selectedPeriod: TimePeriod;
  periodCount: string;
  onPeriodChange: (period: TimePeriod) => void;
  onPeriodCountChange: (count: string) => void;
}

export const PeriodSelector = ({
  selectedPeriod,
  periodCount,
  onPeriodChange,
  onPeriodCountChange,
}: PeriodSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="quarterly">Quarterly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>

      <Select value={periodCount} onValueChange={onPeriodCountChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select count" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 6, 8, 12, 24, 36].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              Last {num} {selectedPeriod === "weekly"
                ? "weeks"
                : selectedPeriod === "monthly"
                ? "months"
                : selectedPeriod === "quarterly"
                ? "quarters"
                : "years"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
