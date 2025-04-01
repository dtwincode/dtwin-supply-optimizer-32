
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { RefreshCw, Save } from "lucide-react";

export interface ThresholdValues {
  demand_variability_threshold: number;
  decoupling_threshold: number;
  first_time_adjusted: boolean;
  updated_at: string;
}

export function ThresholdManagement() {
  const [thresholds, setThresholds] = useState<ThresholdValues | null>(null);
  const [demandVariability, setDemandVariability] = useState<number>(0.6);
  const [decouplingPoint, setDecouplingPoint] = useState<number>(0.75);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchThresholds();
  }, []);

  const fetchThresholds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("threshold_config")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error fetching thresholds:", error);
        throw error;
      }

      setThresholds(data);
      setDemandVariability(data.demand_variability_threshold);
      setDecouplingPoint(data.decoupling_threshold);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "Failed to load threshold values",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateThresholds = async () => {
    try {
      setUpdating(true);
      
      const response = await fetch(
        "https://mttzjxktvbsixjaqiuxq.supabase.co/functions/v1/manual_threshold_update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabase.auth.session()?.access_token || ''}`,
          },
          body: JSON.stringify({
            demand_variability_threshold: demandVariability,
            decoupling_threshold: decouplingPoint,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update thresholds");
      }

      toast({
        title: "Success",
        description: "Thresholds updated successfully",
      });
      
      // Refresh thresholds after update
      fetchThresholds();
    } catch (err) {
      console.error("Error updating thresholds:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update thresholds",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory Classification Thresholds</CardTitle>
        <CardDescription>
          Adjust threshold values used for SKU classification and decoupling point determination
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="demand-variability">Demand Variability Threshold</Label>
                  <span className="text-sm text-muted-foreground">
                    Current: {thresholds?.demand_variability_threshold.toFixed(2)}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Slider
                    id="demand-variability"
                    min={0.1}
                    max={1}
                    step={0.01}
                    value={[demandVariability]}
                    onValueChange={(value) => setDemandVariability(value[0])}
                  />
                  <Input
                    type="number"
                    min={0.1}
                    max={1}
                    step={0.01}
                    value={demandVariability}
                    onChange={(e) => setDemandVariability(parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used to classify SKUs based on their variability level. Higher values reduce the number of SKUs classified as "high variability"
                </p>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="decoupling-point">Decoupling Point Threshold</Label>
                  <span className="text-sm text-muted-foreground">
                    Current: {thresholds?.decoupling_threshold.toFixed(2)}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Slider
                    id="decoupling-point"
                    min={0.3}
                    max={1}
                    step={0.01}
                    value={[decouplingPoint]}
                    onValueChange={(value) => setDecouplingPoint(value[0])}
                  />
                  <Input
                    type="number"
                    min={0.3}
                    max={1}
                    step={0.01}
                    value={decouplingPoint}
                    onChange={(e) => setDecouplingPoint(parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Determines where to place decoupling points in the supply chain. Higher values reduce the number of recommended decoupling points
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                Last updated: {thresholds?.updated_at ? new Date(thresholds.updated_at).toLocaleString() : 'Never'}
                {thresholds?.first_time_adjusted && 
                  <span className="ml-2 text-xs">(Manually adjusted)</span>
                }
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={fetchThresholds} disabled={loading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={updateThresholds} disabled={updating || loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
