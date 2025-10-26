import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Target, TrendingUp, AlertCircle, Settings } from "lucide-react";
import { BullwhipAnalysisDashboard } from "./BullwhipAnalysisDashboard";
import { DecouplingPointManager } from "./DecouplingPointManager";
import { DecouplingScoreExplainer } from "./DecouplingScoreExplainer";
import { ScenarioManagement } from "./ScenarioManagement";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Scenario {
  id: string;
  scenario_name: string;
  description: string | null;
  is_active: boolean;
}

export function DecouplingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    loadPendingCount();
    loadActiveScenario();
  }, []);

  const loadPendingCount = async () => {
    const { count } = await supabase
      .from('decoupling_points')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'REVIEW_REQUIRED');
    
    setPendingCount(count || 0);
  };

  const loadActiveScenario = async () => {
    const { data } = await supabase
      .from('decoupling_weights_config')
      .select('id, scenario_name, description, is_active')
      .eq('is_active', true)
      .maybeSingle();
    
    if (data) {
      setActiveScenario(data as unknown as Scenario);
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

      {/* Active Scenario Display */}
      {activeScenario && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Current Active Scenario</h3>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-2xl font-bold mt-2">{activeScenario.scenario_name}</p>
                {activeScenario.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeScenario.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  All decoupling calculations use this scenario
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setActiveTab("scenarios")}
                >
                  Change Scenario
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Overview
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
