
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBufferProfiles } from "@/hooks/useBufferProfiles";
import { BufferProfileDialog } from "./BufferProfileDialog";
import { BufferConfigurationPanel } from "./BufferConfigurationPanel";
import { Loader2 } from "lucide-react";

export const BufferManagementTab = () => {
  const [activeTab, setActiveTab] = useState("profiles");
  const { profiles, loading, createOrUpdateProfile } = useBufferProfiles();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Buffer Management</h2>
        <BufferProfileDialog 
          onSuccess={(profile) => createOrUpdateProfile(profile)} 
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles">Buffer Profiles</TabsTrigger>
          <TabsTrigger value="configuration">Buffer Configuration</TabsTrigger>
          <TabsTrigger value="formulas">DDMRP Formulas</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map(profile => (
                <Card key={profile.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {profile.description || "No description available"}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Variability:</span>{" "}
                          {profile.variabilityFactor.replace("_", " ")}
                        </div>
                        <div>
                          <span className="font-medium">Lead Time:</span>{" "}
                          {profile.leadTimeFactor}
                        </div>
                        {profile.moq && (
                          <div>
                            <span className="font-medium">MOQ:</span> {profile.moq}
                          </div>
                        )}
                        {profile.lotSizeFactor && (
                          <div>
                            <span className="font-medium">Lot Size Factor:</span>{" "}
                            {profile.lotSizeFactor}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {profiles.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No buffer profiles found. Create a new profile to get started.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="configuration">
          <BufferConfigurationPanel />
        </TabsContent>

        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <CardTitle>DDMRP Buffer Zone Calculation Formulas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Red Zone (Base Stock)</h3>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  Red Zone = ADU × Lead Time Factor × Variability Factor
                </p>
                <p className="text-sm text-muted-foreground">
                  The red zone represents your base stock that should never be penetrated except in unusual circumstances.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Yellow Zone (Replenishment Zone)</h3>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  Yellow Zone = ADU × Replenishment Time × Replenishment Factor
                </p>
                <p className="text-sm text-muted-foreground">
                  The yellow zone covers demand during replenishment lead time.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Green Zone (Order Cycle / Demand Variability)</h3>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  Green Zone = Yellow Zone × Green Zone Factor
                </p>
                <p className="text-sm text-muted-foreground">
                  The green zone accommodates order cycle and demand variability.
                </p>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium">Formula Variables Explained:</h3>
                <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-muted-foreground">
                  <li>ADU = Average Daily Usage (historical or forecasted)</li>
                  <li>
                    Lead Time Factor varies based on lead time category:
                    <ul className="list-disc list-inside ml-6">
                      <li>Short (≤ 7 days): 0.7</li>
                      <li>Medium (≤ 14 days): 1.0</li>
                      <li>Long (> 14 days): 1.3</li>
                    </ul>
                  </li>
                  <li>Variability Factor adjusts for demand volatility (typically 0.8-1.6)</li>
                  <li>Replenishment Time is the typical lead time for this item</li>
                  <li>Replenishment Factor adjusts for processing time (typically 1.0)</li>
                  <li>Green Zone Factor determines your safety stock level (typically 0.5-1.0)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
