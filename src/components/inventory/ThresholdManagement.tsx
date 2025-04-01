
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useThresholdConfig } from "@/hooks/useThresholdConfig";

export function ThresholdManagement() {
  const { toast } = useToast();
  const { config, loading, updateThresholdConfig } = useThresholdConfig();
  
  const [demandVariabilityThreshold, setDemandVariabilityThreshold] = useState<number>(
    config?.demand_variability_threshold || 0.6
  );
  const [decouplingThreshold, setDecouplingThreshold] = useState<number>(
    config?.decoupling_threshold || 0.75
  );
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when config loads
  if (config && !loading && demandVariabilityThreshold === 0.6 && config.demand_variability_threshold !== 0.6) {
    setDemandVariabilityThreshold(config.demand_variability_threshold);
  }
  
  if (config && !loading && decouplingThreshold === 0.75 && config.decoupling_threshold !== 0.75) {
    setDecouplingThreshold(config.decoupling_threshold);
  }

  const handleSaveThresholds = async () => {
    try {
      setIsSaving(true);
      
      const success = await updateThresholdConfig({
        demand_variability_threshold: demandVariabilityThreshold,
        decoupling_threshold: decouplingThreshold,
        first_time_adjusted: true
      });
      
      if (success) {
        toast({
          title: "Thresholds Saved",
          description: "Classification thresholds have been updated successfully.",
        });
      } else {
        throw new Error("Failed to update thresholds");
      }
    } catch (error) {
      console.error("Error saving thresholds:", error);
      toast({
        title: "Error",
        description: "Failed to update thresholds. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classification Thresholds</CardTitle>
        <CardDescription>
          Adjust thresholds used for automatic SKU classification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="demand-variability">Demand Variability Threshold</Label>
            <span className="text-sm font-medium">{(demandVariabilityThreshold * 100).toFixed(0)}%</span>
          </div>
          <Slider
            id="demand-variability"
            min={0}
            max={1}
            step={0.01}
            value={[demandVariabilityThreshold]}
            onValueChange={(values) => setDemandVariabilityThreshold(values[0])}
            disabled={loading || isSaving}
          />
          <p className="text-sm text-muted-foreground">
            Items with demand variation coefficient above this threshold will be classified as high variability.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="decoupling-threshold">Decoupling Point Threshold</Label>
            <span className="text-sm font-medium">{(decouplingThreshold * 100).toFixed(0)}%</span>
          </div>
          <Slider
            id="decoupling-threshold"
            min={0}
            max={1}
            step={0.01}
            value={[decouplingThreshold]}
            onValueChange={(values) => setDecouplingThreshold(values[0])}
            disabled={loading || isSaving}
          />
          <p className="text-sm text-muted-foreground">
            Supply chain locations with strategic importance above this threshold will be considered decoupling points.
          </p>
        </div>

        <Button 
          onClick={handleSaveThresholds} 
          className="w-full"
          disabled={loading || isSaving}
        >
          {isSaving ? "Saving..." : "Save Thresholds"}
        </Button>
      </CardContent>
    </Card>
  );
}
