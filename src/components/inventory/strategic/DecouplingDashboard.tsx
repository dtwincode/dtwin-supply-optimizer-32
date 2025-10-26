import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Target, TrendingUp, AlertCircle, Settings } from "lucide-react";
import { BullwhipAnalysisDashboard } from "./BullwhipAnalysisDashboard";
import { DecouplingPointManager } from "./DecouplingPointManager";
import { DecouplingScoreExplainer } from "./DecouplingScoreExplainer";
import { ScenarioManagement } from "./ScenarioManagement";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Scenario {
  id: string;
  scenario_name: string;
  description: string | null;
  is_active: boolean;
}

export function DecouplingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>("default");

  useEffect(() => {
    loadPendingCount();
    loadScenarios();
  }, []);

  const loadPendingCount = async () => {
    const { count } = await supabase
      .from('decoupling_points')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'REVIEW_REQUIRED');
    
    setPendingCount(count || 0);
  };

  const loadScenarios = async () => {
    const { data } = await supabase
      .from('decoupling_weights_config')
      .select('id, scenario_name, description, is_active')
      .order('scenario_name');
    
    if (data && data.length > 0) {
      // Type assertion since the columns exist after migration
      const scenariosData = data as unknown as Scenario[];
      setScenarios(scenariosData);
      const active = scenariosData.find(s => s.is_active);
      if (active) {
        setSelectedScenario(active.scenario_name);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Header */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decoupling Strategy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9-Factor Model</div>
            <p className="text-xs text-muted-foreground mt-1">
              DDMRP-compliant with Bullwhip Effect
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary Criterion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bullwhip Effect</div>
            <p className="text-xs text-muted-foreground mt-1">
              Demand amplification ratio (15% weight)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items requiring manual review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label>Active Scoring Scenario</Label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.scenario_name}>
                      <div className="flex items-center gap-2">
                        <span>{scenario.scenario_name}</span>
                        {scenario.is_active && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {scenarios.find(s => s.scenario_name === selectedScenario)?.description && (
                <p className="text-xs text-muted-foreground">
                  {scenarios.find(s => s.scenario_name === selectedScenario)?.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Overview & Management
          </TabsTrigger>
          <TabsTrigger value="bullwhip" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Bullwhip Analysis
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Scoring Model
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage Scenarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <DecouplingPointManager />
        </TabsContent>

        <TabsContent value="bullwhip" className="mt-6">
          <BullwhipAnalysisDashboard />
        </TabsContent>

        <TabsContent value="scoring" className="mt-6">
          <DecouplingScoreExplainer />
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          <ScenarioManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
