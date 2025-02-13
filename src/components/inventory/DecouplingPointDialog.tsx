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
  strategic: "Strategic points (15-20% of nodes)",
  customer_order: "Customer order points (30-40%)",
  stock_point: "Stock points (40-50%)",
  intermediate: "Intermediate points (10-15%)"
};

export const DecouplingPointDialog = ({ locationId, onSuccess }: DecouplingPointDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bufferProfiles, setBufferProfiles] = React.useState<BufferProfile[]>([]);
  const [locations, setLocations] = React.useState<Array<{id: string, name: string}>>([]);
  const [formData, setFormData] = React.useState<Partial<DecouplingPoint>>({
    locationId,
    type: 'stock_point',
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const { data: profileData, error: profileError } = await supabase
        .from('buffer_profiles')
        .select('*');

      if (profileError) {
        console.error('Error fetching buffer profiles:', profileError);
        return;
      }

      const { data: locationData, error: locationError } = await supabase
        .from('location_hierarchy')
        .select('location_id, location_description')
        .eq('active', true);

      if (locationError) {
        console.error('Error fetching locations:', locationError);
        return;
      }

      setBufferProfiles(profileData.map(profile => ({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        variabilityFactor: profile.variability_factor,
        leadTimeFactor: profile.lead_time_factor,
        moq: profile.moq,
        lotSizeFactor: profile.lot_size_factor,
      })));

      setLocations(locationData.map(loc => ({
        id: loc.location_id,
        name: loc.location_description || loc.location_id,
      })));
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bufferProfileId || !formData.locationId) {
      toast({
        title: "Error",
        description: "Please select both a location and a buffer profile",
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Define Decoupling Point</DialogTitle>
          <DialogDescription>
            Configure a decoupling point based on supply chain benchmarks.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="default" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Consider placement impact on inventory positioning
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as DecouplingPoint['type'] }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_DESCRIPTIONS).map(([type, description]) => (
                  <SelectItem key={type} value={type}>
                    {description}
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select buffer profile" />
              </SelectTrigger>
              <SelectContent>
                {bufferProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name} ({profile.variabilityFactor}, {profile.leadTimeFactor})
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
              className="h-20 resize-none"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Decoupling Point"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
