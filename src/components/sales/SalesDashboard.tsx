
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/contexts/I18nContext";
import { salesPlansData } from "@/data/salesData";
import { SalesTrendsChart } from "./dashboard/SalesTrendsChart";
import { SalesPerformanceMetrics } from "./dashboard/SalesPerformanceMetrics";
import { WhatIfScenarios } from "./dashboard/WhatIfScenarios";
import { SalesForecastIntegration } from "./dashboard/SalesForecastIntegration";

export const SalesDashboard = () => {
  const [timeFrame, setTimeFrame] = useState<"monthly" | "quarterly" | "yearly">("quarterly");
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesPerformanceMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('sales.salesTrends')}</CardTitle>
                <CardDescription>
                  {t('sales.comparePlannedVsActual')}
                </CardDescription>
              </div>
              <Tabs 
                defaultValue="quarterly" 
                value={timeFrame}
                onValueChange={(value) => setTimeFrame(value as "monthly" | "quarterly" | "yearly")}
                className="w-[400px]"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="monthly">{t('sales.monthly')}</TabsTrigger>
                  <TabsTrigger value="quarterly">{t('sales.quarterly')}</TabsTrigger>
                  <TabsTrigger value="yearly">{t('sales.yearly')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <SalesTrendsChart timeFrame={timeFrame} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('sales.whatIfScenarios')}</CardTitle>
            <CardDescription>
              {t('sales.exploreSalesScenarios')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WhatIfScenarios />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('sales.forecastIntegration')}</CardTitle>
            <CardDescription>
              {t('sales.integrationWithForecasts')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesForecastIntegration />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
