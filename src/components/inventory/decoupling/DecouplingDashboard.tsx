
"use client";

import { useState } from "react";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { DecouplingAnalytics } from "./DecouplingAnalytics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DecouplingDashboard() {
  const { 
    decouplingPoints, 
    loading, 
    refreshDecouplingPoints, 
    deleteDecouplingPoint 
  } = useDecouplingPoints();
  
  const [selectedPoint, setSelectedPoint] = useState<{
    productId: string;
    locationId: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Calculate stats for the decoupling points
  const autoPoints = decouplingPoints.filter(point => !point.isOverride);
  const manualPoints = decouplingPoints.filter(point => point.isOverride);
  
  // Filter points based on active tab
  const filteredPoints = activeTab === "auto" 
    ? autoPoints 
    : activeTab === "manual" 
      ? manualPoints 
      : decouplingPoints;

  const handleOpenDialog = (productId: string, locationId: string) => {
    setSelectedPoint({ productId, locationId });
    setDialogOpen(true);
  };

  const handleDeletePoint = (id: string) => {
    if (confirm("Are you sure you want to remove this decoupling point?")) {
      deleteDecouplingPoint(id);
    }
  };

  const getDecouplingTypeLabel = (type: string) => {
    switch (type) {
      case 'strategic': return 'Strategic';
      case 'customer_order': return 'Customer Order';
      case 'stock_point': return 'Stock Point';
      case 'intermediate': return 'Intermediate';
      default: return type;
    }
  };

  const getDecouplingTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'bg-blue-100 text-blue-800';
      case 'customer_order': return 'bg-green-100 text-green-800';
      case 'stock_point': return 'bg-purple-100 text-purple-800';
      case 'intermediate': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Decoupling Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decouplingPoints.length}</div>
            <p className="text-xs text-muted-foreground">
              Total decoupling points in your network
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auto-Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoPoints.length}</div>
            <p className="text-xs text-muted-foreground">
              Points created automatically based on thresholds
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Manual Overrides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manualPoints.length}</div>
            <p className="text-xs text-muted-foreground">
              Points manually created or overridden
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Board */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Decoupling Points</CardTitle>
            <p className="text-sm text-muted-foreground">
              Auto-generated based on demand variability and lead time thresholds, with manual override capability
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={refreshDecouplingPoints} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Manual Override
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Points</TabsTrigger>
              <TabsTrigger value="auto">Auto-Generated</TabsTrigger>
              <TabsTrigger value="manual">Manual Overrides</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPoints.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              {activeTab === "auto" 
                ? "No automatically generated decoupling points found. They are generated based on lead time and demand variability thresholds."
                : activeTab === "manual"
                  ? "No manual decoupling point overrides found. You can add them using the 'Add Manual Override' button."
                  : "No decoupling points have been defined. Decoupling points are automatically generated based on lead time and demand variability thresholds."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Location ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Buffer Profile</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPoints.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell>{point.id.split('-')[0]}</TableCell>
                    <TableCell>{point.locationId}</TableCell>
                    <TableCell>
                      <Badge className={getDecouplingTypeColor(point.type)}>
                        {getDecouplingTypeLabel(point.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{point.bufferProfileId}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant={point.isOverride ? "outline" : "default"} className={point.isOverride ? "border-amber-500 text-amber-700" : "bg-emerald-100 text-emerald-800"}>
                              {point.isOverride ? "Manual Override" : "Auto-generated"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {point.isOverride 
                              ? "This decoupling point was manually created through an override"
                              : "This decoupling point was automatically generated based on thresholds"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePoint(point.id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Decoupling Point Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <DecouplingAnalytics />
        </CardContent>
      </Card>

      {/* Dialog */}
      <DecouplingPointDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        productId={selectedPoint?.productId || ""}
        locationId={selectedPoint?.locationId || ""}
        onSuccess={() => {
          setDialogOpen(false);
          refreshDecouplingPoints();
        }}
      />
    </div>
  );
}
