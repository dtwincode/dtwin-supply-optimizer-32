import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInventoryFilter } from "./InventoryFilterContext";

export function FilterChips() {
  const { filters, setFilters } = useInventoryFilter();

  const activeFilters = [
    filters.productId && { key: "productId", label: `Product: ${filters.productId}`, value: filters.productId },
    filters.locationId && { key: "locationId", label: `Location: ${filters.locationId}`, value: filters.locationId },
    filters.channelId && { key: "channelId", label: `Channel: ${filters.channelId}`, value: filters.channelId },
    filters.decouplingOnly && { key: "decouplingOnly", label: "Decoupling Points Only", value: true },
  ].filter(Boolean);

  if (activeFilters.length === 0) return null;

  const removeFilter = (key: string) => {
    setFilters({ ...filters, [key]: key === "decouplingOnly" ? false : null });
  };

  const clearAll = () => {
    setFilters({
      productId: null,
      locationId: null,
      channelId: null,
      decouplingOnly: false,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {activeFilters.map((filter: any) => (
        <Badge key={filter.key} variant="secondary" className="gap-1 pl-2 pr-1">
          {filter.label}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter(filter.key)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 text-xs">
          Clear all
        </Button>
      )}
    </div>
  );
}
