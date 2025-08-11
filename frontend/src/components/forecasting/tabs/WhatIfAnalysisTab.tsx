
import { useState, useEffect } from "react";
import { ForecastWhatIfAnalysis } from "../filters/ForecastWhatIfAnalysis";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { type PriceData } from "@/utils/forecasting";
import { ForecastDataPoint } from "@/types/forecasting";

interface WhatIfAnalysisTabProps {
  filteredData: ForecastDataPoint[];
  whatIfScenario: number[];
}

export const WhatIfAnalysisTab = ({
  filteredData,
  whatIfScenario
}: WhatIfAnalysisTabProps) => {
  const [whatIfParams, setWhatIfParams] = useState({
    growthRate: 0.05,
    seasonality: 0.1,
    events: []
  });
  
  const [priceData, setPriceData] = useState<PriceData>({
    basePrice: 100,
    elasticity: -1.5,
    historicalPrices: []
  });
  
  const [selectedSKU, setSelectedSKU] = useState<string>("");
  const [skuOptions, setSkuOptions] = useState<string[]>([]);
  const [skuFilteredData, setSkuFilteredData] = useState<ForecastDataPoint[]>([]);
  const [forecastPeriod, setForecastPeriod] = useState<string>("weekly");

  // Extract unique SKUs from filteredData
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      const uniqueSkus = Array.from(new Set(filteredData.map(item => item.sku))).filter(Boolean);
      setSkuOptions(uniqueSkus as string[]);

      // Set the first SKU as default if available and not already selected
      if (uniqueSkus.length > 0 && !selectedSKU) {
        setSelectedSKU(uniqueSkus[0] as string);
      }
    } else {
      // Set a default SKU when using dummy data
      setSelectedSKU("SKU001");
    }
  }, [filteredData, selectedSKU]);

  // Filter data by selected SKU
  useEffect(() => {
    if (selectedSKU) {
      const filtered = filteredData.filter(item => item.sku === selectedSKU);
      setSkuFilteredData(filtered);
    } else {
      setSkuFilteredData([]);
    }
  }, [selectedSKU, filteredData]);
  
  const periodOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annually", label: "Annually" },
  ];

  // Convert forecastPeriod to days for internal calculations
  const getForecastPeriodInDays = (): string => {
    switch (forecastPeriod) {
      case "weekly":
        return "7";
      case "monthly":
        return "30";
      case "quarterly":
        return "90";
      case "annually":
        return "365";
      default:
        return "7";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card className="p-6">
          <h4 className="text-base font-medium mb-4">Forecast Timeline</h4>
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      </div>

      {selectedSKU ? (
        <ForecastWhatIfAnalysis 
          filteredData={skuFilteredData} 
          whatIfParams={whatIfParams} 
          setWhatIfParams={setWhatIfParams} 
          priceData={priceData} 
          setPriceData={setPriceData} 
          whatIfScenario={whatIfScenario} 
          selectedSKU={selectedSKU} 
          forecastPeriod={getForecastPeriodInDays()} 
        />
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Please select a SKU to generate what-if scenarios</p>
          </div>
        </Card>
      )}
    </div>
  );
};
