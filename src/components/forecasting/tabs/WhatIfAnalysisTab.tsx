
import { useState } from "react";
import { ForecastWhatIfAnalysis } from "../filters/ForecastWhatIfAnalysis";
import { type PriceData } from "@/utils/forecasting";

interface WhatIfAnalysisTabProps {
  filteredData: any[];
  whatIfScenario: number[];
}

export const WhatIfAnalysisTab = ({
  filteredData,
  whatIfScenario
}: WhatIfAnalysisTabProps) => {
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
    <ForecastWhatIfAnalysis
      filteredData={filteredData}
      whatIfParams={whatIfParams}
      setWhatIfParams={setWhatIfParams}
      priceData={priceData}
      setPriceData={setPriceData}
      whatIfScenario={whatIfScenario}
    />
  );
};
