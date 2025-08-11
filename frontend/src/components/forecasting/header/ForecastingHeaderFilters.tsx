
import React from "react";
import { ForecastFilters } from "../ForecastFilters";

interface ForecastingHeaderFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const ForecastingHeaderFilters: React.FC<ForecastingHeaderFiltersProps> = ({
  onFiltersChange
}) => {
  return (
    <ForecastFilters 
      searchQuery=""
      setSearchQuery={() => {}}
      selectedRegion="all"
      setSelectedRegion={() => {}}
      selectedCity="all"
      setSelectedCity={() => {}}
      selectedChannel="all"
      setSelectedChannel={() => {}}
      selectedWarehouse="all"
      setSelectedWarehouse={() => {}}
      selectedL1MainProd="all"
      setSelectedL1MainProd={() => {}}
      selectedL2ProdLine="all"
      setSelectedL2ProdLine={() => {}}
      selectedL3ProdCategory="all"
      setSelectedL3ProdCategory={() => {}}
      selectedL4DeviceMake="all"
      setSelectedL4DeviceMake={() => {}}
      selectedL5ProdSubCategory="all"
      setSelectedL5ProdSubCategory={() => {}}
      selectedL6DeviceModel="all"
      setSelectedL6DeviceModel={() => {}}
      selectedL7DeviceColor="all"
      setSelectedL7DeviceColor={() => {}}
      selectedL8DeviceStorage="all"
      setSelectedL8DeviceStorage={() => {}}
      channelTypes={[]}
      warehouses={[]}
      forecastData={[]}
    />
  );
};
