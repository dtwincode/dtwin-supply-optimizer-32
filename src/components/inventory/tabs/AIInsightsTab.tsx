
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, Lightbulb, Refresh, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { SKUClassification, ReplenishmentData } from "@/types/inventory/classificationTypes";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export function AIInsightsTab() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [classificationChanges, setClassificationChanges] = useState<SKUClassification[]>([]);
  const [replenishmentRecommendations, setReplenishmentRecommendations] = useState<ReplenishmentData[]>([]);
  const [insights, setInsights] = useState<{title: string; description: string; type: 'info' | 'warning' | 'success'}[]>([]);

  useEffect(() => {
    // Mock data - in a real app this would be fetched from an API
    setClassificationChanges([
      {
        sku: "SKU001",
        classification: {
          leadTimeCategory: "medium",
          variabilityLevel: "high",
          criticality: "high",
          score: 80
        },
        last_updated: new Date().toISOString()
      },
      {
        sku: "SKU002",
        classification: {
          leadTimeCategory: "short",
          variabilityLevel: "medium",
          criticality: "medium",
          score: 60
        },
        last_updated: new Date().toISOString()
      }
    ]);

    setReplenishmentRecommendations([
      {
        sku: "SKU001",
        quantity: 250,
        replenishmentType: "Purchase Order",
        source: "Supplier A",
        destination: "Warehouse 1",
        status: "Recommended",
        expectedDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        sku: "SKU003",
        quantity: 100,
        replenishmentType: "Transfer",
        source: "Warehouse 2",
        destination: "Warehouse 1",
        status: "Recommended",
        expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);

    setInsights([
      {
        title: "Seasonal Demand Increase Detected",
        description: "Our AI has detected a 22% increase in demand for 5 SKUs related to seasonal products. Consider adjusting buffer levels.",
        type: "info"
      },
      {
        title: "Supply Chain Disruption Risk",
        description: "Potential disruption detected for supplier 'XYZ Corp' affecting 3 critical SKUs. Review alternative suppliers.",
        type: "warning"
      },
      {
        title: "Buffer Optimization Opportunity",
        description: "12 SKUs have consistently high inventory levels. Potential to reduce buffer levels and free up $245,000 in working capital.",
        type: "success"
      }
    ]);
  }, []);

  const refreshInsights = async () => {
    setLoading(true);
    try {
      // In a real app, this would trigger an AI analysis and refresh data
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("AI insights refreshed successfully");
    } catch (error) {
      console.error("Error refreshing insights:", error);
      toast.error("Failed to refresh insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {getTranslation("inventory.aiInsights.title", language)}
        </h2>
        <Button variant="outline" size="sm" onClick={refreshInsights} disabled={loading}>
          <Refresh className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      <Tabs defaultValue="insights">
        <TabsList>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="classifications">Classification Changes</TabsTrigger>
          <TabsTrigger value="recommendations">Replenishment Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4 mt-4">
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center">
                    {insight.type === 'info' && <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />}
                    {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />}
                    {insight.type === 'success' && <TrendingUp className="h-5 w-5 mr-2 text-green-500" />}
                    {insight.title}
                  </CardTitle>
                  <Badge variant={
                    insight.type === 'info' ? 'default' : 
                    insight.type === 'warning' ? 'destructive' : 'success'
                  }>
                    {insight.type === 'info' ? 'Insight' : 
                     insight.type === 'warning' ? 'Warning' : 'Opportunity'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" /> 
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="classifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Classification Updates</CardTitle>
              <CardDescription>AI-suggested changes to SKU classifications based on recent data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classificationChanges.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.sku}</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Lead Time</p>
                            <p className="text-sm capitalize">{item.classification.leadTimeCategory}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Variability</p>
                            <p className="text-sm capitalize">{item.classification.variabilityLevel}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Criticality</p>
                            <p className="text-sm capitalize">{item.classification.criticality}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Score</p>
                            <p className="text-sm">{item.classification.score}/100</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline" className="mb-2">Changed</Badge>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(item.last_updated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Replenishment Recommendations</CardTitle>
              <CardDescription>Optimize your inventory with AI-suggested replenishment actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {replenishmentRecommendations.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.sku}</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Quantity</p>
                            <p className="text-sm">{item.quantity} units</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Type</p>
                            <p className="text-sm">{item.replenishmentType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Source</p>
                            <p className="text-sm">{item.source}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Destination</p>
                            <p className="text-sm">{item.destination}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="secondary" className="mb-2">{item.status}</Badge>
                        <Button size="sm" className="mb-2">Create Order</Button>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Expected: {new Date(item.expectedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
