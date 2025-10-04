import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";
import { useInventory } from "@/hooks/useInventory";
import { cn } from "@/lib/utils";

export function InventoryGlobalFilters() {
  const { filters, setFilters } = useInventoryFilter();
  const { items } = useInventory();
  
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);

  // Extract unique values from inventory data
  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean))).sort();
  const locations = Array.from(new Set(items.map(item => item.location_id).filter(Boolean))).sort();
  const channels = ["B2B", "B2C", "Marketplace", "Wholesale", "Distribution"];

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 border p-4 rounded-lg bg-card shadow-sm">
      {/* Product Category Filter */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Product Category</label>
        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={categoryOpen}
              className="w-[200px] justify-between"
            >
              {filters.productCategory || "Select category..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setFilters({ ...filters, productCategory: null });
                      setCategoryOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !filters.productCategory ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All Categories
                  </CommandItem>
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={() => {
                        setFilters({ ...filters, productCategory: category });
                        setCategoryOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.productCategory === category ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Location Filter */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Location</label>
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={locationOpen}
              className="w-[200px] justify-between"
            >
              {filters.locationId || "Select location..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search location..." />
              <CommandList>
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setFilters({ ...filters, locationId: null });
                      setLocationOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !filters.locationId ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All Locations
                  </CommandItem>
                  {locations.map((location) => (
                    <CommandItem
                      key={location}
                      value={location}
                      onSelect={() => {
                        setFilters({ ...filters, locationId: location });
                        setLocationOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.locationId === location ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {location}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Channel Filter */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Channel</label>
        <Popover open={channelOpen} onOpenChange={setChannelOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={channelOpen}
              className="w-[200px] justify-between"
            >
              {filters.channelId || "Select channel..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search channel..." />
              <CommandList>
                <CommandEmpty>No channel found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setFilters({ ...filters, channelId: null });
                      setChannelOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !filters.channelId ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All Channels
                  </CommandItem>
                  {channels.map((channel) => (
                    <CommandItem
                      key={channel}
                      value={channel}
                      onSelect={() => {
                        setFilters({ ...filters, channelId: channel });
                        setChannelOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.channelId === channel ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {channel}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Decoupling Filter */}
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        <Checkbox
          checked={filters.decouplingOnly}
          onCheckedChange={(value) =>
            setFilters({ ...filters, decouplingOnly: Boolean(value) })
          }
        />
        <label className="text-sm">Show Decoupling Points Only</label>
      </div>
    </div>
  );
}
