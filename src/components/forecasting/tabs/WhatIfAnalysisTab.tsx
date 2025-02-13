
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ForecastWhatIfAnalysis } from "../filters/ForecastWhatIfAnalysis";
import { type PriceData } from "@/utils/forecasting";
import { type ForecastDataPoint } from "@/types/forecasting";

interface ForecastContextType {
  filteredData: ForecastDataPoint[];
  whatIfScenario: number[];
}

export const WhatIfAnalysisTab = () => {
  const navigate = useNavigate();
  const { filteredData, whatIfScenario } = useOutletContext<ForecastContextType>();
  
  const [whatIfParams, setWhatIfParams] = useState({
    growthRate: 0,
    seasonality: 0,
    events: [],
  });

  const [priceData, setPriceData] = useState<PriceData>({
    basePrice: 0,
    elasticity: -1,
    historicalPrices: []
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/forecasting")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Forecasting
        </Button>
      </div>

      <ForecastWhatIfAnalysis
        filteredData={filteredData}
        whatIfParams={whatIfParams}
        setWhatIfParams={setWhatIfParams}
        priceData={priceData}
        setPriceData={setPriceData}
        whatIfScenario={whatIfScenario}
      />
    </div>
  );
};
