
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, TrendingUp, RefreshCw } from "lucide-react";
import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export const LogisticsFilters = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Select 
        defaultValue="all" 
        value={statusFilter}
        onValueChange={setStatusFilter}
      >
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="in-transit">In Transit</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
        </SelectContent>
      </Select>
      
      <Select 
        defaultValue="all" 
        value={carrierFilter}
        onValueChange={setCarrierFilter}
      >
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="Filter by Carrier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Carriers</SelectItem>
          <SelectItem value="fastlogistics">FastLogistics</SelectItem>
          <SelectItem value="speedshippers">SpeedShippers</SelectItem>
          <SelectItem value="globaltransport">GlobalTransport</SelectItem>
          <SelectItem value="rapidfreight">RapidFreight</SelectItem>
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-white border-gray-200 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {date ? format(date, "PPP") : "Filter by Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Button variant="ghost" size="icon" className="rounded-full" title="Refresh Data">
        <RefreshCw className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="icon" className="rounded-full" title="Analytics View">
        <TrendingUp className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" className="flex items-center gap-2 ml-2 bg-white">
        <Filter className="h-4 w-4" />
        More Filters
      </Button>
    </div>
  );
};
