
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/contexts/I18nContext";
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
  const { t } = useI18n();
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Use the location_master table
        const { data, error } = await supabase
          .from('location_master')
          .select('location_id, warehouse')
          .order('warehouse', { ascending: true });

        if (error) {
          console.error("Error fetching locations:", error);
          setLocations([
            { id: 'all', name: 'All Locations' }
          ]);
        } else if (data && data.length > 0) {
          // Map data to expected format
          const locationData = [
            { id: 'all', name: 'All Locations' },
            ...data.map(loc => ({
              id: loc.location_id,
              name: loc.warehouse || loc.location_id
            }))
          ];
          setLocations(locationData);
        } else {
          // No locations found in database
          setLocations([
            { id: 'all', name: 'All Locations' }
          ]);
        }
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
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t("common.inventory.allLocations")} />
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
