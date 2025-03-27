
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { NetworkFlowVisualization } from "./NetworkFlowVisualization";

export const NetFlowTab = () => {
  const { t } = useI18n();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("common.inventory.netFlowPosition")}</CardTitle>
        <CardDescription>
          Analyze your inventory flow position and components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Net flow position represents your current stock plus on-order quantity minus qualified demand.
            This view helps you visualize how your inventory flows through the supply chain.
          </p>
          
          <div className="mt-6">
            <NetworkFlowVisualization />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
