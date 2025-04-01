
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";

export function ThresholdManagement() {
  const [demandVariabilityThreshold, setDemandVariabilityThreshold] = useState(60);
  const [decouplingThreshold, setDecouplingThreshold] = useState(75);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch threshold values from database
  useEffect(() => {
    const fetchThresholds = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('threshold_config')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching thresholds:', error);
          throw error;
        }

        if (data && data.length > 0) {
          setDemandVariabilityThreshold(Math.round(data[0].demand_variability_threshold * 100));
          setDecouplingThreshold(Math.round(data[0].decoupling_threshold * 100));
        }
      } catch (err) {
        console.error('Failed to fetch threshold values:', err);
        toast({
          variant: "destructive",
          title: "Failed to load thresholds",
          description: "Could not load threshold configuration values."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchThresholds();
  }, [toast]);

  // Update threshold values in database
  const handleSaveThresholds = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('threshold_config')
        .update({
          demand_variability_threshold: demandVariabilityThreshold / 100,
          decoupling_threshold: decouplingThreshold / 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (error) {
        console.error('Error updating thresholds:', error);
        
        // Try inserting if update failed (might be first time setup)
        const { error: insertError } = await supabase
          .from('threshold_config')
          .insert({
            demand_variability_threshold: demandVariabilityThreshold / 100,
            decoupling_threshold: decouplingThreshold / 100,
            first_time_adjusted: true
          });
          
        if (insertError) {
          console.error('Error inserting thresholds:', insertError);
          throw insertError;
        }
      }

      toast({
        title: "Thresholds Updated",
        description: "Threshold values have been saved successfully."
      });
    } catch (err) {
      console.error('Failed to update threshold values:', err);
      toast({
        variant: "destructive",
        title: "Failed to update thresholds",
        description: "Could not save threshold configuration values."
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Classification Thresholds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="demand-variability-threshold">
                Demand Variability Threshold
              </Label>
              <span className="text-sm font-medium">{demandVariabilityThreshold}%</span>
            </div>
            <Slider
              id="demand-variability-threshold"
              disabled={loading}
              value={[demandVariabilityThreshold]}
              onValueChange={(values) => setDemandVariabilityThreshold(values[0])}
              min={0}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Items with variability above this threshold will be classified as high variability.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="decoupling-threshold">
                Decoupling Point Threshold
              </Label>
              <span className="text-sm font-medium">{decouplingThreshold}%</span>
            </div>
            <Slider
              id="decoupling-threshold"
              disabled={loading}
              value={[decouplingThreshold]}
              onValueChange={(values) => setDecouplingThreshold(values[0])}
              min={0}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Locations with lead time variability above this threshold are candidates for decoupling points.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveThresholds} 
              disabled={loading || updating}
            >
              {updating ? "Saving..." : "Save Thresholds"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
