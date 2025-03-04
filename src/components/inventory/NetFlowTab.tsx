
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { inventoryData } from "@/data/inventoryData";
import { TrendingUpIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { calculateNetFlowPosition, calculateBufferZones, calculateBufferPenetration } from "@/utils/bufferCalculations";
import { NetFlowVisualization } from "./NetFlowVisualization";
import { BufferZones, NetFlowPosition } from "@/types/inventory";

export const NetFlowTab = () => {
  const [selectedSku, setSelectedSku] = useState(inventoryData[0]?.sku || "");
  const [activeTab, setActiveTab] = useState("visualization");
  
  const selectedItem = inventoryData.find(item => item.sku === selectedSku);
  
  const [netFlow, setNetFlow] = useState<NetFlowPosition | null>(null);
  const [bufferZones, setBufferZones] = useState<BufferZones | null>(null);
  const [bufferPenetration, setBufferPenetration] = useState<number | null>(null);
  
  useState(() => {
    const fetchData = async () => {
      if (selectedItem) {
        const netFlowPosition = calculateNetFlowPosition(selectedItem);
        const zones = await calculateBufferZones(selectedItem);
        const penetration = calculateBufferPenetration(netFlowPosition.netFlowPosition, zones);
        
        setNetFlow(netFlowPosition);
        setBufferZones(zones);
        setBufferPenetration(penetration);
      }
    };
    
    fetchData();
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Net Flow Position Analysis</h3>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="sku-select" className="mr-2">Select SKU:</Label>
          <Select value={selectedSku} onValueChange={setSelectedSku}>
            <SelectTrigger id="sku-select" className="w-[200px]">
              <SelectValue placeholder="Select SKU" />
            </SelectTrigger>
            <SelectContent>
              {inventoryData.map(item => (
                <SelectItem key={item.sku} value={item.sku}>
                  {item.sku} - {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedItem && netFlow && bufferZones ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {selectedItem.name} ({selectedItem.sku})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NetFlowVisualization
                  netFlowPosition={netFlow}
                  bufferZones={bufferZones}
                  bufferPenetration={bufferPenetration || 0}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="components" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowUpIcon className="mr-2 h-5 w-5 text-green-500" />
                    On Hand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{netFlow.onHand}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Physical inventory currently available
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowUpIcon className="mr-2 h-5 w-5 text-blue-500" />
                    On Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{netFlow.onOrder}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Open supply orders currently in process
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowDownIcon className="mr-2 h-5 w-5 text-red-500" />
                    Qualified Demand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{netFlow.qualifiedDemand}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Demand with due dates inside order spike horizon
                  </p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUpIcon className="mr-2 h-5 w-5 text-purple-500" />
                    Net Flow Equation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm">
                    <div className="grid grid-cols-7 gap-2 items-center">
                      <div className="col-span-2 font-medium text-right pr-2">On Hand</div>
                      <div className="text-center">{netFlow.onHand}</div>
                      <div className="col-span-4"></div>
                      
                      <div className="col-span-2 font-medium text-right pr-2">+ On Order</div>
                      <div className="text-center">{netFlow.onOrder}</div>
                      <div className="col-span-4"></div>
                      
                      <div className="col-span-2 font-medium text-right pr-2">- Qualified Demand</div>
                      <div className="text-center">{netFlow.qualifiedDemand}</div>
                      <div className="col-span-4"></div>
                      
                      <div className="col-span-2 font-medium text-right pr-2 border-t border-gray-300">= Net Flow Position</div>
                      <div className="text-center border-t border-gray-300 font-bold">{netFlow.netFlowPosition}</div>
                      <div className="col-span-4 border-t border-gray-300"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Historical net flow data will be shown here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Select a SKU to view net flow position details</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
