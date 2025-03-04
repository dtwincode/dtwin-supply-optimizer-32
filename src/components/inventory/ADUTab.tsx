
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { inventoryData } from "@/data/inventoryData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ADUVisualization } from "./ADUVisualization";

export const ADUTab = () => {
  const [selectedSku, setSelectedSku] = useState(inventoryData[0]?.sku || "");
  const [activeTab, setActiveTab] = useState("visualization");
  const [blendFactor, setBlendFactor] = useState(50);
  
  const selectedItem = inventoryData.find(item => item.sku === selectedSku);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Average Daily Usage (ADU) Analysis</h3>
        
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="calculation">Calculation Method</TabsTrigger>
          <TabsTrigger value="adjustments">Dynamic Adjustments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization" className="pt-4">
          {selectedItem ? (
            <ADUVisualization item={selectedItem} />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">Select a SKU to visualize ADU data</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="calculation" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>ADU Calculation Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Blend Factor</h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                    <div className="md:col-span-3 text-sm text-right">
                      Historical (100%)
                    </div>
                    <div className="md:col-span-6">
                      <Slider
                        value={[blendFactor]}
                        min={0}
                        max={100}
                        step={10}
                        onValueChange={(value) => setBlendFactor(value[0])}
                      />
                    </div>
                    <div className="md:col-span-3 text-sm">
                      Forecast (100%)
                    </div>
                  </div>
                  <div className="text-center mt-2 text-sm text-muted-foreground">
                    Current mix: {100 - blendFactor}% Historical + {blendFactor}% Forecast
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Historical ADU Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Past 30 Days</span>
                          <span className="text-sm">{selectedItem?.aduCalculation?.past30Days || 0} units</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, ((selectedItem?.aduCalculation?.past30Days || 0) / 15) * 100)}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Past 60 Days</span>
                          <span className="text-sm">{selectedItem?.aduCalculation?.past60Days || 0} units</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, ((selectedItem?.aduCalculation?.past60Days || 0) / 15) * 100)}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Past 90 Days</span>
                          <span className="text-sm">{selectedItem?.aduCalculation?.past90Days || 0} units</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, ((selectedItem?.aduCalculation?.past90Days || 0) / 15) * 100)}%` }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Forecast ADU Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Forecasted ADU</span>
                          <span className="text-sm">{selectedItem?.aduCalculation?.forecastedADU || 0} units</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${Math.min(100, ((selectedItem?.aduCalculation?.forecastedADU || 0) / 15) * 100)}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Blended ADU</span>
                          <span className="text-sm">{selectedItem?.aduCalculation?.blendedADU || 0} units</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, ((selectedItem?.aduCalculation?.blendedADU || 0) / 15) * 100)}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          The blended ADU combines historical usage with forecast data to provide a more accurate representation for buffer calculations.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="adjustments" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic ADU Adjustment Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-orange-400">
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-2">Seasonality</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider
                          value={[selectedItem?.dynamicAdjustments?.seasonality ? selectedItem.dynamicAdjustments.seasonality * 100 : 100]}
                          min={50}
                          max={150}
                          step={5}
                          disabled
                        />
                      </div>
                      <div className="w-12 text-right font-mono">
                        {selectedItem?.dynamicAdjustments?.seasonality || 1.0}x
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Adjusts ADU based on seasonal demand patterns
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-blue-400">
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-2">Trend</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider
                          value={[selectedItem?.dynamicAdjustments?.trend ? selectedItem.dynamicAdjustments.trend * 100 : 100]}
                          min={50}
                          max={150}
                          step={5}
                          disabled
                        />
                      </div>
                      <div className="w-12 text-right font-mono">
                        {selectedItem?.dynamicAdjustments?.trend || 1.0}x
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Adjusts for long-term upward or downward trends
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-400">
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-2">Market Strategy</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider
                          value={[selectedItem?.dynamicAdjustments?.marketStrategy ? selectedItem.dynamicAdjustments.marketStrategy * 100 : 100]}
                          min={50}
                          max={150}
                          step={5}
                          disabled
                        />
                      </div>
                      <div className="w-12 text-right font-mono">
                        {selectedItem?.dynamicAdjustments?.marketStrategy || 1.0}x
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Adjusts based on marketing campaigns and promotions
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Combined Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    The combined dynamic adjustment factor is {(
                      (selectedItem?.dynamicAdjustments?.seasonality || 1) *
                      (selectedItem?.dynamicAdjustments?.trend || 1) *
                      (selectedItem?.dynamicAdjustments?.marketStrategy || 1)
                    ).toFixed(2)}x
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This means the ADU is being {(
                      (selectedItem?.dynamicAdjustments?.seasonality || 1) *
                      (selectedItem?.dynamicAdjustments?.trend || 1) *
                      (selectedItem?.dynamicAdjustments?.marketStrategy || 1) > 1
                      ? "increased"
                      : "decreased"
                    )} to account for all adjustment factors.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
