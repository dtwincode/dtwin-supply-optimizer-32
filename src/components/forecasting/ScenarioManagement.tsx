
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface SavedScenario {
  id: number;
  name: string;
  model: string;
  horizon: string;
}

interface ScenarioManagementProps {
  scenarioName: string;
  setScenarioName: (name: string) => void;
  savedScenarios: SavedScenario[];
  selectedScenario: SavedScenario | null;
  setSelectedScenario: (scenario: SavedScenario | null) => void;
}

export const ScenarioManagement = ({
  scenarioName,
  setScenarioName,
  savedScenarios,
  selectedScenario,
  setSelectedScenario
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
      <div className="flex gap-4">
        <Select onValueChange={(value) => setSelectedScenario(savedScenarios.find(s => s.id.toString() === value) || null)}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select scenario to compare" />
          </SelectTrigger>
          <SelectContent>
            {savedScenarios.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id.toString()}>
                {scenario.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          Compare Scenarios
        </Button>
      </div>
    </Card>
  );
};
