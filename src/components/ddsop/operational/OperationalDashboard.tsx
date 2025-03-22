
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetricsGrid } from "./components/MetricsGrid";
import { ChartSection } from "./components/ChartSection";

export const OperationalDashboard: React.FC = () => {
  // Define operational metrics with consistent typing for target (always number)
  const metrics = [
    {
      id: "tactical-cycle",
      name: "Tactical Cycle",
      value: 92,
      target: 95,
      status: "warning"
    },
    {
      id: "flow-index",
      name: "Flow Index",
      value: 78,
      target: 85,
      status: "warning"
    },
    {
      id: "demand-signal",
      name: "Demand Signal",
      value: 95,
      unit: "%",
      target: 90,
      status: "success"
    },
    {
      id: "execution-variance",
      name: "Execution Variance",
      value: 5.2,
      unit: "%",
      target: 10,
      status: "success"
    },
    {
      id: "adaptive-response",
      name: "Adaptive Response",
      value: 24,
      unit: "hours",
      target: 48,
      status: "success"
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
