import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DAFManagement } from "./DAFManagement";
import { ZAFManagement } from "./ZAFManagement";

export function DynamicAdjustmentsTab() {
  return (
    <Tabs defaultValue="daf" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="daf">Demand Adjustment (DAF)</TabsTrigger>
        <TabsTrigger value="zaf">Zone Adjustment (ZAF)</TabsTrigger>
      </TabsList>
      <TabsContent value="daf" className="space-y-4">
        <DAFManagement />
      </TabsContent>
      <TabsContent value="zaf" className="space-y-4">
        <ZAFManagement />
      </TabsContent>
    </Tabs>
  );
}
