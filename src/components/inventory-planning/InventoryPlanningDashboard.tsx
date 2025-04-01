
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export function InventoryPlanningDashboard() {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Inventory Planning
        </h1>
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            New
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Buffer Analysis</CardTitle>
            <CardDescription>
              Analyze buffer levels across your inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Buffer analysis dashboard coming soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decoupling Points</CardTitle>
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
          <CardHeader>
            <CardTitle>Planning KPIs</CardTitle>
            <CardDescription>
              Key performance indicators for inventory planning
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              KPI dashboard coming soon
            </p>
          </CardContent>
        </Card>
      </div>

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
