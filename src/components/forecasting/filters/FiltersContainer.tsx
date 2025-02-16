import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TimeFilter } from "./TimeFilter";
import { ProductFilter } from "./ProductFilter";
import { LocationFilter } from "./LocationFilter";
import { ForecastDataPoint } from "@/types/forecasting";

interface FiltersContainerProps {
  locationFilters: { [key: string]: string };
  onLocationFilterChange: (field: string, value: string) => void;
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
  trainingFromDate: string;
  trainingToDate: string;
  testingFromDate: string;
  testingToDate: string;
  setTrainingFromDate: (date: string) => void;
  setTrainingToDate: (date: string) => void;
  setTestingFromDate: (date: string) => void;
  setTestingToDate: (date: string) => void;
  forecastData: ForecastDataPoint[];
}

export function FiltersContainer({
  locationFilters,
  onLocationFilterChange,
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
  trainingFromDate,
  trainingToDate,
  testingFromDate,
  testingToDate,
  setTrainingFromDate,
  setTrainingToDate,
  setTestingFromDate,
  setTestingToDate,
  forecastData,
}: FiltersContainerProps) {
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <TimeFilter
        isExpanded={isTimeExpanded}
        onToggle={() => setIsTimeExpanded(!isTimeExpanded)}
        trainingFromDate={trainingFromDate}
        trainingToDate={trainingToDate}
        testingFromDate={testingFromDate}
        testingToDate={testingToDate}
        setTrainingFromDate={setTrainingFromDate}
        setTrainingToDate={setTrainingToDate}
        setTestingFromDate={setTestingFromDate}
        setTestingToDate={setTestingToDate}
      />

      <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
          onClick={() => setIsProductExpanded(!isProductExpanded)}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-primary">Product Hierarchy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isProductExpanded ? "Click to collapse" : "Click to expand"}
            </span>
            {isProductExpanded ? (
              <ChevronUp className="h-5 w-5 text-primary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-primary" />
            )}
          </div>
        </Button>

        {isProductExpanded && (
          <div className="p-6 space-y-6 border-t bg-primary/5">
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
        )}
      </div>

      <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
          onClick={() => setIsLocationExpanded(!isLocationExpanded)}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-primary">Location Hierarchy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isLocationExpanded ? "Click to collapse" : "Click to expand"}
            </span>
            {isLocationExpanded ? (
              <ChevronUp className="h-5 w-5 text-primary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-primary" />
            )}
          </div>
        </Button>

        {isLocationExpanded && (
          <div className="p-6 space-y-6 border-t bg-primary/5">
            <LocationFilter />
          </div>
        )}
      </div>
    </div>
  );
}
