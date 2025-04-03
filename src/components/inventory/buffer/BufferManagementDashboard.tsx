import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowDown, TrendingUp, Warehouse } from "lucide-react";

export default function BufferManagement() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Buffer Management Dashboard</h2>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zones">Buffer Zones</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-md hover:shadow-lg transition">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-lg font-bold">420</p>
                </div>
                <Warehouse className="text-gray-400" size={32} />
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-500">Stockouts This Month</p>
                  <p className="text-lg font-bold">8 Days</p>
                </div>
                <ArrowDown className="text-red-500" size={32} />
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-500">Trend Factor</p>
                  <p className="text-lg font-bold">1.3</p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zones">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-8 border-red-500">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Red Zone</h3>
                <p className="text-sm text-gray-500">Safety Stock: 320 units</p>
              </CardContent>
            </Card>
            <Card className="border-l-8 border-yellow-500">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Yellow Zone</h3>
                <p className="text-sm text-gray-500">Trend Factor Applied</p>
              </CardContent>
            </Card>
            <Card className="border-l-8 border-green-500">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Green Zone</h3>
                <p className="text-sm text-gray-500">Performance Feedback Active</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-4">
            <Card className="shadow-md">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Current Service Level</h3>
                <p className="text-sm text-gray-500">98.7% (B2C)</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Auto Performance Update</h3>
                  <p className="text-sm text-gray-500">Scheduled Daily</p>
                </div>
                <Button>View Logs</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
