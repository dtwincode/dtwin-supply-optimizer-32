
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";

export const AIInsightsTab = () => {
  const { t } = useI18n();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>AI-Powered Inventory Insights</CardTitle>
        <CardDescription>
          Machine learning predictions and anomaly detection for your supply chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>AI-powered inventory insights will be available here. The system will provide recommendations for inventory optimization, anomaly detection, and predictive analytics.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="p-4 border border-dashed">
              <CardTitle className="text-lg mb-2">Demand Forecasting</CardTitle>
              <p className="text-sm text-muted-foreground">AI-powered demand forecasting based on historical data and market trends</p>
            </Card>
            
            <Card className="p-4 border border-dashed">
              <CardTitle className="text-lg mb-2">Anomaly Detection</CardTitle>
              <p className="text-sm text-muted-foreground">Identify unusual patterns in inventory movement and consumption</p>
            </Card>
            
            <Card className="p-4 border border-dashed">
              <CardTitle className="text-lg mb-2">Optimization Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">Recommendations for optimal stock levels based on multiple factors</p>
            </Card>
            
            <Card className="p-4 border border-dashed">
              <CardTitle className="text-lg mb-2">Risk Assessment</CardTitle>
              <p className="text-sm text-muted-foreground">Evaluate supply chain risks and provide mitigation strategies</p>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
