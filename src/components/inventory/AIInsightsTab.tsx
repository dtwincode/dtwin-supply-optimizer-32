
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { AILeadLink } from "./AILeadLink";

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
        <div className="space-y-6">
          <AILeadLink />
        </div>
      </CardContent>
    </Card>
  );
};
