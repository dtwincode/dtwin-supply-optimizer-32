
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartLineIcon, InfoIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { InventoryItem } from "@/types/inventory";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ADUVisualizationProps {
  item: InventoryItem;
}

export const ADUVisualization = ({ item }: ADUVisualizationProps) => {
  const { language } = useLanguage();
  const { aduCalculation } = item;

  if (!aduCalculation) return null;

  const aduData = [
    { period: '30 Days', value: aduCalculation.past30Days },
    { period: '60 Days', value: aduCalculation.past60Days },
    { period: '90 Days', value: aduCalculation.past90Days },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartLineIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">ADU Analysis</h3>
          <HoverCard>
            <HoverCardTrigger asChild>
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold">Average Daily Usage (ADU)</h4>
                <p className="text-sm text-muted-foreground">
                  Displays ADU calculations over different time periods to show demand patterns and trends.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="text-sm text-muted-foreground">
          Blended ADU: {aduCalculation.blendedADU.toFixed(2)}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={aduData}>
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Forecasted ADU</p>
          <p className="font-medium">{aduCalculation.forecastedADU.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Current ADU</p>
          <p className="font-medium">{item.adu?.toFixed(2) || 'N/A'}</p>
        </div>
      </div>
    </Card>
  );
};
