import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/contexts/I18nContext";
import {
  DashboardTab,
  TrackingTab,
  AnalyticsTab,
  DDOMTab,
  SustainabilityTab,
} from "./tabs";

export const LogisticsTabs = () => {
  const { t } = useI18n();

  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="w-full justify-start mb-2 bg-transparent border-b rounded-none p-0 h-auto">
        <TabsTrigger
          value="dashboard"
          className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10"
        >
          {t("logistics.dashboard")}
        </TabsTrigger>
        <TabsTrigger
          value="tracking"
          className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10"
        >
          {t("logistics.tracking")}
        </TabsTrigger>
        <TabsTrigger
          value="analytics"
          className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10"
        >
          {t("logistics.analytics")}
        </TabsTrigger>
        <TabsTrigger
          value="ddom"
          className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10"
        >
          {t("logistics.ddom.title")}
        </TabsTrigger>
        <TabsTrigger
          value="sustainability"
          className="rounded-t-lg rounded-b-none data-[state=active]:bg-background data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:shadow h-10"
        >
          {t("logistics.sustainability")}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="dashboard"
        className="mt-0 border rounded-tl-none bg-background"
      >
        <DashboardTab />
      </TabsContent>

      <TabsContent
        value="tracking"
        className="mt-0 border rounded-tl-none bg-background"
      >
        <TrackingTab />
      </TabsContent>

      <TabsContent
        value="analytics"
        className="mt-0 border rounded-tl-none bg-background"
      >
        <AnalyticsTab />
      </TabsContent>

      <TabsContent
        value="ddom"
        className="mt-0 border rounded-tl-none bg-background"
      >
        <DDOMTab />
      </TabsContent>

      <TabsContent
        value="sustainability"
        className="mt-0 border rounded-tl-none bg-background"
      >
        <SustainabilityTab />
      </TabsContent>
    </Tabs>
  );
};
