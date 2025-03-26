
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { salesPlansData } from "@/data/salesData";
import { SalesTrendsChart } from "./dashboard/SalesTrendsChart";
import { SalesPerformanceMetrics } from "./dashboard/SalesPerformanceMetrics";
import { WhatIfScenarios } from "./dashboard/WhatIfScenarios";
import { SalesForecastIntegration } from "./dashboard/SalesForecastIntegration";

export const SalesDashboard = () => {
  const [timeFrame, setTimeFrame] = useState<"monthly" | "quarterly" | "yearly">("quarterly");
  const { language } = useLanguage();

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
                <CardTitle>{getTranslation('sales.salesTrends', language) || "Sales Trends"}</CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'مقارنة المبيعات المخططة والفعلية'
                    : 'Compare planned vs actual sales performance'}
                </CardDescription>
              </div>
              <Tabs 
                defaultValue="quarterly" 
                value={timeFrame}
                onValueChange={(value) => setTimeFrame(value as "monthly" | "quarterly" | "yearly")}
                className="w-[400px]"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="monthly">{getTranslation('sales.monthly', language) || "Monthly"}</TabsTrigger>
                  <TabsTrigger value="quarterly">{getTranslation('sales.quarterly', language) || "Quarterly"}</TabsTrigger>
                  <TabsTrigger value="yearly">{getTranslation('sales.yearly', language) || "Yearly"}</TabsTrigger>
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
            <CardTitle>{getTranslation('sales.whatIfScenarios', language) || "What-If Scenarios"}</CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'استكشاف تأثيرات سيناريوهات المبيعات المختلفة'
                : 'Explore the impact of different sales scenarios'}
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
            <CardTitle>{getTranslation('sales.forecastIntegration', language) || "Forecast Integration"}</CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'تكامل بيانات المبيعات مع توقعات الطلب'
                : 'Integration of sales data with demand forecasts'}
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
