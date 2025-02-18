
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LogisticsFilters = () => {
  return (
    <div className="flex gap-2">
      <Select defaultValue="all">
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="documentation">Documentation</SelectItem>
          <SelectItem value="shipping">Shipping</SelectItem>
          <SelectItem value="quality-check">Quality Check</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
