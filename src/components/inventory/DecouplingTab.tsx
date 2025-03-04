
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { DecouplingNetworkBoard } from "./DecouplingNetworkBoard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  InfoCircledIcon, 
  LayersIcon, 
  NetworkIcon 
} from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";

const TYPE_COLORS = {
  strategic: "bg-red-500",
  customer_order: "bg-blue-500",
  stock_point: "bg-green-500",
  intermediate: "bg-purple-500"
};

export const DecouplingTab = () => {
  const { points, loading, getNetwork } = useDecouplingPoints();
  const [activeTab, setActiveTab] = useState("network");
  const network = getNetwork();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Decoupling Points Management</h3>
        <DecouplingPointDialog locationId="default" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <NetworkIcon className="h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center gap-2">
            <LayersIcon className="h-4 w-4" />
            Decoupling Points
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <InfoCircledIcon className="h-4 w-4" />
            Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="network">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Network Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(TYPE_COLORS).map(([type, color]) => (
                    <Badge key={type} variant="outline" className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                    </Badge>
                  ))}
                </div>
                
                <div className="border rounded-lg p-4 h-[600px] bg-white">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <DecouplingNetworkBoard network={network} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {points.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      No decoupling points defined yet. Add your first decoupling point to get started.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {points.map(point => (
                        <Card key={point.id} className="overflow-hidden">
                          <div className={`h-2 ${TYPE_COLORS[point.type]}`} />
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">Location ID: {point.locationId}</h4>
                                <p className="text-sm text-muted-foreground capitalize">
                                  Type: {point.type.replace('_', ' ')}
                                </p>
                              </div>
                              <DecouplingPointDialog 
                                locationId={point.locationId} 
                                existingPoint={point}
                              />
                            </div>
                            {point.description && (
                              <p className="text-sm mt-2">
                                {point.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Decoupling Point Strategy Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-base">What are Decoupling Points?</h3>
                <p className="text-sm text-muted-foreground">
                  Decoupling points are strategic positions in your supply chain where you maintain buffer
                  inventory to protect against variability and optimize flow. They "decouple" demand from supply,
                  allowing different sections of your supply chain to operate independently.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-base">Types of Decoupling Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Strategic Points (15-20%)</h4>
                      <p className="text-sm mt-1">
                        Main distribution centers and key hubs with long lead times. These protect your entire downstream network.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Customer Order Points (30-40%)</h4>
                      <p className="text-sm mt-1">
                        Retail locations and customer-facing points where service level requirements are highest.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Stock Points (40-50%)</h4>
                      <p className="text-sm mt-1">
                        Medium-level warehouses and regional distribution points that buffer against supplier variability.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Intermediate Points (10-15%)</h4>
                      <p className="text-sm mt-1">
                        Supporting locations with short lead times that provide operational flexibility.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-base">Best Practices</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Focus decoupling points at locations with high impact on lead time</li>
                  <li>Place strategic points at convergence locations where multiple sources/destinations meet</li>
                  <li>Consider customer tolerance time when positioning order decoupling points</li>
                  <li>Balance the number of points - too many increases inventory, too few reduces resilience</li>
                  <li>Regularly review and adjust your decoupling strategy as supply chain conditions change</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
