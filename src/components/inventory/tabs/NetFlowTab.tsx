
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { useState } from "react";
import { NetFlowVisualization } from "../visualization/NetworkFlowVisualization";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NetFlowTab() {
  const { language } = useLanguage();
  const [selectedView, setSelectedView] = useState<string>("all");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {getTranslation("inventory.netflow.title", language)}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {getTranslation("inventory.netflow.viewBy", language)}:
          </span>
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inventory</SelectItem>
              <SelectItem value="decoupling">Decoupling Points</SelectItem>
              <SelectItem value="critical">Critical Items</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation("inventory.netflow.visualization", language)}
          </CardTitle>
          <CardDescription>
            {getTranslation("inventory.netflow.description", language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetFlowVisualization />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {getTranslation("inventory.netflow.metrics", language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Net Flow:</span>
                <span className="text-sm">245 units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">On-Order Total:</span>
                <span className="text-sm">1,250 units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Qualified Demand:</span>
                <span className="text-sm">980 units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Coverage:</span>
                <span className="text-sm">24 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {getTranslation("inventory.netflow.projections", language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Projected Stock Outs:</span>
                <span className="text-sm text-red-500">3 SKUs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Excess Inventory Risk:</span>
                <span className="text-sm text-amber-500">5 SKUs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Optimal Coverage:</span>
                <span className="text-sm text-green-500">18 SKUs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
