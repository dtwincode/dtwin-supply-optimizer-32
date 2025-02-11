
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SavedScenario {
  id: string;
  name: string;
  model: string;
  horizon: string;
  parameters: any;
  forecast_data: any[];
}

interface ScenarioManagementProps {
  scenarioName: string;
  setScenarioName: (name: string) => void;
  currentModel: string;
  currentHorizon: string;
  currentParameters: any;
  forecastData: any[];
  onScenarioLoad: (scenario: SavedScenario) => void;
}

export const ScenarioManagement = ({
  scenarioName,
  setScenarioName,
  currentModel,
  currentHorizon,
  currentParameters,
  forecastData,
  onScenarioLoad
}: ScenarioManagementProps) => {
  const { toast } = useToast();
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<SavedScenario | null>(null);
  const [compareScenario, setCompareScenario] = useState<SavedScenario | null>(null);

  // Fetch saved scenarios
  useEffect(() => {
    const fetchScenarios = async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load scenarios",
          variant: "destructive",
        });
        return;
      }

      setSavedScenarios(data);
    };

    fetchScenarios();
  }, [toast]);

  const handleSaveScenario = async () => {
    if (!scenarioName) {
      toast({
        title: "Error",
        description: "Please enter a scenario name",
        variant: "destructive",
      });
      return;
    }

    const newScenario = {
      name: scenarioName,
      model: currentModel,
      horizon: currentHorizon,
      parameters: currentParameters,
      forecast_data: forecastData
    };

    const { error } = await supabase
      .from('scenarios')
      .insert(newScenario);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save scenario",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Scenario saved successfully",
    });
    
    // Refresh scenarios list
    const { data: updatedScenarios } = await supabase
      .from('scenarios')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (updatedScenarios) {
      setSavedScenarios(updatedScenarios);
    }
    
    setScenarioName("");
  };

  const handleDeleteScenario = async (id: string) => {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete scenario",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Scenario deleted successfully",
    });

    // Update local state
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
    if (selectedScenario?.id === id) setSelectedScenario(null);
    if (compareScenario?.id === id) setCompareScenario(null);
  };

  const handleCompareScenarios = () => {
    if (selectedScenario && compareScenario) {
      // Load both scenarios for comparison
      onScenarioLoad(selectedScenario);
    }
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
      <div className="flex gap-4 mb-4">
        <Select 
          value={selectedScenario?.id} 
          onValueChange={(value) => {
            const scenario = savedScenarios.find(s => s.id === value);
            setSelectedScenario(scenario || null);
            if (scenario) onScenarioLoad(scenario);
          }}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select primary scenario" />
          </SelectTrigger>
          <SelectContent>
            {savedScenarios.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id}>
                {scenario.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={compareScenario?.id}
          onValueChange={(value) => {
            const scenario = savedScenarios.find(s => s.id === value);
            setCompareScenario(scenario || null);
          }}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select scenario to compare" />
          </SelectTrigger>
          <SelectContent>
            {savedScenarios.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id}>
                {scenario.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          onClick={handleCompareScenarios}
          disabled={!selectedScenario || !compareScenario}
        >
          Compare Scenarios
        </Button>
      </div>
      <div className="space-y-2">
        {savedScenarios.map(scenario => (
          <div key={scenario.id} className="flex justify-between items-center p-2 bg-secondary/20 rounded">
            <div>
              <span className="font-medium">{scenario.name}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {scenario.model} - {scenario.horizon}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteScenario(scenario.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
