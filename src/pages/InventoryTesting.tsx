
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, FileText, AlertCircle, BookOpen } from "lucide-react";
import InventoryTester from "@/components/inventory/testing/InventoryTester";

const InventoryTesting = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory Module Testing</h1>
            <p className="text-muted-foreground">
              Test the inventory module with sample data and validate functionality
            </p>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="tester" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tester">Interactive Tester</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tester">
            <InventoryTester />
          </TabsContent>
          
          <TabsContent value="documentation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Required Input Data
                  </CardTitle>
                  <CardDescription>
                    Data structure needed for the inventory module to function properly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Core Inventory Item Fields</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li><strong>id</strong>: Unique identifier for the inventory item</li>
                        <li><strong>sku</strong>: Stock Keeping Unit identifier</li>
                        <li><strong>name</strong>: Product name</li>
                        <li><strong>currentStock</strong>: Current inventory level</li>
                        <li><strong>category/subcategory</strong>: Product categorization</li>
                        <li><strong>location</strong>: Storage location</li>
                        <li><strong>productFamily</strong>: Product family grouping</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">DDMRP Required Fields</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li><strong>adu</strong>: Average Daily Usage</li>
                        <li><strong>leadTimeDays</strong>: Lead time in days</li>
                        <li><strong>variabilityFactor</strong>: Variability factor (typically 0.8-1.6)</li>
                        <li><strong>onHand</strong>: Current inventory</li>
                        <li><strong>onOrder</strong>: Ordered but not received inventory</li>
                        <li><strong>qualifiedDemand</strong>: Committed inventory</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Calculated Fields</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li><strong>netFlowPosition</strong>: onHand + onOrder - qualifiedDemand</li>
                        <li><strong>redZoneSize</strong>: Red buffer zone size</li>
                        <li><strong>yellowZoneSize</strong>: Yellow buffer zone size</li>
                        <li><strong>greenZoneSize</strong>: Green buffer zone size</li>
                        <li><strong>bufferPenetration</strong>: Current buffer penetration percentage</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Module Capabilities
                  </CardTitle>
                  <CardDescription>
                    Key features and functionality of the inventory module
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Core Features</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Inventory item management and tracking</li>
                        <li>Buffer calculation based on DDMRP methodology</li>
                        <li>Buffer zone visualization</li>
                        <li>SKU classification</li>
                        <li>Decoupling point management</li>
                        <li>Buffer profile configuration</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Key Calculations</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Buffer zone sizes (red, yellow, green)</li>
                        <li>Net flow position</li>
                        <li>Buffer penetration percentage</li>
                        <li>Planning priority based on buffer status</li>
                        <li>Order quantities and replenishment signals</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Visualization Features</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Buffer level charts</li>
                        <li>Inventory trends over time</li>
                        <li>Classification matrix</li>
                        <li>Network decoupling map</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Testing Guidelines
                  </CardTitle>
                  <CardDescription>
                    How to properly test the inventory module functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Testing Steps</h3>
                      <ol className="list-decimal pl-5 text-sm space-y-2">
                        <li>
                          <strong>Generate test data:</strong> Use the interactive tester to generate sample inventory data
                        </li>
                        <li>
                          <strong>Validate buffer calculations:</strong> Ensure red, yellow, and green zones are calculated correctly
                        </li>
                        <li>
                          <strong>Check buffer penetration:</strong> Verify buffer penetration percentages match expectations
                        </li>
                        <li>
                          <strong>Test visualizations:</strong> Ensure all charts and visualizations render correctly
                        </li>
                        <li>
                          <strong>Validate classification:</strong> Check that SKU classifications are applied correctly
                        </li>
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Common Issues</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>
                          <strong>Missing ADU or lead time data:</strong> Buffer zones cannot be calculated without these values
                        </li>
                        <li>
                          <strong>Zero or negative buffer zones:</strong> Check variability factors and lead time settings
                        </li>
                        <li>
                          <strong>Incorrect buffer penetration:</strong> Verify net flow position calculation
                        </li>
                        <li>
                          <strong>Visualization issues:</strong> Check browser console for rendering errors
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-md">
                      <div className="flex">
                        <HelpCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-blue-800 mb-1">Integration Testing Tip</h3>
                          <p className="text-sm text-blue-700">
                            For production scenarios, test with real data by importing it into the tester. This validates calculations with your actual inventory profiles and helps identify edge cases specific to your business.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InventoryTesting;
