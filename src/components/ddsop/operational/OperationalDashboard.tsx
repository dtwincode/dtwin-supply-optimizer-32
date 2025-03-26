
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetricsGrid } from "./components/MetricsGrid";
import { ChartSection } from "./components/ChartSection";

export const OperationalDashboard: React.FC = () => {
  // Define operational metrics with consistent typing and add trend data
  const metrics = [
    {
      id: "tactical-cycle",
      name: "Tactical Cycle",
      value: 92,
      target: 95,
      status: "warning",
      trend: "improving"
    },
    {
      id: "market-response",
      name: "Market Response Time",
      value: 3.5,
      unit: "days",
      target: 5,
      status: "success",
      trend: "stable"
    },
    {
      id: "signal-detection",
      name: "Signal Detection Rate",
      value: 87,
      target: 90,
      status: "warning",
      trend: "stable"
    },
    {
      id: "adjustment-accuracy",
      name: "Adjustment Accuracy",
      value: 83,
      target: 85,
      status: "warning",
      trend: "improving"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <MetricsGrid metrics={metrics} />
        </CardContent>
      </Card>
      
      <ChartSection />
    </div>
  );
};
