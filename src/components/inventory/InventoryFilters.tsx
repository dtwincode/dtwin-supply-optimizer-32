import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

export interface InventoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedLocationId: string;
  setSelectedLocationId: (value: string) => void;
}

const InventoryFilters = ({
  searchQuery,
  setSearchQuery,
  selectedLocationId,
  setSelectedLocationId,
}: InventoryFiltersProps) => {
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data, error } = await supabase
          .from("inventory_data")
          .select("location_id", { distinct: true });

        if (error) {
          console.error("Error fetching locations:", error);
        } else if (data) {
          const uniqueLocations = Array.from(
            new Set(data.map((row) => row.location_id))
          );
          setLocations(uniqueLocations);
        }
      } catch (err) {
        console.error("Unexpected error fetching locations:", err);
      }
    }

    fetchLocations();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto mb-4 space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products, SKUs, locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Filter by Location
        </label>
        <select
          className="w-full border rounded p-2"
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InventoryFilters;
