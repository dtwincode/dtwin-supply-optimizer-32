
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/types/inventory";
import { 
  BarChart, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Info, 
  Layers, 
  RefreshCw, 
  TrendingUp
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThresholdConfig } from "@/hooks/useThresholdConfig";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface InventoryPlanningInsightsProps {
  selectedItem?: InventoryItem;
}

export function InventoryPlanningInsights({ selectedItem }: InventoryPlanningInsightsProps) {
  const { config, updateConfig, triggerBayesianUpdate, loading } = useThresholdConfig();
  const [isRunningBayesian, setIsRunningBayesian] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  
  const handleRunBayesianUpdate = async () => {
    setIsRunningBayesian(true);
    await triggerBayesianUpdate();
    setIsRunningBayesian(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Inventory Planning Insights</CardTitle>
            <CardDescription>
              Advanced analytical methods for optimal inventory management
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-md">
                <p>This dashboard integrates multiple analytical approaches:</p>
                <ul className="list-disc ml-4 mt-2 text-xs">
                  <li>Analytical buffering (non-constant)</li>
                  <li>Decoupling based on percentiles</li>
                  <li>Bayesian threshold learning</li>
                  <li>K-means SKU classification</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-md bg-background">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Buffer Analysis</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Using dynamic analytical calculations instead of constant safety stock
                </p>
                <div className="mt-3">
                  <Badge>Analytical Method</Badge>
                </div>
              </div>
              
              <div className="p-4 border rounded-md bg-background">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Decoupling Strategy</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Positioning based on statistical percentiles of demand and lead time
                </p>
                <div className="mt-3">
                  <Badge variant="outline">Percentile-Based</Badge>
                </div>
              </div>
            </div>
            
            <Collapsible
              open={isCollapsibleOpen}
              onOpenChange={setIsCollapsibleOpen}
              className="border rounded-md p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Planning Parameters</h3>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isCollapsibleOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Red Zone Formula</p>
                      <p className="text-sm font-mono bg-muted p-1 rounded">
                        ADU × Lead Time Factor × Variability Factor
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Yellow Zone Formula</p>
                      <p className="text-sm font-mono bg-muted p-1 rounded">
                        ADU × Lead Time Days × Replenishment Factor
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Green Zone Formula</p>
                      <p className="text-sm font-mono bg-muted p-1 rounded">
                        Yellow Zone × Green Zone Factor
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Net Flow Position</p>
                      <p className="text-sm font-mono bg-muted p-1 rounded">
                        On Hand + On Order - Qualified Demand
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
          
          <TabsContent value="thresholds" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="bg-muted/50 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Bayesian Threshold Learning</h3>
                  <p className="text-xs text-muted-foreground">
                    System learns optimal thresholds from historical performance data
                  </p>
                </div>
                <Button 
                  onClick={handleRunBayesianUpdate} 
                  disabled={isRunningBayesian || loading}
                  className="mt-2 md:mt-0"
                  size="sm"
                >
                  {isRunningBayesian ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    "Run Bayesian Update"
                  )}
                </Button>
              </div>
              
              {config && (
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-muted-foreground mb-1">Demand Variability Threshold</h4>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">
                          {config.demand_variability_threshold.toFixed(2)}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                Threshold for determining high vs. low demand variability.
                                <br />Learned from stockout vs. overstock patterns.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs text-muted-foreground mb-1">Decoupling Threshold</h4>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">
                          {config.decoupling_threshold.toFixed(2)}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                Threshold for determining decoupling point positioning.
                                <br />Learned from service level performance.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Last updated:</span>
                      <span>{new Date(config.updated_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Learning status:</span>
                      <span>{config.first_time_adjusted ? "Calibrated" : "Initial values"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="classification" className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="text-sm font-medium mb-2">K-means Classification Model</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Products are classified by lead time, variability, and criticality using K-means clustering
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="border rounded-md p-3 bg-background">
                  <h4 className="text-xs font-medium">Lead Time</h4>
                  <div className="flex justify-between text-xs mt-1">
                    <Badge variant="outline" className="bg-green-100">Short</Badge>
                    <Badge variant="outline" className="bg-amber-100">Medium</Badge>
                    <Badge variant="outline" className="bg-red-100">Long</Badge>
                  </div>
                </div>
                <div className="border rounded-md p-3 bg-background">
                  <h4 className="text-xs font-medium">Variability</h4>
                  <div className="flex justify-between text-xs mt-1">
                    <Badge variant="outline" className="bg-green-100">Low</Badge>
                    <Badge variant="outline" className="bg-amber-100">Medium</Badge>
                    <Badge variant="outline" className="bg-red-100">High</Badge>
                  </div>
                </div>
                <div className="border rounded-md p-3 bg-background">
                  <h4 className="text-xs font-medium">Criticality</h4>
                  <div className="flex justify-between text-xs mt-1">
                    <Badge variant="outline" className="bg-green-100">Low</Badge>
                    <Badge variant="outline" className="bg-amber-100">Medium</Badge>
                    <Badge variant="outline" className="bg-red-100">High</Badge>
                  </div>
                </div>
              </div>
              
              {selectedItem ? (
                <div className="mt-4 p-3 border rounded-md bg-muted/30">
                  <h4 className="text-xs font-medium mb-2">Selected Item Classification</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Lead Time</p>
                      <Badge className={`mt-1 ${
                        selectedItem.classification?.leadTimeCategory === 'short' ? 'bg-green-100' : 
                        selectedItem.classification?.leadTimeCategory === 'medium' ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        {selectedItem.classification?.leadTimeCategory || 'N/A'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Variability</p>
                      <Badge className={`mt-1 ${
                        selectedItem.classification?.variabilityLevel === 'low' ? 'bg-green-100' : 
                        selectedItem.classification?.variabilityLevel === 'medium' ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        {selectedItem.classification?.variabilityLevel || 'N/A'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Criticality</p>
                      <Badge className={`mt-1 ${
                        selectedItem.classification?.criticality === 'low' ? 'bg-green-100' : 
                        selectedItem.classification?.criticality === 'medium' ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        {selectedItem.classification?.criticality || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 border rounded-md bg-muted/30 text-center text-sm text-muted-foreground">
                  Select an inventory item to view its classification
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
