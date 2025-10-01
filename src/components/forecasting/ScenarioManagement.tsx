import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ScenarioManagementProps {
  scenarioName: string;
  setScenarioName: (name: string) => void;
  currentModel: string;
  currentHorizon: string;
  currentParameters: any;
  forecastData: any[];
}

export const ScenarioManagement = ({
  scenarioName,
  setScenarioName,
  currentModel,
  currentHorizon,
  currentParameters,
  forecastData
}: ScenarioManagementProps) => {
  const { toast } = useToast();

  const handleSaveScenario = () => {
    if (!scenarioName) {
      toast({
        title: "Error",
        description: "Please enter a scenario name",
        variant: "destructive",
      });
      return;
    }

    // Save scenario data to local storage
    const scenarios = JSON.parse(localStorage.getItem('saved_scenarios') || '[]');
    scenarios.push({
      id: Date.now().toString(),
      name: scenarioName,
      model: currentModel,
      horizon: currentHorizon,
      parameters: currentParameters,
      forecast_data: forecastData,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('saved_scenarios', JSON.stringify(scenarios));

    toast({
      title: "Success",
      description: "Scenario saved successfully",
    });
    
    setScenarioName("");
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Scenario Management</h3>
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Enter scenario name"
          value={scenarioName}
          onChange={(e) => setScenarioName(e.target.value)}
          className="w-[300px]"
        />
        <Button onClick={handleSaveScenario}>
          <Save className="w-4 h-4 mr-2" />
          Save Scenario
        </Button>
      </div>
    </Card>
  );
};
