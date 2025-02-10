
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
  channelTypes: string[];
  warehouses: string[];
}

export const ChannelFilter = ({
  selectedChannel,
  setSelectedChannel,
  selectedWarehouse,
  setSelectedWarehouse,
  channelTypes,
  warehouses,
}: ChannelFilterProps) => {
  return (
    <div className="flex gap-4">
      <Select value={selectedChannel} onValueChange={setSelectedChannel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Channel Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Channels</SelectItem>
          {channelTypes.map(channel => (
            <SelectItem key={channel} value={channel}>{channel}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Warehouse" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Warehouses</SelectItem>
          {warehouses.map(warehouse => (
            <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
