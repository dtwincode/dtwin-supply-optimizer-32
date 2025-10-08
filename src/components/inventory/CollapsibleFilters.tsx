import { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InventoryGlobalFilters } from "./InventoryGlobalFilters";
import { FilterChips } from "./FilterChips";
import { useInventoryFilter } from "./InventoryFilterContext";

export function CollapsibleFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const { filters } = useInventoryFilter();

  const activeFilterCount = [
    filters.productId,
    filters.locationId,
    filters.channelId,
    filters.decouplingOnly,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <FilterChips />
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="animate-accordion-down">
          <Card className="mt-3">
            <CardContent className="pt-4">
              <InventoryGlobalFilters />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
