import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInventoryFilter } from "./InventoryFilterContext";
import { supabase } from "@/integrations/supabase/client";

export function FilterChips() {
  const { filters, setFilters } = useInventoryFilter();
  const [productName, setProductName] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    const loadNames = async () => {
      if (filters.productId) {
        const { data, error } = await supabase
          .from('products' as any)
          .select('name')
          .eq('product_id', filters.productId)
          .single();
        if (!error && data && typeof data === 'object' && 'name' in data) {
          setProductName((data as any).name);
        }
      }

      if (filters.locationId) {
        const { data, error } = await supabase
          .from('locations' as any)
          .select('location_name')
          .eq('location_id', filters.locationId)
          .single();
        if (!error && data && typeof data === 'object' && 'location_name' in data) {
          setLocationName((data as any).location_name);
        }
      }
    };

    loadNames();
  }, [filters.productId, filters.locationId]);

  const activeFilters = [
    filters.productId && { key: "productId", label: `Product: ${productName || filters.productId}`, value: filters.productId },
    filters.locationId && { key: "locationId", label: `Location: ${locationName || filters.locationId}`, value: filters.locationId },
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
      bufferStatus: [],
      planningPriority: null,
      supplier: null,
      category: null,
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
