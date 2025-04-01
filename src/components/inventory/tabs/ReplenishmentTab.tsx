
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { ReplenishmentTimes } from "../ReplenishmentTimes";
import { Button } from "@/components/ui/button";
import { CirclePlus, Filter } from "lucide-react";
import { useState } from "react";
import { CreatePODialog } from "../CreatePODialog";
import { ReplenishmentDataTable } from "../ReplenishmentDataTable";

export function ReplenishmentTab() {
  const { language } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {getTranslation("inventory.replenishment.title", language)}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <CirclePlus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {getTranslation("inventory.replenishment.metrics", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("inventory.replenishment.metrics.description", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Open Orders:</span>
                <span className="text-sm">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Orders Due This Week:</span>
                <span className="text-sm">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Lead Time:</span>
                <span className="text-sm">14.2 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Delayed Orders:</span>
                <span className="text-sm text-red-500">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {getTranslation("inventory.replenishment.times", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("inventory.replenishment.times.description", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReplenishmentTimes />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation("inventory.replenishment.orders", language)}
          </CardTitle>
          <CardDescription>
            {getTranslation("inventory.replenishment.orders.description", language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReplenishmentDataTable />
        </CardContent>
      </Card>
      
      <CreatePODialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
