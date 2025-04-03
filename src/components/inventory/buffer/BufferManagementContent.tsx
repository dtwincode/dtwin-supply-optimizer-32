
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BufferManagementDashboard } from "./BufferManagementDashboard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";
import { BufferBreachNotification } from "../overview/BufferBreachNotification";

export function BufferManagementContent() {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Buffer Management</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <BufferBreachNotification />

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Buffer Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <BufferManagementDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
