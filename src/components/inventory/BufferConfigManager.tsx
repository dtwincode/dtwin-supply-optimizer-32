
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { BufferFactorConfig, IndustryType } from '@/types/inventory';
import { supabase } from "@/integrations/supabase/client";

interface BufferFactorBenchmark {
  industry: IndustryType;
  short_lead_time_factor: number;
  medium_lead_time_factor: number;
  long_lead_time_factor: number;
  green_zone_factor: number;
  description: string;
}

export const BufferConfigManager = () => {
  const [config, setConfig] = useState<BufferFactorConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [benchmarks, setBenchmarks] = useState<BufferFactorBenchmark[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | ''>('');
  const [useBenchmark, setUseBenchmark] = useState(false);

  useEffect(() => {
    loadActiveConfig();
    loadBenchmarks();
  }, []);

  const loadBenchmarks = async () => {
    const { data, error } = await supabase
      .from('buffer_factor_benchmarks')
      .select('*');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load industry benchmarks",
        variant: "destructive",
      });
      return;
    }

    setBenchmarks(data);
  };

  const loadActiveConfig = async () => {
    const { data, error } = await supabase
      .from('buffer_factor_configs')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load buffer configuration",
        variant: "destructive",
      });
      return;
    }

    // Ensure metadata is an object or default to empty object
    const metadata = typeof data.metadata === 'object' && data.metadata !== null 
      ? data.metadata as Record<string, any>
      : {};

    const configData: BufferFactorConfig = {
      id: data.id,
      shortLeadTimeFactor: data.short_lead_time_factor,
      mediumLeadTimeFactor: data.medium_lead_time_factor,
      longLeadTimeFactor: data.long_lead_time_factor,
      shortLeadTimeThreshold: data.short_lead_time_threshold,
      mediumLeadTimeThreshold: data.medium_lead_time_threshold,
      replenishmentTimeFactor: data.replenishment_time_factor,
      greenZoneFactor: data.green_zone_factor,
      description: data.description,
      isActive: data.is_active,
      industry: data.industry,
      isBenchmarkBased: data.is_benchmark_based,
      metadata: metadata
    };

    setConfig(configData);
    setUseBenchmark(data.is_benchmark_based || false);
    if (data.industry) {
      setSelectedIndustry(data.industry);
    }
  };

  const handleIndustryChange = (industry: IndustryType) => {
    setSelectedIndustry(industry);
    const benchmark = benchmarks.find(b => b.industry === industry);
    if (benchmark && config) {
      setConfig({
        ...config,
        shortLeadTimeFactor: benchmark.short_lead_time_factor,
        mediumLeadTimeFactor: benchmark.medium_lead_time_factor,
        longLeadTimeFactor: benchmark.long_lead_time_factor,
        greenZoneFactor: benchmark.green_zone_factor,
        industry: industry,
        isBenchmarkBased: true
      });
    }
  };

  const handleSave = async () => {
    if (!config) return;

    const { error } = await supabase
      .from('buffer_factor_configs')
      .update({
        short_lead_time_factor: config.shortLeadTimeFactor,
        medium_lead_time_factor: config.mediumLeadTimeFactor,
        long_lead_time_factor: config.longLeadTimeFactor,
        short_lead_time_threshold: config.shortLeadTimeThreshold,
        medium_lead_time_threshold: config.mediumLeadTimeThreshold,
        replenishment_time_factor: config.replenishmentTimeFactor,
        green_zone_factor: config.greenZoneFactor,
        description: config.description,
        industry: selectedIndustry || null,
        is_benchmark_based: useBenchmark
      })
      .eq('id', config.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save buffer configuration",
        variant: "destructive",
      });
      return;
    }

    setIsEditing(false);
    toast({
      title: "Success",
      description: "Buffer configuration updated successfully",
    });
  };

  if (!config) return null;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Buffer Configuration</h3>
          {isEditing ? (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Configuration</Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={useBenchmark}
              onCheckedChange={setUseBenchmark}
              disabled={!isEditing}
            />
            <Label>Use Industry Benchmark</Label>
          </div>

          {useBenchmark && (
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select
                value={selectedIndustry}
                onValueChange={handleIndustryChange}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {benchmarks.map((benchmark) => (
                    <SelectItem key={benchmark.industry} value={benchmark.industry}>
                      {benchmark.industry.charAt(0).toUpperCase() + benchmark.industry.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Lead Time Factors</h4>
              <div className="space-y-2">
                <Label>Short Lead Time (≤ {config.shortLeadTimeThreshold} days)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.shortLeadTimeFactor}
                  onChange={(e) => setConfig({
                    ...config,
                    shortLeadTimeFactor: parseFloat(e.target.value)
                  })}
                  disabled={!isEditing || useBenchmark}
                />
              </div>
              <div className="space-y-2">
                <Label>Medium Lead Time (≤ {config.mediumLeadTimeThreshold} days)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.mediumLeadTimeFactor}
                  onChange={(e) => setConfig({
                    ...config,
                    mediumLeadTimeFactor: parseFloat(e.target.value)
                  })}
                  disabled={!isEditing || useBenchmark}
                />
              </div>
              <div className="space-y-2">
                <Label>Long Lead Time Factor</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.longLeadTimeFactor}
                  onChange={(e) => setConfig({
                    ...config,
                    longLeadTimeFactor: parseFloat(e.target.value)
                  })}
                  disabled={!isEditing || useBenchmark}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Zone Factors</h4>
              <div className="space-y-2">
                <Label>Replenishment Time Factor</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.replenishmentTimeFactor}
                  onChange={(e) => setConfig({
                    ...config,
                    replenishmentTimeFactor: parseFloat(e.target.value)
                  })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Green Zone Factor</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.greenZoneFactor}
                  onChange={(e) => setConfig({
                    ...config,
                    greenZoneFactor: parseFloat(e.target.value)
                  })}
                  disabled={!isEditing || useBenchmark}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={config.description || ''}
              onChange={(e) => setConfig({
                ...config,
                description: e.target.value
              })}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
