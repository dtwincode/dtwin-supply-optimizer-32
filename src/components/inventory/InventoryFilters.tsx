
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/contexts/I18nContext";
import { fetchLocationWithNames } from "@/lib/inventory-planning.service";

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
  const { t } = useI18n();
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const locationData = await fetchLocationWithNames();
        
        setLocations([
          { id: 'all', name: 'All Locations' },
          ...locationData
        ]);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setLocations([
          { id: 'all', name: 'All Locations' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder={t("common.inventory.searchProducts")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-64"
      />
      
      <Select
        value={selectedLocationId}
        onValueChange={setSelectedLocationId}
        disabled={loading}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={loading ? "Loading..." : t("common.inventory.allLocations")} />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InventoryFilters;
