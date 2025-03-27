
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Database,
  BarChart3,
  ListFilter,
  Settings
} from "lucide-react";

import { InventoryChart } from "../InventoryChart";
import { BufferVisualizer } from "../buffer/BufferVisualizer";
import { SKUClassifications } from "../SKUClassifications";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "@/contexts/I18nContext";
import { 
  InventoryItem,
  SKUClassification // Now correctly imported from types/inventory
} from "@/types/inventory";
import { generateInventoryTestScenario } from "@/utils/testUtils/inventoryTestUtils";
import { calculateBufferZones, getBufferStatus } from "@/utils/inventoryUtils";

const InventoryTester = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [testScenario, setTestScenario] = useState<{
    items: InventoryItem[];
    classifications: SKUClassification[];
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    message: string;
    details?: string[];
  } | null>(null);

  // Load a test scenario
  const loadTestScenario = async () => {
    try {
      setIsLoading(true);
      setTestResults(null);
      
      // Generate a new test scenario
      const scenario = await generateInventoryTestScenario();
      setTestScenario(scenario);
      
      if (scenario.items.length > 0) {
        setSelectedItem(scenario.items[0]);
      }
      
      toast({
        title: "Test Scenario Loaded",
        description: `Generated ${scenario.items.length} inventory items and ${scenario.classifications.length} classifications`,
      });
      
      setTestResults({
        success: true,
        message: "Test scenario loaded successfully",
        details: [
          `Items: ${scenario.items.length}`,
          `Classifications: ${scenario.classifications.length}`,
          "Ready to test buffer zones, penetration calculations, and visualizations"
        ]
      });
    } catch (error) {
      console.error("Error loading test scenario:", error);
      setTestResults({
        success: false,
        message: "Failed to load test scenario",
        details: [error instanceof Error ? error.message : "Unknown error"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run various tests on the inventory data
  const runInventoryTests = async () => {
    if (!testScenario) {
      toast({
        title: "No Test Data",
        description: "Please load a test scenario first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Test buffer zone calculations
      const bufferTestResults = await Promise.all(
        testScenario.items.slice(0, 5).map(async (item) => {
          const bufferZones = await calculateBufferZones(item);
          return {
            sku: item.sku,
            hasValidZones: bufferZones.red > 0 && bufferZones.yellow > 0 && bufferZones.green > 0,
            bufferZones
          };
        })
      );
      
      const allBuffersValid = bufferTestResults.every(result => result.hasValidZones);
      
      // Test classification logic
      const classificationValid = testScenario.classifications.every(
        classification => 
          classification.classification.leadTimeCategory !== undefined &&
          classification.classification.variabilityLevel !== undefined &&
          classification.classification.criticality !== undefined
      );
      
      setTestResults({
        success: allBuffersValid && classificationValid,
        message: allBuffersValid && classificationValid 
          ? "All tests passed successfully" 
          : "Some tests failed",
        details: [
          `Buffer Calculations: ${allBuffersValid ? '✅ Valid' : '❌ Invalid'}`,
          `Classification Data: ${classificationValid ? '✅ Valid' : '❌ Invalid'}`,
          ...bufferTestResults.map(result => 
            `${result.sku}: Red=${result.bufferZones.red}, Yellow=${result.bufferZones.yellow}, Green=${result.bufferZones.green}`
          )
        ]
      });
      
      toast({
        title: allBuffersValid && classificationValid ? "Tests Passed" : "Tests Failed",
        description: allBuffersValid && classificationValid 
          ? "All inventory module calculations are working correctly" 
          : "Some inventory calculations failed, check the results",
        variant: allBuffersValid && classificationValid ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error running tests:", error);
      setTestResults({
        success: false,
        message: "Error running inventory tests",
        details: [error instanceof Error ? error.message : "Unknown error"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load a test scenario on component mount
  useEffect(() => {
    loadTestScenario();
  }, []);

  // Calculate buffer zones for the selected item
  const getSelectedItemBufferZones = () => {
    if (!selectedItem) return { red: 0, yellow: 0, green: 0 };
    
    return {
      red: selectedItem.redZoneSize || 0,
      yellow: selectedItem.yellowZoneSize || 0,
      green: selectedItem.greenZoneSize || 0
    };
  };

  const getTotalBuffer = (item: InventoryItem) => {
    return (item.redZoneSize || 0) + (item.yellowZoneSize || 0) + (item.greenZoneSize || 0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Module Tester</CardTitle>
              <CardDescription>
                Test inventory functionality with generated data scenarios
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={loadTestScenario}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Generate New Data
              </Button>
              <Button
                onClick={runInventoryTests}
                disabled={isLoading || !testScenario}
              >
                <Settings className="h-4 w-4 mr-2" />
                Run Tests
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {testResults && (
            <Alert className={`mb-4 ${testResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center">
                {testResults.success ? 
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                }
                <AlertTitle>{testResults.message}</AlertTitle>
              </div>
              {testResults.details && (
                <AlertDescription className="mt-2">
                  <ul className="list-disc pl-5 text-sm">
                    {testResults.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </AlertDescription>
              )}
            </Alert>
          )}

          <Tabs defaultValue="data" className="space-y-4">
            <TabsList>
              <TabsTrigger value="data">
                <Database className="h-4 w-4 mr-2" />
                Test Data
              </TabsTrigger>
              <TabsTrigger value="visualizations">
                <BarChart3 className="h-4 w-4 mr-2" />
                Visualizations
              </TabsTrigger>
              <TabsTrigger value="classifications">
                <ListFilter className="h-4 w-4 mr-2" />
                Classifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="data" className="space-y-4">
              {testScenario && testScenario.items.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Inventory Test Items</h3>
                  <ScrollArea className="h-[300px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Buffer Status</TableHead>
                          <TableHead>Buffer Zones</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testScenario.items.map((item) => {
                          const bufferStatus = getBufferStatus(item.bufferPenetration || 0);
                          const totalBuffer = getTotalBuffer(item);
                          
                          return (
                            <TableRow key={item.id} className={selectedItem?.id === item.id ? 'bg-muted/50' : ''}>
                              <TableCell className="font-medium">{item.sku}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.currentStock}</TableCell>
                              <TableCell>
                                <Badge className={
                                  bufferStatus === 'green' ? 'bg-green-100 text-green-800' :
                                  bufferStatus === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {bufferStatus.charAt(0).toUpperCase() + bufferStatus.slice(1)}
                                </Badge>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {item.bufferPenetration}% penetration
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="w-32">
                                  <div className="h-2 w-full rounded-full overflow-hidden bg-gray-100 flex">
                                    <div className="bg-red-200" style={{ width: `${(item.redZoneSize || 0) / totalBuffer * 100}%` }}></div>
                                    <div className="bg-yellow-200" style={{ width: `${(item.yellowZoneSize || 0) / totalBuffer * 100}%` }}></div>
                                    <div className="bg-green-200" style={{ width: `${(item.greenZoneSize || 0) / totalBuffer * 100}%` }}></div>
                                  </div>
                                  <div className="flex justify-between text-xs mt-1">
                                    <span>R:{item.redZoneSize}</span>
                                    <span>Y:{item.yellowZoneSize}</span>
                                    <span>G:{item.greenZoneSize}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedItem(item)}
                                >
                                  Select
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                  
                  {selectedItem && (
                    <Card className="p-4">
                      <h3 className="text-md font-medium mb-2">Selected Item Details: {selectedItem.sku}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Basic Information</h4>
                          <ul className="text-sm space-y-1">
                            <li>Name: {selectedItem.name}</li>
                            <li>Category: {selectedItem.category}</li>
                            <li>Family: {selectedItem.productFamily}</li>
                            <li>Location: {selectedItem.location}</li>
                            <li>Region: {selectedItem.region}</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">DDMRP Parameters</h4>
                          <ul className="text-sm space-y-1">
                            <li>ADU: {selectedItem.adu} units/day</li>
                            <li>Lead Time: {selectedItem.leadTimeDays} days</li>
                            <li>Variability Factor: {selectedItem.variabilityFactor?.toFixed(2)}</li>
                            <li>Net Flow Position: {selectedItem.netFlowPosition}</li>
                            <li>Buffer Penetration: {selectedItem.bufferPenetration?.toFixed(2)}%</li>
                          </ul>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium mb-2">Buffer Visualization</h4>
                          <BufferVisualizer
                            netFlowPosition={selectedItem.netFlowPosition}
                            bufferZones={getSelectedItemBufferZones()}
                            adu={selectedItem.adu || 0}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium mb-2">On Hand / On Order</h4>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>On Hand</span>
                                <span>{selectedItem.onHand} units</span>
                              </div>
                              <Progress value={(selectedItem.onHand / getTotalBuffer(selectedItem)) * 100} className="h-2 mt-1" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>On Order</span>
                                <span>{selectedItem.onOrder} units</span>
                              </div>
                              <Progress value={(selectedItem.onOrder / getTotalBuffer(selectedItem)) * 100} className="h-2 mt-1" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Qualified Demand</span>
                                <span>{selectedItem.qualifiedDemand} units</span>
                              </div>
                              <Progress value={(selectedItem.qualifiedDemand / getTotalBuffer(selectedItem)) * 100} className="h-2 mt-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/30">
                  <div className="text-center">
                    <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No test data available. Generate a new test scenario.</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="visualizations">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visualization Testing</h3>
                
                {testScenario && testScenario.items.length > 0 ? (
                  <div className="space-y-6">
                    <Card className="p-4">
                      <h4 className="text-md font-medium mb-4">Inventory Chart</h4>
                      <InventoryChart data={testScenario.items} />
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="text-md font-medium mb-4">Buffer Visualization</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {testScenario.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <h5 className="text-sm font-medium mb-2">{item.sku}</h5>
                            <BufferVisualizer
                              netFlowPosition={item.netFlowPosition}
                              bufferZones={{
                                red: item.redZoneSize || 0,
                                yellow: item.yellowZoneSize || 0,
                                green: item.greenZoneSize || 0
                              }}
                              adu={item.adu || 0}
                            />
                            <div className="text-xs text-center mt-2 text-muted-foreground">
                              Buffer Penetration: {item.bufferPenetration?.toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/30">
                    <div className="text-center">
                      <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No visualization data available. Generate a test scenario first.</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="classifications">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SKU Classification Testing</h3>
                
                {testScenario && testScenario.classifications.length > 0 ? (
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h4 className="text-md font-medium mb-4">SKU Classifications</h4>
                      <SKUClassifications classifications={testScenario.classifications} />
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/30">
                    <div className="text-center">
                      <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No classification data available. Generate a test scenario first.</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTester;
