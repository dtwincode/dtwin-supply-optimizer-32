import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Loader2, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useInventoryConfig } from "@/hooks/useInventoryConfig";

export const BreachDetectionTrigger = () => {
  const { getConfig } = useInventoryConfig();
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<any>(null);
  const { toast } = useToast();

  const triggerBreachDetection = async () => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('detect-breaches-and-replenish');

      if (error) {
        console.error('Error invoking function:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to detect breaches",
          variant: "destructive",
        });
        return;
      }

      setLastRun(data);
      toast({
        title: "Breach Detection Complete",
        description: `Detected ${data.breaches_detected} breaches, created ${data.replenishment_orders_created} orders`,
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to run breach detection",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          DDMRP Engine Status
        </CardTitle>
        <CardDescription>
          Run breach detection and generate replenishment orders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={triggerBreachDetection} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Detection...
            </>
          ) : (
            <>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Run Breach Detection
            </>
          )}
        </Button>

        {lastRun && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Run:</span>
              <span className="font-medium">
                {new Date(lastRun.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {lastRun.breaches_detected}
                  </div>
                  <div className="text-xs text-muted-foreground">Breaches</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Package className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {lastRun.replenishment_orders_created}
                  </div>
                  <div className="text-xs text-muted-foreground">Orders</div>
                </div>
              </div>
            </div>

            {lastRun.critical_breaches && lastRun.critical_breaches.length > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">
                    {lastRun.critical_breaches.length} Critical Breaches
                  </span>
                </div>
                <div className="space-y-1">
                  {lastRun.critical_breaches.slice(0, getConfig('breach_critical_display_limit', 3)).map((breach: any, idx: number) => (
                    <div key={idx} className="text-xs text-muted-foreground">
                      {breach.product_id} @ {breach.location_id}: {breach.breach_type}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
