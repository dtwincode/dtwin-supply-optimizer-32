import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useInventoryFilter } from "@/contexts/InventoryFilterContext";

export function InventoryGlobalFilters() {
  const { filters, setFilters } = useInventoryFilter();

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 border p-4 rounded-lg bg-card shadow-sm">
      {/* Product Category Filter */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Product Category</label>
        <Input
          placeholder="Enter category"
          value={filters.productCategory || ""}
          onChange={(e) => setFilters({ ...filters, productCategory: e.target.value })}
        />
      </div>

      {/* Location Filter */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Location</label>
        <Input
          placeholder="Enter location ID"
          value={filters.locationId || ""}
          onChange={(e) => setFilters({ ...filters, locationId: e.target.value })}
        />
      </div>

      {/* Channel Filter */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Channel</label>
        <Select
          value={filters.channelId || ""}
          onValueChange={(value) => setFilters({ ...filters, channelId: value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="B2B">B2B</SelectItem>
            <SelectItem value="B2C">B2C</SelectItem>
            <SelectItem value="Marketplace">Marketplace</SelectItem>
            <SelectItem value="Wholesale">Wholesale</SelectItem>
            <SelectItem value="Distribution">Distribution</SelectItem>
          </SelectContent>
        </Select>
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
