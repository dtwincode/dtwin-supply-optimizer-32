
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LocationFilter } from "./filters/LocationFilter";
import { ProductFilter } from "./filters/ProductFilter";
import { ChannelFilter } from "./filters/ChannelFilter";
import { ForecastingSearchFilter } from "./filters/ForecastingSearchFilter";
import { useEffect, useState } from "react";
import { ForecastDataPoint } from "@/utils/forecasting/productFilters";

interface ForecastFiltersProps {
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
  forecastData: ForecastDataPoint[];
}

export function ForecastFilters({
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
  forecastData,
}: ForecastFiltersProps) {
  return (
    <div className="h-screen w-80 border-r bg-muted/40">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Filters
          </h2>
          <ForecastingSearchFilter />
        </div>
        <Separator className="opacity-50" />
        <ScrollArea className="h-[calc(100vh-10rem)] px-3">
          <div className="space-y-4 py-2">
            <div className="py-2">
              <h3 className="mb-4 px-4 text-sm font-medium">Location</h3>
              <LocationFilter />
            </div>
            <Separator className="opacity-50" />
            <div className="py-2">
              <h3 className="mb-4 px-4 text-sm font-medium">Product</h3>
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
            <Separator className="opacity-50" />
            <div className="py-2">
              <h3 className="mb-4 px-4 text-sm font-medium">Channel</h3>
              <ChannelFilter />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
