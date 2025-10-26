import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Search } from "lucide-react";
import { useInventoryFilter } from "./InventoryFilterContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface RightSideFiltersProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

export function RightSideFilters({ searchTerm = '', onSearchChange }: RightSideFiltersProps) {
  const { filters, setFilters } = useInventoryFilter();
  const [isOpen, setIsOpen] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const loadFilterData = async () => {
      const [productsRes, locationsRes] = await Promise.all([
        supabase.from('product_master').select('product_id, sku, name').limit(100),
        supabase.from('location_master').select('location_id, region').limit(100),
      ]);
      
      if (productsRes.data) setProducts(productsRes.data);
      if (locationsRes.data) setLocations(locationsRes.data);
    };
    
    loadFilterData();
  }, []);

  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetAll = () => {
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

  const activeFilterCount = [
    filters.productId,
    filters.locationId,
    filters.channelId,
    filters.decouplingOnly,
    filters.bufferStatus.length > 0,
    filters.planningPriority,
    filters.supplier,
    filters.category,
  ].filter(Boolean).length;

  const toggleBufferStatus = (status: string) => {
    const current = filters.bufferStatus;
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    setFilters({ ...filters, bufferStatus: updated });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="sticky top-20 h-fit">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <CardTitle className="text-base">Filters</CardTitle>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="SKU / Product Name..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Product Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Product</label>
              <Select
                value={filters.productId || "all"}
                onValueChange={(value) => updateFilter('productId', value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map((p) => (
                    <SelectItem key={p.product_id} value={p.product_id}>
                      {p.name || p.sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select
                value={filters.locationId || "all"}
                onValueChange={(value) => updateFilter('locationId', value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l.location_id} value={l.location_id}>
                      {l.location_id} ({l.region})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Channel Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Channel</label>
              <Select
                value={filters.channelId || "all"}
                onValueChange={(value) => updateFilter('channelId', value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="RETAIL">Retail</SelectItem>
                  <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                  <SelectItem value="ECOMMERCE">E-Commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => updateFilter('category', value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ENTREES">Entrees</SelectItem>
                  <SelectItem value="SIDES">Sides</SelectItem>
                  <SelectItem value="BEVERAGES">Beverages</SelectItem>
                  <SelectItem value="DESSERTS">Desserts</SelectItem>
                  <SelectItem value="CONDIMENTS">Condiments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Supplier Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier</label>
              <Select
                value={filters.supplier || "all"}
                onValueChange={(value) => updateFilter('supplier', value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {/* Suppliers would be dynamically loaded */}
                </SelectContent>
              </Select>
            </div>

            {/* Buffer Status Filter (Multi-Select) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buffer Status</label>
              <div className="space-y-2 border rounded-md p-3">
                {["RED", "YELLOW", "GREEN", "BLUE"].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.bufferStatus.includes(status)}
                      onCheckedChange={() => toggleBufferStatus(status)}
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className="text-sm cursor-pointer"
                    >
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Planning Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Planning Priority</label>
              <Select
                value={filters.planningPriority || "all"}
                onValueChange={(value) => updateFilter('planningPriority', value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="A">A - High Priority</SelectItem>
                  <SelectItem value="B">B - Medium Priority</SelectItem>
                  <SelectItem value="C">C - Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Decoupling Only Toggle */}
            <div className="flex items-center justify-between pt-2">
              <label className="text-sm font-medium">Decoupling Points Only</label>
              <Button
                size="sm"
                variant={filters.decouplingOnly ? "default" : "outline"}
                onClick={() => updateFilter('decouplingOnly', !filters.decouplingOnly)}
              >
                {filters.decouplingOnly ? "ON" : "OFF"}
              </Button>
            </div>

            {/* Clear All */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAll}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
