
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ForecastingDateRange } from "@/components/forecasting/ForecastingDateRange";
import { ProductHierarchyFilter } from "@/components/forecasting/filters/ProductHierarchyFilter";
import { LocationFilter } from "@/components/forecasting/filters/LocationFilter";
import { Dispatch, SetStateAction, memo } from "react";

interface FiltersSectionProps {
  isTimeExpanded: boolean;
  isProductExpanded: boolean;
  isLocationExpanded: boolean;
  handleSectionToggle: (section: 'time' | 'product' | 'location') => void;
  trainingFromDate: string;
  trainingToDate: string;
  testingFromDate: string;
  testingToDate: string;
  setTrainingFromDate: Dispatch<SetStateAction<string>>;
  setTrainingToDate: Dispatch<SetStateAction<string>>;
  setTestingFromDate: Dispatch<SetStateAction<string>>;
  setTestingToDate: Dispatch<SetStateAction<string>>;
}

export const FiltersSection = memo<FiltersSectionProps>(({ 
  isTimeExpanded, 
  isProductExpanded, 
  isLocationExpanded, 
  handleSectionToggle,
  trainingFromDate,
  trainingToDate,
  testingFromDate,
  testingToDate,
  setTrainingFromDate,
  setTrainingToDate,
  setTestingFromDate,
  setTestingToDate
}) => {
  return (
    <div className="px-6 space-y-6 mt-6">
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
                  fromDate={new Date(trainingFromDate)}
                  toDate={new Date(trainingToDate)}
                  setFromDate={(date) => setTrainingFromDate(date.toISOString())}
                  setToDate={(date) => setTrainingToDate(date.toISOString())}
                />
              </Card>
              <Card className="p-6">
                <h4 className="text-base font-medium mb-4">Testing Period</h4>
                <ForecastingDateRange
                  fromDate={new Date(testingFromDate)}
                  toDate={new Date(testingToDate)}
                  setFromDate={(date) => setTestingFromDate(date.toISOString())}
                  setToDate={(date) => setTestingToDate(date.toISOString())}
                />
              </Card>
            </div>
          </div>
        )}
      </div>

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
          <div className="p-6 space-y-6 border-t bg-primary/5">
            <ProductHierarchyFilter />
          </div>
        )}
      </div>

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
          <div className="p-6 space-y-6 border-t bg-primary/5">
            <LocationFilter />
          </div>
        )}
      </div>
    </div>
  );
});

FiltersSection.displayName = 'FiltersSection';
