
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LocationFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  regions: string[];
  cities: { [key: string]: string[] };
}

export const LocationFilter = ({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
  regions,
  cities,
}: LocationFilterProps) => {
  const [locationData, setLocationData] = useState<{
    regions: string[];
    cities: { [key: string]: string[] };
  }>({
    regions: [],
    cities: {},
  });

  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        const { data, error } = await supabase
          .from('location_hierarchy')
          .select('region, city')
          .eq('active', true);

        if (error) throw error;

        if (data) {
          // Process regions
          const uniqueRegions = Array.from(new Set(data.map(item => item.region).filter(Boolean)));
          
          // Process cities by region
          const citiesByRegion = data.reduce((acc, item) => {
            if (item.region && item.city) {
              if (!acc[item.region]) {
                acc[item.region] = new Set();
              }
              acc[item.region].add(item.city);
            }
            return acc;
          }, {} as { [key: string]: Set<string> });

          // Convert Sets to Arrays
          const processedCities = Object.fromEntries(
            Object.entries(citiesByRegion).map(([region, citySet]) => [
              region,
              Array.from(citySet),
            ])
          );

          setLocationData({
            regions: uniqueRegions,
            cities: processedCities,
          });
        }
      } catch (error) {
        console.error('Error fetching location hierarchy:', error);
      }
    };

    fetchLocationHierarchy();
  }, []);

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setSelectedCity("all"); // Reset city when region changes
  };

  return (
    <div className="flex gap-4">
      <Select value={selectedRegion} onValueChange={handleRegionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          {locationData.regions.map(region => (
            <SelectItem key={region} value={region}>{region}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={selectedCity} 
        onValueChange={setSelectedCity}
        disabled={selectedRegion === "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {selectedRegion !== "all" && locationData.cities[selectedRegion]?.map(city => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
