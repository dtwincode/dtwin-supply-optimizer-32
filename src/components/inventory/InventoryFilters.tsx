
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
        // Check if location_master table exists
        const { data, error } = await supabase
          .from('location_master')
          .select('location_id, warehouse');

        if (error && error.code === '42P01') {
          // Table doesn't exist, use mock data
          setLocations([
            { id: 'loc-main-warehouse', name: 'Main Warehouse' },
            { id: 'loc-distribution-center', name: 'Distribution Center' },
            { id: 'loc-retail-store', name: 'Retail Store' }
          ]);
        } else if (data) {
          // Map data to expected format
          const locationData = data.map(loc => ({
            id: loc.location_id,
            name: loc.warehouse || loc.location_id
          }));
          setLocations(locationData);
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
        // Fallback to mock data
        setLocations([
          { id: 'loc-main-warehouse', name: 'Main Warehouse' },
          { id: 'loc-distribution-center', name: 'Distribution Center' },
          { id: 'loc-retail-store', name: 'Retail Store' }
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
          <SelectItem value="all">
            {t("common.inventory.allLocations")}
          </SelectItem>
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
