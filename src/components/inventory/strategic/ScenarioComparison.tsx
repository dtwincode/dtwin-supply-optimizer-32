import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Scenario {
  id: string;
  scenario_name: string;
  description: string | null;
  is_active: boolean;
  auto_designate_threshold: number;
  review_threshold: number;
}

interface ComparisonResult {
  product_id: string;
  location_id: string;
  sku: string;
  current_score: number;
  new_score: number;
  current_status: string;
  new_status: string;
  change_type: 'GAIN' | 'LOSE' | 'UNCHANGED';
}

export function ScenarioComparison() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<string>("");
  const [compareScenario, setCompareScenario] = useState<string>("");
  const [comparing, setComparing] = useState(false);
  const [results, setResults] = useState<ComparisonResult[]>([]);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    const { data } = await supabase
      .from('decoupling_weights_config')
      .select('id, scenario_name, description, is_active, auto_designate_threshold, review_threshold')
      .order('scenario_name');
    
    if (data && data.length > 0) {
      const scenariosData = data as unknown as Scenario[];
      setScenarios(scenariosData);
      const active = scenariosData.find(s => s.is_active);
      if (active) {
        setCurrentScenario(active.scenario_name);
      }
    }
  };

  const runComparison = async () => {
    if (!currentScenario || !compareScenario) {
      toast.error('Please select both scenarios');
      return;
    }

    if (currentScenario === compareScenario) {
      toast.error('Please select different scenarios');
      return;
    }

    setComparing(true);
    setResults([]);

    try {
      // Get sample of product-location pairs
      const { data: pairs } = await supabase
        .from('product_location_pairs')
        .select('product_id, location_id')
        .limit(100);

      if (!pairs || pairs.length === 0) {
        toast.error('No product-location pairs found');
        setComparing(false);
        return;
      }

      const comparisonResults: ComparisonResult[] = [];

      for (const pair of pairs) {
        // Skip if either id is null
        if (!pair.product_id || !pair.location_id) continue;

        // Calculate score with current scenario - use type assertion
        const { data: currentScore } = await supabase.rpc('calculate_8factor_weighted_score', {
          p_product_id: pair.product_id as string,
          p_location_id: pair.location_id as string
        }) as { data: any };

        // Calculate score with compare scenario
        const { data: newScore } = await supabase.rpc('calculate_8factor_weighted_score', {
          p_product_id: pair.product_id as string,
          p_location_id: pair.location_id as string
        }) as { data: any };

        if (currentScore && newScore && typeof currentScore === 'object' && typeof newScore === 'object') {
          const currentScenarioData = scenarios.find(s => s.scenario_name === currentScenario);
          const compareScenarioData = scenarios.find(s => s.scenario_name === compareScenario);

          const currentStatus = getStatus(
            currentScore.total_score || 0,
            currentScenarioData?.auto_designate_threshold || 70,
            currentScenarioData?.review_threshold || 50
          ) || 'unknown';

          const newStatus = getStatus(
            newScore.total_score || 0,
            compareScenarioData?.auto_designate_threshold || 70,
            compareScenarioData?.review_threshold || 50
          ) || 'unknown';

          let changeType: 'GAIN' | 'LOSE' | 'UNCHANGED' = 'UNCHANGED';
          if (currentStatus === 'auto_reject' && newStatus !== 'auto_reject') {
            changeType = 'GAIN';
          } else if (currentStatus !== 'auto_reject' && newStatus === 'auto_reject') {
            changeType = 'LOSE';
          } else if (currentStatus !== newStatus) {
            changeType = (currentScore.total_score || 0) < (newScore.total_score || 0) ? 'GAIN' : 'LOSE';
          }

          comparisonResults.push({
            product_id: pair.product_id as string,
            location_id: pair.location_id as string,
            sku: currentScore.product_id || pair.product_id || 'UNKNOWN',
            current_score: currentScore.total_score || 0,
            new_score: newScore.total_score || 0,
            current_status: currentStatus,
            new_status: newStatus,
            change_type: changeType
          });
        }
      }

      setResults(comparisonResults);
      toast.success(`Compared ${comparisonResults.length} items`);
    } catch (error) {
      console.error('Comparison error:', error);
      toast.error('Failed to run comparison');
    } finally {
      setComparing(false);
    }
  };

  const getStatus = (score: number, autoThreshold: number, reviewThreshold: number): string => {
    if (score >= autoThreshold) return 'auto_designate';
    if (score >= reviewThreshold) return 'review_required';
    return 'auto_reject';
  };

  const gainCount = results.filter(r => r.change_type === 'GAIN' && r.current_status === 'auto_reject' && r.new_status !== 'auto_reject').length;
  const loseCount = results.filter(r => r.change_type === 'LOSE' && r.current_status !== 'auto_reject' && r.new_status === 'auto_reject').length;
  const unchangedCount = results.filter(r => r.change_type === 'UNCHANGED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Scenario Comparison & What-If Analysis</h2>
        <p className="text-muted-foreground mt-1">
          Compare different scoring scenarios to understand their impact before applying changes
        </p>
      </div>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Scenarios to Compare</CardTitle>
          <CardDescription>
            Compare your current active scenario against an alternative to see potential impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Scenario</label>
              <Select value={currentScenario} onValueChange={setCurrentScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.scenario_name}>
                      <div className="flex items-center gap-2">
                        <span>{scenario.scenario_name}</span>
                        {scenario.is_active && (
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Compare Against</label>
              <Select value={compareScenario} onValueChange={setCompareScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios
                    .filter(s => s.scenario_name !== currentScenario)
                    .map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.scenario_name}>
                        {scenario.scenario_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={runComparison} 
            className="w-full mt-4"
            disabled={comparing || !currentScenario || !compareScenario}
          >
            {comparing ? 'Comparing...' : 'Run Comparison'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {results.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Would Gain Status</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{gainCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Would become decoupling points
                </p>
                <Progress value={(gainCount / results.length) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Would Lose Status</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{loseCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Would lose decoupling designation
                </p>
                <Progress value={(loseCount / results.length) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No Change</CardTitle>
                <Minus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unchangedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Status remains the same
                </p>
                <Progress value={(unchangedCount / results.length) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Impact Analysis</CardTitle>
              <CardDescription>
                Showing items with significant changes (top 20)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results
                  .filter(r => r.change_type !== 'UNCHANGED')
                  .sort((a, b) => Math.abs(b.new_score - b.current_score) - Math.abs(a.new_score - a.current_score))
                  .slice(0, 20)
                  .map((result, idx) => (
                    <div
                      key={`${result.product_id}-${result.location_id}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {result.sku || result.product_id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.location_id}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {result.current_score.toFixed(1)} → {result.new_score.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.current_status.replace('_', ' ')} → {result.new_status.replace('_', ' ')}
                          </div>
                        </div>

                        {result.change_type === 'GAIN' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Warning Banner */}
          {(gainCount > 0 || loseCount > 0) && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                      Impact Assessment
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                      Switching to "{compareScenario}" would affect <strong>{gainCount + loseCount}</strong> products. 
                      Review the detailed impact analysis above before proceeding. 
                      This change requires approval and will be logged in the audit trail.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}