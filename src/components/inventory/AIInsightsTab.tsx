
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadTimePredictions } from "./LeadTimePredictions";
import { SKUClassifications } from "./SKUClassifications";
import { ReplenishmentTimes } from "./ReplenishmentTimes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Brain, Sparkles, Clock, TrendingUp } from "lucide-react";
import { 
  LeadTimeData, 
  LeadTimeAnomaly, 
  SKUClassification, 
  ReplenishmentData 
} from "@/types/inventory/classificationTypes";

// Mock data for demonstration
const mockLeadTimeData: LeadTimeData[] = [
  {
    id: "1",
    sku: "SKU001",
    supplier_id: "SUP-001",
    predicted_lead_time: 7,
    confidence_score: 0.92,
    prediction_date: new Date().toISOString()
  },
  {
    id: "2",
    sku: "SKU002",
    supplier_id: "SUP-002",
    predicted_lead_time: 14,
    confidence_score: 0.85,
    prediction_date: new Date().toISOString()
  }
];

const mockAnomalies: LeadTimeAnomaly[] = [
  {
    id: "1",
    sku: "SKU003",
    anomaly_type: "Sudden lead time increase",
    anomaly_score: 0.78,
    detection_date: new Date().toISOString()
  }
];

const mockClassifications: SKUClassification[] = [
  {
    sku: "SKU001",
    classification: {
      leadTimeCategory: "short",
      variabilityLevel: "low",
      criticality: "medium",
      score: 85
    },
    lastUpdated: new Date().toISOString()
  },
  {
    sku: "SKU002",
    classification: {
      leadTimeCategory: "medium",
      variabilityLevel: "medium",
      criticality: "high",
      score: 92
    },
    lastUpdated: new Date().toISOString()
  }
];

const mockReplenishmentData: ReplenishmentData[] = [
  {
    sku: "SKU001",
    internalTransferTime: 2,
    replenishmentLeadTime: 5,
    totalCycleTime: 7,
    lastUpdated: new Date().toISOString(),
    locationFrom: "Central Warehouse",
    locationTo: "Store A"
  }
];

export const AIInsightsTab = () => {
  const [activeTab, setActiveTab] = useState("predictions");

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI-Powered Supply Chain Insights</h3>
        </div>
        
        <Button size="sm" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Insights
        </Button>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>New Supply Risk Detected</AlertTitle>
        <AlertDescription>
          Lead time anomaly detected for SKU003. Review the Anomalies tab for details.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Lead Times
          </TabsTrigger>
          <TabsTrigger value="classification">
            SKU Classes
          </TabsTrigger>
          <TabsTrigger value="replenishment">
            Replenish
          </TabsTrigger>
          <TabsTrigger value="anomalies">
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Time Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadTimePredictions data={mockLeadTimeData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classification" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SKU Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <SKUClassifications classifications={mockClassifications} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replenishment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Replenishment Times</CardTitle>
            </CardHeader>
            <CardContent>
              <ReplenishmentTimes data={mockReplenishmentData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnomalies.map((anomaly) => (
                  <Card key={anomaly.id} className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">{anomaly.sku}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {anomaly.anomaly_type} - Score: {anomaly.anomaly_score}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Detected: {new Date(anomaly.detection_date).toLocaleString()}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="secondary">View Details</Button>
                            <Button size="sm" variant="outline">Dismiss</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {mockAnomalies.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No anomalies detected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">MAPE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.45%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">MAE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2 days</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
