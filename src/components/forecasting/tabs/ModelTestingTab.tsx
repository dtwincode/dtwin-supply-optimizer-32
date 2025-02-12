
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TestingChart } from "@/components/forecasting/TestingChart";
import { useState, useEffect } from "react";
import { useTestData } from "@/hooks/useTestData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ModelTestingTabProps {
  historicalData: any[];
  predictedData: any[];
  scenarioId?: string;
}

export const ModelTestingTab = ({
  historicalData,
  predictedData,
  scenarioId
}: ModelTestingTabProps) => {
  const { toast } = useToast();
  const { testData, generateNewTestData } = useTestData();
  const [trainingStartDate, setTrainingStartDate] = useState<Date>();
  const [trainingEndDate, setTrainingEndDate] = useState<Date>();
  const [testingStartDate, setTestingStartDate] = useState<Date>();
  const [testingEndDate, setTestingEndDate] = useState<Date>();

  const handleSaveTestPeriod = async () => {
    if (!trainingStartDate || !trainingEndDate || !testingStartDate || !testingEndDate) {
      toast({
        title: "Error",
        description: "Please select all date ranges",
        variant: "destructive"
      });
      return;
    }

    if (trainingEndDate >= testingStartDate) {
      toast({
        title: "Error",
        description: "Training period must end before testing period starts",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forecast_test_periods')
        .insert({
          scenario_id: scenarioId,
          training_start_date: trainingStartDate.toISOString(),
          training_end_date: trainingEndDate.toISOString(),
          testing_start_date: testingStartDate.toISOString(),
          testing_end_date: testingEndDate.toISOString(),
          accuracy_metrics: {
            mape: 0,
            mae: 0,
            rmse: 0
          }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test period saved successfully",
      });

      // Regenerate test data with new period
      generateNewTestData('moving-avg', {}, '30');
    } catch (error) {
      console.error('Error saving test period:', error);
      toast({
        title: "Error",
        description: "Failed to save test period",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Training Period</h3>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !trainingStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {trainingStartDate ? format(trainingStartDate, "PPP") : <span>Start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={trainingStartDate}
                  onSelect={setTrainingStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !trainingEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {trainingEndDate ? format(trainingEndDate, "PPP") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={trainingEndDate}
                  onSelect={setTrainingEndDate}
                  initialFocus
                  fromDate={trainingStartDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Testing Period</h3>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !testingStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {testingStartDate ? format(testingStartDate, "PPP") : <span>Start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={testingStartDate}
                  onSelect={setTestingStartDate}
                  initialFocus
                  fromDate={trainingEndDate}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !testingEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {testingEndDate ? format(testingEndDate, "PPP") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={testingEndDate}
                  onSelect={setTestingEndDate}
                  initialFocus
                  fromDate={testingStartDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveTestPeriod}>
          Save Test Period
        </Button>
      </div>

      <TestingChart
        historicalData={testData}
        predictedData={predictedData}
      />
    </Card>
  );
};
