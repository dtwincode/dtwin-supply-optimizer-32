
import { ForecastingSearchFilter } from "./filters/ForecastingSearchFilter";
import { LocationFilter } from "./filters/LocationFilter";
import { ChannelFilter } from "./filters/ChannelFilter";
import { ProductFilter } from "./filters/ProductFilter";

interface ForecastFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedWarehouse: string;
  setSelectedWarehouse: (warehouse: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcategory: string) => void;
  selectedSku: string;
  setSelectedSku: (sku: string) => void;
  regions: string[];
  cities: { [key: string]: string[] };
  channelTypes: string[];
  warehouses: string[];
  forecastData: any[];
}

export const ForecastFilters = ({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
  selectedChannel,
  setSelectedChannel,
  selectedWarehouse,
  setSelectedWarehouse,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedSku,
  setSelectedSku,
  regions,
  cities,
  channelTypes,
  warehouses,
  forecastData,
}: ForecastFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      <div className="flex gap-4">
        <ForecastingSearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <LocationFilter
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          regions={regions}
          cities={cities}
        />
      </div>

      <div className="flex gap-4">
        <ChannelFilter
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
          channelTypes={channelTypes}
          warehouses={warehouses}
        />
      </div>

      <div className="flex gap-4">
        <ProductFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedSku={selectedSku}
          setSelectedSku={setSelectedSku}
          forecastData={forecastData}
        />
      </div>
    </div>
  );
};
