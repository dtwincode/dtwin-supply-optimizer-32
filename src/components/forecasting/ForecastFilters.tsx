
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ForecastingSearchFilter } from "./filters/ForecastingSearchFilter";
import { LocationFilter } from "./filters/LocationFilter";
import { ChannelFilter } from "./filters/ChannelFilter";
import { ProductFilter } from "./filters/ProductFilter";
import { Button } from "@/components/ui/button";

<lov-add-dependency>framer-motion@latest</lov-add-dependency>

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
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to get the number of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedRegion !== "all") count++;
    if (selectedCity !== "all") count++;
    if (selectedChannel !== "all") count++;
    if (selectedWarehouse !== "all") count++;
    if (selectedL1MainProd !== "all") count++;
    if (selectedL2ProdLine !== "all") count++;
    if (selectedL3ProdCategory !== "all") count++;
    if (selectedL4DeviceMake !== "all") count++;
    if (selectedL5ProdSubCategory !== "all") count++;
    if (selectedL6DeviceModel !== "all") count++;
    if (selectedL7DeviceColor !== "all") count++;
    if (selectedL8DeviceStorage !== "all") count++;
    if (searchQuery) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div 
      className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40"
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-primary">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-3 py-1.5 text-sm font-bold bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isExpanded ? "Click to collapse" : "Click to expand"}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-primary" />
          ) : (
            <ChevronDown className="h-5 w-5 text-primary" />
          )}
        </div>
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6 border-t bg-primary/5">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
