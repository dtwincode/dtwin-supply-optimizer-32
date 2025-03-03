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
    growthRate: 0,
    seasonality: 0,
    events: []
  });
  const [priceData, setPriceData] = useState<PriceData>({
    basePrice: 0,
    elasticity: -1,
    historicalPrices: []
  });
  const [selectedSKU, setSelectedSKU] = useState<string>("");
  const [skuOptions, setSkuOptions] = useState<string[]>([]);
  const [skuFilteredData, setSkuFilteredData] = useState<ForecastDataPoint[]>([]);

  // Extract unique SKUs from filteredData
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      const uniqueSkus = Array.from(new Set(filteredData.map(item => item.sku))).filter(Boolean);
      setSkuOptions(uniqueSkus as string[]);

      // Set the first SKU as default if available and not already selected
      if (uniqueSkus.length > 0 && !selectedSKU) {
        setSelectedSKU(uniqueSkus[0] as string);
      }
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
  return <div className="space-y-6">
      

      {selectedSKU ? <ForecastWhatIfAnalysis filteredData={skuFilteredData} whatIfParams={whatIfParams} setWhatIfParams={setWhatIfParams} priceData={priceData} setPriceData={setPriceData} whatIfScenario={whatIfScenario} selectedSKU={selectedSKU} /> : <Card className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Please select a SKU to generate what-if scenarios</p>
          </div>
        </Card>}
    </div>;
};