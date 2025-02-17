
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelFilterProps {
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedWarehouse: string;
  setSelectedWarehouse: (warehouse: string) => void;
}

export const ChannelFilter = ({
  selectedChannel,
  setSelectedChannel,
  selectedWarehouse,
  setSelectedWarehouse,
}: ChannelFilterProps) => {
  return (
    <div className="flex gap-4">
      <Select value={selectedChannel} onValueChange={setSelectedChannel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Channel Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Channels</SelectItem>
          <SelectItem value="retail">Retail</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="wholesale">Wholesale</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Warehouse" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Warehouses</SelectItem>
          <SelectItem value="north">North Warehouse</SelectItem>
          <SelectItem value="south">South Warehouse</SelectItem>
          <SelectItem value="central">Central Warehouse</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
