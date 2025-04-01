
"use client";

import { useEffect, useState } from "react";
import { DecouplingNetworkBoard } from "./DecouplingNetworkBoard";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { DecouplingAnalytics } from "./DecouplingAnalytics";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
      {/* Summary Board */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Decoupling Points</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={refreshDecouplingPoints} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Decoupling Point
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : decouplingPoints.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No decoupling points have been defined. Decoupling points are automatically generated
              based on lead time and demand variability thresholds.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location ID</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Buffer Profile</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decouplingPoints.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell>{point.locationId}</TableCell>
                    <TableCell>{point.id.split('-')[0]}</TableCell>
                    <TableCell>
                      <Badge className={getDecouplingTypeColor(point.type)}>
                        {getDecouplingTypeLabel(point.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{point.bufferProfileId}</TableCell>
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

      {/* Network Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Decoupling Network Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <DecouplingNetworkBoard />
        </CardContent>
      </Card>

      {/* Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
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
