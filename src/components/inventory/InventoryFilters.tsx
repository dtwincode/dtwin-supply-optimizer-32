
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface InventoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

// Make sure this is a default export
const InventoryFilters = ({
  searchQuery,
  setSearchQuery,
}: InventoryFiltersProps) => {
  // Add debugging info
  console.log("InventoryFilters rendering, searchQuery:", searchQuery);

  return (
    <div className="w-full max-w-7xl mx-auto mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products, SKUs, locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
    </div>
  );
};

export default InventoryFilters;
