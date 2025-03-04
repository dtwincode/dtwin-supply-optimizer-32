
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LeadTimeData, 
  LeadTimeAnomaly, 
  SKUClassification, 
  ReplenishmentData 
} from "@/components/inventory/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { LeadTimePredictions } from "./LeadTimePredictions";
import { SKUClassifications } from "./SKUClassifications";
import { ReplenishmentTimes } from "./ReplenishmentTimes";
import { AILeadLink } from "./AILeadLink";

export const AIInsightsTab = () => {
  const [loading, setLoading] = useState(true);
  const [leadTimeData, setLeadTimeData] = useState<LeadTimeData[]>([]);
  const [leadTimeAnomalies, setLeadTimeAnomalies] = useState<LeadTimeAnomaly[]>([]);
  const [classifications, setClassifications] = useState<SKUClassification[]>([]);
  const [replenishmentData, setReplenishmentData] = useState<ReplenishmentData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be API calls
        // For this demo, we'll use mock data
        
        // Mock lead time predictions
        setLeadTimeData([
          {
            id: "lt-1",
            sku: "SKU001",
            supplier_id: "SUP-001",
            predicted_lead_time: 14,
            confidence_score: 0.92,
            prediction_date: new Date().toISOString()
          },
          {
            id: "lt-2",
            sku: "SKU002",
            supplier_id: "SUP-002",
            predicted_lead_time: 21,
            confidence_score: 0.87,
            prediction_date: new Date().toISOString()
          },
          {
            id: "lt-3",
            sku: "SKU003",
            supplier_id: "SUP-001",
            predicted_lead_time: 7,
            confidence_score: 0.95,
            prediction_date: new Date().toISOString()
          }
        ]);
        
        // Mock anomalies
        setLeadTimeAnomalies([
          {
            id: "la-1",
            sku: "SKU001",
            anomaly_type: "delay_risk",
            anomaly_score: 0.82,
            detection_date: new Date().toISOString()
          },
          {
            id: "la-2",
            sku: "SKU004",
            anomaly_type: "supplier_issue",
            anomaly_score: 0.76,
            detection_date: new Date().toISOString()
          }
        ]);
        
        // Mock classifications
        setClassifications([
          {
            sku: "SKU001",
            classification: {
              leadTimeCategory: "long",
              variabilityLevel: "medium",
              criticality: "high",
              score: 85
            },
            lastUpdated: new Date().toISOString()
          },
          {
            sku: "SKU002",
            classification: {
              leadTimeCategory: "medium",
              variabilityLevel: "low",
              criticality: "medium",
              score: 65
            },
            lastUpdated: new Date().toISOString()
          },
          {
            sku: "SKU003",
            classification: {
              leadTimeCategory: "short",
              variabilityLevel: "high",
              criticality: "low",
              score: 45
            },
            lastUpdated: new Date().toISOString()
          }
        ]);
        
        // Mock replenishment data
        setReplenishmentData([
          {
            sku: "SKU001",
            internalTransferTime: 2,
            replenishmentLeadTime: 5,
            totalCycleTime: 7,
            lastUpdated: new Date().toISOString(),
            locationFrom: "Main Warehouse",
            locationTo: "Store 123"
          },
          {
            sku: "SKU002",
            internalTransferTime: 3,
            replenishmentLeadTime: 4,
            totalCycleTime: 7,
            lastUpdated: new Date().toISOString(),
            locationFrom: "Main Warehouse",
            locationTo: "Store 456"
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching AI insights data:', error);
        toast({
          title: "Error",
          description: "Failed to load AI insights data",
          variant: "destructive",
        });
      } finally {
        // Simulate network delay
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>
          Machine learning predictions and anomaly detection for your supply chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="leadTime" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leadTime">Lead Time Predictions</TabsTrigger>
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="classification">SKU Classification</TabsTrigger>
            <TabsTrigger value="replenishment">Replenishment Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leadTime">
            <div className="space-y-4">
              <AILeadLink />
              <LeadTimePredictions data={leadTimeData} anomalies={leadTimeAnomalies} />
            </div>
          </TabsContent>
          
          <TabsContent value="anomalies">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Supply Chain Anomalies</CardTitle>
                  <CardDescription>
                    AI-detected unusual patterns in your supply chain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leadTimeAnomalies.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No anomalies detected in your supply chain.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leadTimeAnomalies.map(anomaly => (
                        <Card key={anomaly.id} className="bg-red-50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{anomaly.sku}</h4>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {anomaly.anomaly_type.replace('_', ' ')}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-red-600">
                                  Anomaly Score: {(anomaly.anomaly_score * 100).toFixed(0)}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Detected on {new Date(anomaly.detection_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="classification">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI-Based SKU Classification</CardTitle>
                  <CardDescription>
                    Automated classification based on lead time and variability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SKUClassifications classifications={classifications} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="replenishment">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Replenishment Analysis</CardTitle>
                  <CardDescription>
                    AI analysis of your replenishment cycle times
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReplenishmentTimes data={replenishmentData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
