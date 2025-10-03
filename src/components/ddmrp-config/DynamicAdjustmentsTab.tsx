import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DAFManagement } from "./DAFManagement";
import { ZAFManagement } from "./ZAFManagement";
import { BufferCriteriaCompliance } from "./BufferCriteriaCompliance";
import { LeadTimeVarianceAlerts } from "./LeadTimeVarianceAlerts";
import { LocationHierarchyManagement } from "./LocationHierarchyManagement";

export function DynamicAdjustmentsTab() {
  return (
    <Tabs defaultValue="daf" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="daf">DAF</TabsTrigger>
        <TabsTrigger value="zaf">ZAF</TabsTrigger>
        <TabsTrigger value="criteria">Buffer Criteria</TabsTrigger>
        <TabsTrigger value="leadtime">Lead Time Alerts</TabsTrigger>
        <TabsTrigger value="hierarchy">Multi-Echelon</TabsTrigger>
      </TabsList>
      <TabsContent value="daf" className="space-y-4">
        <DAFManagement />
      </TabsContent>
      <TabsContent value="zaf" className="space-y-4">
        <ZAFManagement />
      </TabsContent>
      <TabsContent value="criteria" className="space-y-4">
        <BufferCriteriaCompliance />
      </TabsContent>
      <TabsContent value="leadtime" className="space-y-4">
        <LeadTimeVarianceAlerts />
      </TabsContent>
      <TabsContent value="hierarchy" className="space-y-4">
        <LocationHierarchyManagement />
      </TabsContent>
    </Tabs>
  );
}
