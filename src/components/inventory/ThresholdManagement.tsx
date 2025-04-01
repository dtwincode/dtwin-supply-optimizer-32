
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ThresholdConfig {
  id: number;
  demand_variability_threshold: number;
  decoupling_threshold: number;
  updated_at: string;
  first_time_adjusted: boolean;
}

export function ThresholdManagement() {
  const [config, setConfig] = useState<ThresholdConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [demandVariabilityThreshold, setDemandVariabilityThreshold] = useState<number>(0.6);
  const [decouplingThreshold, setDecouplingThreshold] = useState<number>(0.75);
  const { toast } = useToast();

  useEffect(() => {
    fetchThresholdConfig();
  }, []);

  const fetchThresholdConfig = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('threshold_config')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setConfig(data);
        setDemandVariabilityThreshold(data.demand_variability_threshold);
        setDecouplingThreshold(data.decoupling_threshold);
      }
    } catch (error) {
      console.error('Error fetching threshold config:', error);
      toast({
        title: "Error",
        description: "Failed to load threshold configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveThresholdConfig = async () => {
    try {
      setIsSaving(true);

      if (config) {
        // Update existing config
        const { error } = await supabase
          .from('threshold_config')
          .update({
            demand_variability_threshold: demandVariabilityThreshold,
            decoupling_threshold: decouplingThreshold,
            first_time_adjusted: true
          })
          .eq('id', config.id);

        if (error) throw error;
      } else {
        // Create new config
        const { error } = await supabase
          .from('threshold_config')
          .insert({
            demand_variability_threshold: demandVariabilityThreshold,
            decoupling_threshold: decouplingThreshold,
            first_time_adjusted: true
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Threshold configuration has been saved.",
      });

      // Refresh the data
      fetchThresholdConfig();
    } catch (error) {
      console.error('Error saving threshold config:', error);
      toast({
        title: "Error",
        description: "Failed to save threshold configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Thresholds Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure thresholds that determine how inventory items are classified and when decoupling points are created.
                </p>
                
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="demandVariabilityThreshold">
                      Demand Variability Threshold
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        id="demandVariabilityThreshold"
                        type="number"
                        step="0.01"
                        min="0"
                        max="2"
                        value={demandVariabilityThreshold}
                        onChange={(e) => setDemandVariabilityThreshold(parseFloat(e.target.value))}
                      />
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">
                          Values &gt; {demandVariabilityThreshold} considered high variability
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="decouplingThreshold">
                      Decoupling Point Threshold
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        id="decouplingThreshold"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={decouplingThreshold}
                        onChange={(e) => setDecouplingThreshold(parseFloat(e.target.value))}
                      />
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">
                          Score &gt; {decouplingThreshold} creates decoupling point
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {config && (
                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date(config.updated_at).toLocaleString()}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={saveThresholdConfig} 
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Thresholds
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
