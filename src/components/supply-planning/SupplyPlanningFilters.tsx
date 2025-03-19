
import { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const SupplyPlanningFilters = () => {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date>();
  const [supplierFilter, setSupplierFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={getTranslation("common.search", language)}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Select value={supplierFilter} onValueChange={setSupplierFilter}>
        <SelectTrigger className="w-[180px]">
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {getTranslation("supplyPlanning.filters.supplier", language)}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">
            {getTranslation("common.all", language)}
          </SelectItem>
          <SelectItem value="supplier1">Supplier 1</SelectItem>
          <SelectItem value="supplier2">Supplier 2</SelectItem>
          <SelectItem value="supplier3">Supplier 3</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {getTranslation("supplyPlanning.filters.status", language)}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">
            {getTranslation("common.all", language)}
          </SelectItem>
          <SelectItem value="planned">
            {getTranslation("supplyPlanning.status.planned", language)}
          </SelectItem>
          <SelectItem value="ordered">
            {getTranslation("supplyPlanning.status.ordered", language)}
          </SelectItem>
          <SelectItem value="confirmed">
            {getTranslation("supplyPlanning.status.confirmed", language)}
          </SelectItem>
          <SelectItem value="shipped">
            {getTranslation("supplyPlanning.status.shipped", language)}
          </SelectItem>
          <SelectItem value="received">
            {getTranslation("supplyPlanning.status.received", language)}
          </SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] pl-3 text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : getTranslation("supplyPlanning.filters.deliveryDate", language)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
