
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
  selectedL1MainProd: string;
  setSelectedL1MainProd: (value: string) => void;
  selectedL2ProdLine: string;
  setSelectedL2ProdLine: (value: string) => void;
  selectedL3ProdCategory: string;
  setSelectedL3ProdCategory: (value: string) => void;
  selectedL4DeviceMake: string;
  setSelectedL4DeviceMake: (value: string) => void;
  selectedL5ProdSubCategory: string;
  setSelectedL5ProdSubCategory: (value: string) => void;
  selectedL6DeviceModel: string;
  setSelectedL6DeviceModel: (value: string) => void;
  selectedL7DeviceColor: string;
  setSelectedL7DeviceColor: (value: string) => void;
  selectedL8DeviceStorage: string;
  setSelectedL8DeviceStorage: (value: string) => void;
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
  selectedL1MainProd,
  setSelectedL1MainProd,
  selectedL2ProdLine,
  setSelectedL2ProdLine,
  selectedL3ProdCategory,
  setSelectedL3ProdCategory,
  selectedL4DeviceMake,
  setSelectedL4DeviceMake,
  selectedL5ProdSubCategory,
  setSelectedL5ProdSubCategory,
  selectedL6DeviceModel,
  setSelectedL6DeviceModel,
  selectedL7DeviceColor,
  setSelectedL7DeviceColor,
  selectedL8DeviceStorage,
  setSelectedL8DeviceStorage,
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
          selectedL1MainProd={selectedL1MainProd}
          setSelectedL1MainProd={setSelectedL1MainProd}
          selectedL2ProdLine={selectedL2ProdLine}
          setSelectedL2ProdLine={setSelectedL2ProdLine}
          selectedL3ProdCategory={selectedL3ProdCategory}
          setSelectedL3ProdCategory={setSelectedL3ProdCategory}
          selectedL4DeviceMake={selectedL4DeviceMake}
          setSelectedL4DeviceMake={setSelectedL4DeviceMake}
          selectedL5ProdSubCategory={selectedL5ProdSubCategory}
          setSelectedL5ProdSubCategory={setSelectedL5ProdSubCategory}
          selectedL6DeviceModel={selectedL6DeviceModel}
          setSelectedL6DeviceModel={setSelectedL6DeviceModel}
          selectedL7DeviceColor={selectedL7DeviceColor}
          setSelectedL7DeviceColor={setSelectedL7DeviceColor}
          selectedL8DeviceStorage={selectedL8DeviceStorage}
          setSelectedL8DeviceStorage={setSelectedL8DeviceStorage}
          forecastData={forecastData}
        />
      </div>
    </div>
  );
};
