import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ForecastingDateRange } from "@/components/forecasting/ForecastingDateRange";

interface ForecastDistributionTabProps {
  forecastTableData: any[];
}

export const ForecastDistributionTab = ({ 
  forecastTableData 
}: ForecastDistributionTabProps) => {
  const [trainingFromDate, setTrainingFromDate] = useState<Date>(new Date('2024-01-01'));
  const [trainingToDate, setTrainingToDate] = useState<Date>(new Date('2024-09-30'));
  const [testingFromDate, setTestingFromDate] = useState<Date>(new Date('2024-10-01'));
  const [testingToDate, setTestingToDate] = useState<Date>(new Date('2024-12-31'));
  // Set all sections to collapsed by default
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  const handleSectionToggle = (section: 'time' | 'product' | 'location') => {
    switch (section) {
      case 'time':
        setIsTimeExpanded(!isTimeExpanded);
        break;
      case 'product':
        setIsProductExpanded(!isProductExpanded);
        break;
      case 'location':
        setIsLocationExpanded(!isLocationExpanded);
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Time Period Selection */}
        <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
            onClick={() => handleSectionToggle('time')}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-primary">Time Period Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isTimeExpanded ? "Click to collapse" : "Click to expand"}
              </span>
              {isTimeExpanded ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </div>
          </Button>

          {isTimeExpanded && (
            <div className="p-6 space-y-6 border-t bg-primary/5">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="text-base font-medium mb-4">Training Period</h4>
                  <ForecastingDateRange
                    fromDate={trainingFromDate}
                    toDate={trainingToDate}
                    setFromDate={setTrainingFromDate}
                    setToDate={setTrainingToDate}
                  />
                </Card>
                <Card className="p-6">
                  <h4 className="text-base font-medium mb-4">Testing Period</h4>
                  <ForecastingDateRange
                    fromDate={testingFromDate}
                    toDate={testingToDate}
                    setFromDate={setTestingFromDate}
                    setToDate={setTestingToDate}
                  />
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Product Hierarchy */}
        <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
            onClick={() => handleSectionToggle('product')}
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
            <div className="p-6 border-t bg-primary/5">
              {/* Add Product Hierarchy Filter content here */}
            </div>
          )}
        </div>

        {/* Location Hierarchy */}
        <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
            onClick={() => handleSectionToggle('location')}
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
            <div className="p-6 border-t bg-primary/5">
              {/* Add Location Hierarchy Filter content here */}
            </div>
          )}
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="space-y-6">
        {/* Forecast Distribution Chart */}
        <Card className="p-6">
          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold">Forecast Distribution</h3>
            <p className="text-sm text-muted-foreground">
              Visual representation of forecast distribution and patterns
            </p>
          </div>
          <div className="h-[400px]">
            <ForecastChart data={forecastTableData} confidenceIntervals={[]} />
          </div>
        </Card>

        <Separator />

        {/* Forecast Table */}
        <Card className="p-6">
          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold">Forecast Details</h3>
            <p className="text-sm text-muted-foreground">
              Detailed view of forecasted values and actual data
            </p>
          </div>
          <ForecastTable data={forecastTableData} />
        </Card>
      </div>
    </div>
  );
};
