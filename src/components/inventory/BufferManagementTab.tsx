
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BufferLevelManagement } from './BufferLevelManagement';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BufferFactorConfig } from '@/types/inventory';
import { bufferZoneFormulas } from '@/utils/inventoryUtils';

export const BufferManagementTab = () => {
  const [activeTab, setActiveTab] = useState('buffer-levels');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [bufferConfig, setBufferConfig] = useState<BufferFactorConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBufferConfig = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('buffer_factor_configs')
          .select('*')
          .eq('is_active', true)
          .single();

        if (error) throw error;

        if (data) {
          setBufferConfig({
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
            metadata: data.metadata || {}
          });
        }
      } catch (error) {
        console.error('Error fetching buffer config:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load buffer configuration",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBufferConfig();
  }, [toast]);

  const handleSaveConfig = async (config: BufferFactorConfig) => {
    try {
      // First deactivate all configs
      await supabase
        .from('buffer_factor_configs')
        .update({ is_active: false })
        .neq('id', config.id);

      // Then update or insert the new one
      if (config.id !== 'new') {
        await supabase
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
            is_active: true
          })
          .eq('id', config.id);
      } else {
        await supabase
          .from('buffer_factor_configs')
          .insert({
            short_lead_time_factor: config.shortLeadTimeFactor,
            medium_lead_time_factor: config.mediumLeadTimeFactor,
            long_lead_time_factor: config.longLeadTimeFactor,
            short_lead_time_threshold: config.shortLeadTimeThreshold,
            medium_lead_time_threshold: config.mediumLeadTimeThreshold,
            replenishment_time_factor: config.replenishmentTimeFactor,
            green_zone_factor: config.greenZoneFactor,
            description: config.description,
            is_active: true
          });
      }

      toast({
        title: "Success",
        description: "Buffer configuration saved successfully",
      });
      setConfigDialogOpen(false);
    } catch (error) {
      console.error('Error saving buffer config:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save buffer configuration",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Buffer Management</h3>
        <Button onClick={() => setConfigDialogOpen(true)}>Configure Buffer Factors</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="buffer-levels">Buffer Levels</TabsTrigger>
          <TabsTrigger value="formulas">Buffer Formulas</TabsTrigger>
          <TabsTrigger value="history">Buffer History</TabsTrigger>
        </TabsList>

        <TabsContent value="buffer-levels">
          <BufferLevelManagement />
        </TabsContent>

        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <CardTitle>Buffer Zone Calculation Formulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Red Zone</h4>
                  <p className="text-muted-foreground">{bufferZoneFormulas.redZone}</p>
                </div>
                <div>
                  <h4 className="font-medium">Yellow Zone</h4>
                  <p className="text-muted-foreground">{bufferZoneFormulas.yellowZone}</p>
                </div>
                <div>
                  <h4 className="font-medium">Green Zone</h4>
                  <p className="text-muted-foreground">{bufferZoneFormulas.greenZone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-xs whitespace-pre-wrap">
                    {bufferZoneFormulas.notes}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Buffer Adjustment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Buffer adjustment history will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buffer Configuration</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="short-lead-time-factor">Short Lead Time Factor</Label>
              <Input
                id="short-lead-time-factor"
                defaultValue={bufferConfig?.shortLeadTimeFactor || 0.7}
                type="number"
                step="0.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medium-lead-time-factor">Medium Lead Time Factor</Label>
              <Input
                id="medium-lead-time-factor"
                defaultValue={bufferConfig?.mediumLeadTimeFactor || 1.0}
                type="number"
                step="0.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="long-lead-time-factor">Long Lead Time Factor</Label>
              <Input
                id="long-lead-time-factor"
                defaultValue={bufferConfig?.longLeadTimeFactor || 1.3}
                type="number"
                step="0.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="green-zone-factor">Green Zone Factor</Label>
              <Input
                id="green-zone-factor"
                defaultValue={bufferConfig?.greenZoneFactor || 0.7}
                type="number"
                step="0.1"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => handleSaveConfig({
                id: bufferConfig?.id || 'new',
                shortLeadTimeFactor: parseFloat(
                  (document.getElementById('short-lead-time-factor') as HTMLInputElement).value
                ),
                mediumLeadTimeFactor: parseFloat(
                  (document.getElementById('medium-lead-time-factor') as HTMLInputElement).value
                ),
                longLeadTimeFactor: parseFloat(
                  (document.getElementById('long-lead-time-factor') as HTMLInputElement).value
                ),
                shortLeadTimeThreshold: bufferConfig?.shortLeadTimeThreshold || 7,
                mediumLeadTimeThreshold: bufferConfig?.mediumLeadTimeThreshold || 14,
                replenishmentTimeFactor: bufferConfig?.replenishmentTimeFactor || 1.0,
                greenZoneFactor: parseFloat(
                  (document.getElementById('green-zone-factor') as HTMLInputElement).value
                ),
                isActive: true,
                metadata: bufferConfig?.metadata || {}
              })}>
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
