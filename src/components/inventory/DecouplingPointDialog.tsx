
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BufferProfile, DecouplingPoint } from '@/types/inventory';
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DecouplingPointDialogProps {
  locationId: string;
  onSuccess?: () => void;
}

const TYPE_DESCRIPTIONS = {
  strategic: "Strategic points act as major inventory hubs. Benchmark: 15-20% of total network nodes.",
  customer_order: "Customer order points serve direct demand. Benchmark: 30-40% of customer-facing locations.",
  stock_point: "Stock points maintain optimal inventory levels. Benchmark: 40-50% of distribution nodes.",
  intermediate: "Intermediate points support internal operations. Benchmark: 10-15% of manufacturing nodes."
};

export const DecouplingPointDialog = ({ locationId, onSuccess }: DecouplingPointDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bufferProfiles, setBufferProfiles] = React.useState<BufferProfile[]>([]);
  const [formData, setFormData] = React.useState<Partial<DecouplingPoint>>({
    locationId,
    type: 'stock_point',
  });

  React.useEffect(() => {
    const fetchBufferProfiles = async () => {
      const { data, error } = await supabase
        .from('buffer_profiles')
        .select('*');

      if (error) {
        console.error('Error fetching buffer profiles:', error);
        return;
      }

      // Map the database response to match our BufferProfile interface
      const mappedProfiles: BufferProfile[] = data.map(profile => ({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        variabilityFactor: profile.variability_factor,
        leadTimeFactor: profile.lead_time_factor,
        moq: profile.moq,
        lotSizeFactor: profile.lot_size_factor,
      }));

      setBufferProfiles(mappedProfiles);
    };

    fetchBufferProfiles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bufferProfileId) {
      toast({
        title: "Error",
        description: "Please select a buffer profile",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('decoupling_points')
        .insert({
          location_id: formData.locationId,
          type: formData.type,
          description: formData.description,
          buffer_profile_id: formData.bufferProfileId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Decoupling point created successfully",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating decoupling point:', error);
      toast({
        title: "Error",
        description: "Failed to create decoupling point",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Define Decoupling Point</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Define Decoupling Point</DialogTitle>
          <DialogDescription>
            Configure a decoupling point based on supply chain benchmarks and best practices.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Carefully consider the placement of decoupling points as they significantly impact inventory positioning and service levels.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as DecouplingPoint['type'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_DESCRIPTIONS).map(([type, description]) => (
                  <SelectItem key={type} value={type}>
                    <div>
                      <div className="font-medium">{type.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-sm text-muted-foreground">{description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bufferProfile">Buffer Profile</Label>
            <Select
              value={formData.bufferProfileId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, bufferProfileId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select buffer profile" />
              </SelectTrigger>
              <SelectContent>
                {bufferProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div>
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Variability: {profile.variabilityFactor.replace('_', ' ')}, 
                        Lead Time: {profile.leadTimeFactor}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description & Rationale</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Explain the rationale for this decoupling point placement..."
              className="h-24"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Decoupling Point"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
