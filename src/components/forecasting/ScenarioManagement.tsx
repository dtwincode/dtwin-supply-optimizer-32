
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
import { Json } from "@/integrations/supabase/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { SavedScenario } from "@/types/forecasting";

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
  const [comparisonData, setComparisonData] = useState<any[]>([]);

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

      if (data) {
        setSavedScenarios(data as SavedScenario[]);
      }
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
      parameters: currentParameters as Json,
      forecast_data: forecastData as Json
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
      setSavedScenarios(updatedScenarios as SavedScenario[]);
    }
    
    setScenarioName("");
  };

  const handleDeleteScenario = async (id: number) => {
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

    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
    if (selectedScenario?.id === id) setSelectedScenario(null);
    if (compareScenario?.id === id) setCompareScenario(null);
  };

  const handleCompareScenarios = () => {
    if (selectedScenario && compareScenario) {
      const scenario1Data = selectedScenario.forecast_data as any[];
      const scenario2Data = compareScenario.forecast_data as any[];
      
      // Combine data for comparison
      const combinedData = scenario1Data.map((item, index) => ({
        week: item.week || `Week ${index + 1}`,
        scenario1: item.forecast || item.value,
        scenario2: scenario2Data[index]?.forecast || scenario2Data[index]?.value || 0,
        scenario1Name: selectedScenario.name,
        scenario2Name: compareScenario.name
      }));
      
      setComparisonData(combinedData);
      
      // Load the first scenario for the main view
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
          value={selectedScenario?.id?.toString()} 
          onValueChange={(value) => {
            const scenario = savedScenarios.find(s => s.id === parseInt(value));
            setSelectedScenario(scenario || null);
          }}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select primary scenario" />
          </SelectTrigger>
          <SelectContent>
            {savedScenarios.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id.toString()}>
                {scenario.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={compareScenario?.id?.toString()}
          onValueChange={(value) => {
            const scenario = savedScenarios.find(s => s.id === parseInt(value));
            setCompareScenario(scenario || null);
          }}
        >
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
        <Button 
          variant="outline" 
          onClick={handleCompareScenarios}
          disabled={!selectedScenario || !compareScenario}
        >
          Compare Scenarios
        </Button>
      </div>
      
      {/* Comparison Chart */}
      {comparisonData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold mb-2">Scenario Comparison</h4>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    Math.round(value),
                    name === 'scenario1' ? selectedScenario?.name : compareScenario?.name
                  ]}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span style={{ color: '#000', fontWeight: 'bold' }}>{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="scenario1"
                  name={selectedScenario?.name}
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="scenario2"
                  name={compareScenario?.name}
                  stroke="#0EA5E9"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ stroke: '#0EA5E9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#0EA5E9', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="space-y-2 mt-4">
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
