
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeadTimeData {
  id: string;
  sku: string;
  supplier_id: string;
  predicted_lead_time: number;
  confidence_score: number;
  prediction_date: string;
}

interface LeadTimeAnomaly {
  id: string;
  sku: string;
  anomaly_type: string;
  anomaly_score: number;
  detection_date: string;
}

interface Classification {
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high';
}

interface SKUClassification {
  sku: string;
  classification: Classification;
  lastUpdated: string;
}

interface ReplenishmentData {
  sku: string;
  internalTransferTime: number;
  replenishmentLeadTime: number;
  totalCycleTime: number;
  lastUpdated: string;
  locationFrom: string;
  locationTo: string;
}

export function AILeadLink() {
  const [activeTab, setActiveTab] = useState("predictions");
  const [leadTimeData, setLeadTimeData] = useState<LeadTimeData[]>([]);
  const [anomalies, setAnomalies] = useState<LeadTimeAnomaly[]>([]);
  const [skuClassifications, setSkuClassifications] = useState<SKUClassification[]>([]);
  const [replenishmentData, setReplenishmentData] = useState<ReplenishmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const getClassificationBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="predictions">Lead Time Predictions</TabsTrigger>
            <TabsTrigger value="classification">SKU Classification</TabsTrigger>
            <TabsTrigger value="replenishment">Replenishment Times</TabsTrigger>
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="performance">Model Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings &amp; Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="replenishment" className="space-y-4">
            <div className="grid gap-4">
              {replenishmentData.map((item) => (
                <Card key={item.sku} className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{item.sku}</h4>
                      <Badge variant="outline">
                        Total Cycle: {item.totalCycleTime} days
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium">Internal Transfer Time</p>
                        <p className="text-2xl font-bold">{item.internalTransferTime} days</p>
                        <p className="text-sm text-muted-foreground">
                          From: {item.locationFrom}<br />
                          To: {item.locationTo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Replenishment Lead Time</p>
                        <p className="text-2xl font-bold">{item.replenishmentLeadTime} days</p>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="classification" className="space-y-4">
            <div className="grid gap-4">
              {skuClassifications.map((item) => (
                <Card key={item.sku} className="p-4">
                  <div className="flex items-start gap-4">
                    <Tag className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{item.sku}</h4>
                        <p className="text-sm text-muted-foreground">
                          Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <Badge className={getClassificationBadgeColor(item.classification.leadTimeCategory)}>
                          Lead Time: {item.classification.leadTimeCategory}
                        </Badge>
                        <Badge className={getClassificationBadgeColor(item.classification.variabilityLevel)}>
                          Variability: {item.classification.variabilityLevel}
                        </Badge>
                        <Badge className={getClassificationBadgeColor(item.classification.criticality)}>
                          Criticality: {item.classification.criticality}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="prediction_date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="predicted_lead_time"
                    name="Predicted Lead Time"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence_score"
                    name="Confidence Score"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-4">
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
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Model Performance Metrics</h3>
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
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Model Configuration</h3>
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
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
