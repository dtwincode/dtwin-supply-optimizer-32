"use client";

import { ClassificationManager } from "./classification/ClassificationManager";
import { DecouplingDashboard } from "./decoupling/DecouplingDashboard";
import { BufferingDashboard } from "./buffer/BufferingDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function InventoryDashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {/* Classification Section */}
      <Card>
        <CardHeader>
          <CardTitle>SKU Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassificationManager />
        </CardContent>
      </Card>

      {/* Decoupling Section */}
      <Card>
        <CardHeader>
          <CardTitle>Decoupling Point Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <DecouplingDashboard />
        </CardContent>
      </Card>

      {/* Buffering Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buffer Stock Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <BufferingDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
