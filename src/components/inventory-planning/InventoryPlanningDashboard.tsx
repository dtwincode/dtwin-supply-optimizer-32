
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { BarChart2, Layers, TrendingUp, Activity, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InventoryPlanningDashboard() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("buffer");
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {getTranslation("navigation.inventoryPlanning", language)}
        </h1>
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            New
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="w-full md:w-1/3">
          <Input 
            placeholder="Search by product, location..." 
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="warehouse-1">Warehouse 1</SelectItem>
              <SelectItem value="warehouse-2">Warehouse 2</SelectItem>
              <SelectItem value="distribution-center">Distribution Center</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Buffer Profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="high-variability">High Variability</SelectItem>
              <SelectItem value="low-variability">Low Variability</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="buffer">Buffer Analysis</TabsTrigger>
          <TabsTrigger value="decoupling">Decoupling Points</TabsTrigger>
          <TabsTrigger value="kpi">Planning KPIs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buffer" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2 text-blue-500" />
                  <CardTitle className="text-lg">Buffer Analysis</CardTitle>
                </div>
                <CardDescription>
                  Analyze buffer levels across your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Buffer metrics dashboard and insights coming soon
                  </p>
                  <Button variant="outline" className="mt-2">View Buffer Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-500" />
                  <CardTitle className="text-lg">Zone Analysis</CardTitle>
                </div>
                <CardDescription>
                  Red/Yellow/Green zone distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="space-y-2">
                    <div className="bg-red-100 p-2 rounded">
                      <p className="text-sm font-medium text-red-600">Red Zone: 24%</p>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded">
                      <p className="text-sm font-medium text-yellow-600">Yellow Zone: 45%</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded">
                      <p className="text-sm font-medium text-green-600">Green Zone: 31%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                  <CardTitle className="text-lg">Buffer Trends</CardTitle>
                </div>
                <CardDescription>
                  Buffer level trends over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Buffer trend visualization coming soon
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="decoupling" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Layers className="h-4 w-4 mr-2 text-blue-500" />
                  <CardTitle className="text-lg">Decoupling Points</CardTitle>
                </div>
                <CardDescription>
                  Strategic inventory positioning
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Decoupling point analysis coming soon
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Supply Chain Map</CardTitle>
                <CardDescription>
                  Visualization of decoupling points
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Supply chain map visualization coming soon
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Positioning Strategy</CardTitle>
                <CardDescription>
                  Recommended decoupling point positions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Strategic position recommendations coming soon
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="kpi" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Level</CardTitle>
                <CardDescription>
                  Current service level performance
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">94.2%</div>
                  <p className="text-sm text-muted-foreground mt-2">+2.1% from last month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory Turns</CardTitle>
                <CardDescription>
                  Inventory turnover rate
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">8.5</div>
                  <p className="text-sm text-muted-foreground mt-2">+0.3 from last quarter</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Planning KPIs</CardTitle>
                <CardDescription>
                  Key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  KPI dashboard coming soon
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Planning Overview</CardTitle>
          <CardDescription>
            Comprehensive view of inventory planning metrics and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              This module is currently under development. More features will be added soon.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800">
              <p>This is a new feature in early access. We appreciate your feedback!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
