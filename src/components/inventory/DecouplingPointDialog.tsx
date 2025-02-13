
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface DecouplingPointDialogProps {
  locationId: string;
  onSuccess?: () => void;
}

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Define Decoupling Point</DialogTitle>
        </DialogHeader>
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
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="customer_order">Customer Order</SelectItem>
                <SelectItem value="stock_point">Stock Point</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
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
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description..."
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
