import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Target, TrendingUp } from "lucide-react";
import { BullwhipAnalysisDashboard } from "./BullwhipAnalysisDashboard";
import { DecouplingPointManager } from "./DecouplingPointManager";
import { DecouplingScoreExplainer } from "./DecouplingScoreExplainer";

export function DecouplingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ptak & Smith</div>
            <p className="text-xs text-muted-foreground mt-1">
              Official DDMRP methodology
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
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
      </Tabs>
    </div>
  );
}
