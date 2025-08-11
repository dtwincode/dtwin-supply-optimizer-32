
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter } from "lucide-react";

const productCategories = ["Electronics", "Fashion", "Home & Garden"];
const regions = ["North America", "Europe", "Asia Pacific"];
const statuses = ["draft", "submitted", "approved", "rejected"];

interface SalesPlanFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
}

export const SalesPlanFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  selectedStatuses,
  setSelectedStatuses,
}: SalesPlanFilterProps) => {
  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={status}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={(checked) => {
                        setSelectedStatuses(
                          checked
                            ? [...selectedStatuses, status]
                            : selectedStatuses.filter((s) => s !== status)
                        );
                      }}
                    />
                    <label
                      htmlFor={status}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                    >
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {productCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

