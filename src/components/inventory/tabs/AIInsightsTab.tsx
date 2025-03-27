
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/contexts/I18nContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from "lucide-react";
import { LeadTimeData, LeadTimeAnomaly, SKUClassification, ReplenishmentData } from "../types";
import { LeadTimePredictions } from "../LeadTimePredictions";
import { SKUClassifications } from "../classification/SKUClassifications";
import { ReplenishmentTimes } from "../ReplenishmentTimes";
import { Button } from "@/components/ui/button";

export const AIInsightsTab = () => {
  const [activeTab, setActiveTab] = useState("predictions");
  const [leadTimeData, setLeadTimeData] = useState<LeadTimeData[]>([]);
  const [anomalies, setAnomalies] = useState<LeadTimeAnomaly[]>([]);
  const [skuClassifications, setSkuClassifications] = useState<SKUClassification[]>([]);
  const [replenishmentData, setReplenishmentData] = useState<ReplenishmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useI18n();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch lead time predictions
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('lead_time_predictions')
        .select('*')
        .order('prediction_date', { ascending: false })
        .limit(10);

      if (predictionsError) throw predictionsError;

      // Fetch anomalies
      const { data: anomaliesData, error: anomaliesError } = await supabase
        .from('lead_time_anomalies')
        .select('*')
        .order('detection_date', { ascending: false })
        .limit(10);

      if (anomaliesError) throw anomaliesError;

      // Fetch SKU classifications
      const { data: classificationsData, error: classificationsError } = await supabase
        .from('sku_classification_history')
        .select('*')
        .order('changed_at', { ascending: false });

      if (classificationsError) throw classificationsError;

      // Transform classification data with type checking
      const transformedClassifications: SKUClassification[] = classificationsData
        .filter(item => {
          const classification = item.new_classification as any;
          return classification &&
                 typeof classification === 'object' &&
                 'leadTimeCategory' in classification &&
                 'variabilityLevel' in classification &&
                 'criticality' in classification;
        })
        .map(item => {
          const classification = item.new_classification as any;
          return {
            sku: item.sku,
            classification: {
              leadTimeCategory: classification.leadTimeCategory,
              variabilityLevel: classification.variabilityLevel,
              criticality: classification.criticality
            },
            lastUpdated: item.changed_at
          };
        });

      // Sample replenishment data
      const sampleReplenishmentData: ReplenishmentData[] = [
        {
          sku: "SKU001",
          internalTransferTime: 2,
          replenishmentLeadTime: 5,
          totalCycleTime: 7,
          lastUpdated: new Date().toISOString(),
          locationFrom: "Central Warehouse",
          locationTo: "Store A"
        },
        {
          sku: "SKU002",
          internalTransferTime: 3,
          replenishmentLeadTime: 4,
          totalCycleTime: 7,
          lastUpdated: new Date().toISOString(),
          locationFrom: "Regional DC",
          locationTo: "Store B"
        }
      ];

      setLeadTimeData(predictionsData);
      setAnomalies(anomaliesData);
      setSkuClassifications(transformedClassifications);
      setReplenishmentData(sampleReplenishmentData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>AI-Powered Inventory Insights</CardTitle>
          <CardDescription>
            Machine learning predictions and anomaly detection for your supply chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>AI-Powered Inventory Insights</CardTitle>
        <CardDescription>
          Machine learning predictions and anomaly detection for your supply chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="predictions">Lead Times</TabsTrigger>
                <TabsTrigger value="classification">Classes</TabsTrigger>
                <TabsTrigger value="replenishment">Replenish</TabsTrigger>
                <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="predictions" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Lead Time Predictions</h3>
                <LeadTimePredictions data={leadTimeData} />
              </TabsContent>

              <TabsContent value="classification" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">SKU Classification</h3>
                <SKUClassifications classifications={skuClassifications} />
              </TabsContent>

              <TabsContent value="replenishment" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Replenishment Times</h3>
                <ReplenishmentTimes data={replenishmentData} />
              </TabsContent>

              <TabsContent value="anomalies" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Anomaly Detection</h3>
                <div className="grid gap-4">
                  {anomalies.map((anomaly) => (
                    <Card key={anomaly.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        <div>
                          <h4 className="font-medium">{anomaly.sku}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {anomaly.anomaly_type} - Score: {anomaly.anomaly_score}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Detected: {new Date(anomaly.detection_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Model Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium text-sm">MAPE</h4>
                    <p className="text-2xl font-bold mt-2">2.45%</p>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium text-sm">MAE</h4>
                    <p className="text-2xl font-bold mt-2">1.2 days</p>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium text-sm">Accuracy</h4>
                    <p className="text-2xl font-bold mt-2">94.5%</p>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Settings & Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Prediction Horizon</h4>
                    <p className="text-sm text-muted-foreground">
                      Currently set to predict lead times up to 90 days in advance
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Update Frequency</h4>
                    <p className="text-sm text-muted-foreground">
                      Model retrains daily with new data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Anomaly Detection Sensitivity</h4>
                    <p className="text-sm text-muted-foreground">
                      Set to medium - triggers alerts for deviations &gt; 2σ
                    </p>
                  </div>
                  <Button className="mt-4">Update Settings</Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
