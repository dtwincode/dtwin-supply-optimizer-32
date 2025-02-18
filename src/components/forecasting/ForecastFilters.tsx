
import { LocationFilter } from "./filters/LocationFilter";
import { ProductFilter } from "./filters/ProductFilter";
import { Dispatch, SetStateAction } from "react";
import { ForecastDataPoint } from "@/types/forecasting";

export interface ForecastFiltersProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedRegion: string;
  setSelectedRegion: Dispatch<SetStateAction<string>>;
  selectedCity: string;
  setSelectedCity: Dispatch<SetStateAction<string>>;
  selectedChannel: string;
  setSelectedChannel: Dispatch<SetStateAction<string>>;
  selectedWarehouse: string;
  setSelectedWarehouse: Dispatch<SetStateAction<string>>;
  selectedL1MainProd: string;
  setSelectedL1MainProd: Dispatch<SetStateAction<string>>;
  selectedL2ProdLine: string;
  setSelectedL2ProdLine: Dispatch<SetStateAction<string>>;
  selectedL3ProdCategory: string;
  setSelectedL3ProdCategory: Dispatch<SetStateAction<string>>;
  selectedL4DeviceMake: string;
  setSelectedL4DeviceMake: Dispatch<SetStateAction<string>>;
  selectedL5ProdSubCategory: string;
  setSelectedL5ProdSubCategory: Dispatch<SetStateAction<string>>;
  selectedL6DeviceModel: string;
  setSelectedL6DeviceModel: Dispatch<SetStateAction<string>>;
  selectedL7DeviceColor: string;
  setSelectedL7DeviceColor: Dispatch<SetStateAction<string>>;
  selectedL8DeviceStorage: string;
  setSelectedL8DeviceStorage: Dispatch<SetStateAction<string>>;
  channelTypes: string[];
  warehouses: string[];
  forecastData: ForecastDataPoint[];
}

export function ForecastFilters(props: ForecastFiltersProps) {
  return (
    <div className="space-y-6">
      <ProductFilter 
        selectedL1MainProd={props.selectedL1MainProd}
        setSelectedL1MainProd={props.setSelectedL1MainProd}
        selectedL2ProdLine={props.selectedL2ProdLine}
        setSelectedL2ProdLine={props.setSelectedL2ProdLine}
        selectedL3ProdCategory={props.selectedL3ProdCategory}
        setSelectedL3ProdCategory={props.setSelectedL3ProdCategory}
        selectedL4DeviceMake={props.selectedL4DeviceMake}
        setSelectedL4DeviceMake={props.setSelectedL4DeviceMake}
        selectedL5ProdSubCategory={props.selectedL5ProdSubCategory}
        setSelectedL5ProdSubCategory={props.setSelectedL5ProdSubCategory}
        selectedL6DeviceModel={props.selectedL6DeviceModel}
        setSelectedL6DeviceModel={props.setSelectedL6DeviceModel}
        selectedL7DeviceColor={props.selectedL7DeviceColor}
        setSelectedL7DeviceColor={props.setSelectedL7DeviceColor}
        selectedL8DeviceStorage={props.selectedL8DeviceStorage}
        setSelectedL8DeviceStorage={props.setSelectedL8DeviceStorage}
        forecastData={props.forecastData}
      />
      <LocationFilter />
    </div>
  );
}
