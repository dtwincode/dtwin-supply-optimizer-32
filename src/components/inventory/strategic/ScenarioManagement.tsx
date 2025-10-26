import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2, Copy, Lock, Unlock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Scenario {
  id: string;
  scenario_name: string;
  description: string | null;
  variability_weight: number;
  criticality_weight: number;
  holding_cost_weight: number;
  supplier_reliability_weight: number;
  lead_time_weight: number;
  volume_weight: number;
  storage_intensity_weight: number;
  moq_rigidity_weight: number;
  bullwhip_weight: number;
  auto_designate_threshold: number;
  review_threshold: number;
  is_active: boolean;
  is_locked: boolean;
}

export function ScenarioManagement() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    const { data, error } = await supabase
      .from('decoupling_weights_config')
      .select('*')
      .order('scenario_name');
    
    if (error) {
      toast.error('Failed to load scenarios');
      return;
    }
    
    // Type assertion since the columns exist after migration
    setScenarios((data || []) as unknown as Scenario[]);
  };

  const createNewScenario = () => {
    const newScenario: Scenario = {
      id: '',
      scenario_name: '',
      description: '',
      variability_weight: 0.20,
      criticality_weight: 0.20,
      holding_cost_weight: 0.15,
      supplier_reliability_weight: 0.10,
      lead_time_weight: 0.10,
      volume_weight: 0.10,
      storage_intensity_weight: 0.075,
      moq_rigidity_weight: 0.075,
      bullwhip_weight: 0.10,
      auto_designate_threshold: 70,
      review_threshold: 50,
      is_active: false,
      is_locked: false,
    };
    setSelectedScenario(newScenario);
    setIsEditing(true);
  };

  const cloneScenario = (scenario: Scenario) => {
    const cloned = {
      ...scenario,
      id: '',
      scenario_name: `${scenario.scenario_name}_copy`,
      is_active: false,
      is_locked: false,
    };
    setSelectedScenario(cloned);
    setIsEditing(true);
  };

  const saveScenario = async () => {
    if (!selectedScenario) return;

    // Validate weights sum to 1.0
    const totalWeight = 
      selectedScenario.variability_weight +
      selectedScenario.criticality_weight +
      selectedScenario.holding_cost_weight +
      selectedScenario.supplier_reliability_weight +
      selectedScenario.lead_time_weight +
      selectedScenario.volume_weight +
      selectedScenario.storage_intensity_weight +
      selectedScenario.moq_rigidity_weight +
      selectedScenario.bullwhip_weight;

    if (Math.abs(totalWeight - 1.0) > 0.001) {
      toast.error(`Weights must sum to 100% (currently ${(totalWeight * 100).toFixed(1)}%)`);
      return;
    }

    const { id, ...scenarioData } = selectedScenario;

    if (id) {
      // Update existing
      const { error } = await supabase
        .from('decoupling_weights_config')
        .update(scenarioData)
        .eq('id', id);
      
      if (error) {
        toast.error('Failed to update scenario');
        return;
      }
      toast.success('Scenario updated successfully');
    } else {
      // Insert new
      const { error } = await supabase
        .from('decoupling_weights_config')
        .insert([scenarioData]);
      
      if (error) {
        toast.error('Failed to create scenario');
        return;
      }
      toast.success('Scenario created successfully');
    }

    setIsEditing(false);
    setSelectedScenario(null);
    loadScenarios();
  };

  const deleteScenario = async () => {
    if (!scenarioToDelete) return;

    const { error } = await supabase
      .from('decoupling_weights_config')
      .delete()
      .eq('id', scenarioToDelete);
    
    if (error) {
      toast.error('Failed to delete scenario');
      return;
    }

    toast.success('Scenario deleted successfully');
    setDeleteDialogOpen(false);
    setScenarioToDelete(null);
    loadScenarios();
  };

  const toggleActive = async (scenario: Scenario) => {
    if (scenario.is_active) {
      toast.error('Cannot deactivate the active scenario. Activate another scenario first.');
      return;
    }

    // Confirm before switching active scenario
    const confirmed = window.confirm(
      `Switch active scenario to "${scenario.scenario_name}"?\n\n` +
      `This will affect all future decoupling point calculations. ` +
      `Use the Scenario Comparison tool first to preview the impact.`
    );

    if (!confirmed) return;

    // Deactivate all others
    await supabase
      .from('decoupling_weights_config')
      .update({ is_active: false })
      .neq('id', scenario.id);

    // Activate selected
    const { error } = await supabase
      .from('decoupling_weights_config')
      .update({ is_active: true })
      .eq('id', scenario.id);
    
    if (error) {
      toast.error('Failed to update scenario status');
      return;
    }

    toast.success(`Scenario "${scenario.scenario_name}" is now active`);
    loadScenarios();
  };

  const updateWeight = (field: keyof Scenario, value: number) => {
    if (!selectedScenario) return;
    setSelectedScenario({ ...selectedScenario, [field]: value / 100 });
  };

  const totalWeight = selectedScenario ? (
    selectedScenario.variability_weight +
    selectedScenario.criticality_weight +
    selectedScenario.holding_cost_weight +
    selectedScenario.supplier_reliability_weight +
    selectedScenario.lead_time_weight +
    selectedScenario.volume_weight +
    selectedScenario.storage_intensity_weight +
    selectedScenario.moq_rigidity_weight +
    selectedScenario.bullwhip_weight
  ) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Decoupling Score Scenarios</h2>
          <p className="text-muted-foreground mt-1">
            Configure and manage weighted scoring scenarios for decoupling point designation
          </p>
        </div>
        <Button onClick={createNewScenario} disabled={isEditing}>
          <Plus className="h-4 w-4 mr-2" />
          New Scenario
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario List */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Scenarios</CardTitle>
            <CardDescription>Select a scenario to view or edit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-colors ${
                  selectedScenario?.id === scenario.id ? 'border-primary' : ''
                }`}
                onClick={() => {
                  if (!isEditing) {
                    setSelectedScenario(scenario);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{scenario.scenario_name}</h3>
                        {scenario.is_active && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                        {scenario.is_locked && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {scenario.description || 'No description'}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Auto: ≥{scenario.auto_designate_threshold}%</span>
                        <span>Review: ≥{scenario.review_threshold}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!scenario.is_active && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActive(scenario);
                          }}
                          title="Set as active scenario"
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          cloneScenario(scenario);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {!scenario.is_locked && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setScenarioToDelete(scenario.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Scenario Editor */}
        {selectedScenario && (
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing
                  ? selectedScenario.id
                    ? 'Edit Scenario'
                    : 'New Scenario'
                  : 'Scenario Details'}
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Adjust weights (must sum to 100%)' : 'View scenario configuration'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Scenario Name</Label>
                <Input
                  value={selectedScenario.scenario_name}
                  onChange={(e) =>
                    setSelectedScenario({ ...selectedScenario, scenario_name: e.target.value })
                  }
                  disabled={!isEditing || selectedScenario.is_locked}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={selectedScenario.description || ''}
                  onChange={(e) =>
                    setSelectedScenario({ ...selectedScenario, description: e.target.value })
                  }
                  disabled={!isEditing || selectedScenario.is_locked}
                  rows={2}
                />
              </div>

              {/* Weight Sliders */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Factor Weights</Label>
                  <span
                    className={`text-sm font-medium ${
                      Math.abs(totalWeight - 100) < 0.1
                        ? 'text-green-600'
                        : 'text-destructive'
                    }`}
                  >
                    Total: {totalWeight.toFixed(1)}%
                  </span>
                </div>

                {[
                  { key: 'variability_weight', label: 'Demand Variability' },
                  { key: 'criticality_weight', label: 'Business Criticality' },
                  { key: 'holding_cost_weight', label: 'Holding Cost' },
                  { key: 'bullwhip_weight', label: 'Bullwhip Effect' },
                  { key: 'supplier_reliability_weight', label: 'Supplier Reliability' },
                  { key: 'lead_time_weight', label: 'Lead Time' },
                  { key: 'volume_weight', label: 'Volume' },
                  { key: 'storage_intensity_weight', label: 'Storage Intensity' },
                  { key: 'moq_rigidity_weight', label: 'MOQ Rigidity' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">{label}</Label>
                      <span className="text-sm font-medium">
                        {((selectedScenario[key as keyof Scenario] as number) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Slider
                      value={[(selectedScenario[key as keyof Scenario] as number) * 100]}
                      onValueChange={([value]) => updateWeight(key as keyof Scenario, value)}
                      max={100}
                      step={0.5}
                      disabled={!isEditing || selectedScenario.is_locked}
                    />
                  </div>
                ))}
              </div>

              {/* Thresholds */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="font-semibold">Decision Thresholds</Label>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto-Designate (≥)</Label>
                    <span className="text-sm font-medium">
                      {selectedScenario.auto_designate_threshold}%
                    </span>
                  </div>
                  <Slider
                    value={[selectedScenario.auto_designate_threshold]}
                    onValueChange={([value]) =>
                      setSelectedScenario({ ...selectedScenario, auto_designate_threshold: value })
                    }
                    max={100}
                    step={5}
                    disabled={!isEditing || selectedScenario.is_locked}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Review Required (≥)</Label>
                    <span className="text-sm font-medium">
                      {selectedScenario.review_threshold}%
                    </span>
                  </div>
                  <Slider
                    value={[selectedScenario.review_threshold]}
                    onValueChange={([value]) =>
                      setSelectedScenario({ ...selectedScenario, review_threshold: value })
                    }
                    max={100}
                    step={5}
                    disabled={!isEditing || selectedScenario.is_locked}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {!isEditing && !selectedScenario.is_locked && (
                  <Button onClick={() => setIsEditing(true)} className="flex-1">
                    Edit Scenario
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button
                      onClick={saveScenario}
                      className="flex-1"
                      disabled={Math.abs(totalWeight - 100) > 0.1}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedScenario(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scenario? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteScenario}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}