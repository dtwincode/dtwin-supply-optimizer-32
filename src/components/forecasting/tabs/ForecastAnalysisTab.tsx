
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface ForecastContextType {
  filteredData: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

export const ForecastAnalysisTab = () => {
  const navigate = useNavigate();
  const { filteredData, confidenceIntervals } = useOutletContext<ForecastContextType>();

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

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Forecast Analysis</h2>
        <ForecastChart
          data={filteredData}
          confidenceIntervals={confidenceIntervals}
        />
      </Card>
    </div>
  );
};
