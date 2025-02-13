
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface LocationWithHierarchy {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
  channel: string;
  city: string;
  region: string;
  warehouse: string;
}

interface DecouplingPointDialogProps {
  locationId: string;
  onSuccess?: () => void;
}

const TYPE_DESCRIPTIONS = {
  strategic: "Strategic points (15-20%)",
  customer_order: "Customer order points (30-40%)",
  stock_point: "Stock points (40-50%)",
  intermediate: "Intermediate points (10-15%)"
};

const TYPE_RECOMMENDATIONS = {
  strategic: "Ideal for main distribution centers and key hubs",
  customer_order: "Best for retail locations and direct customer fulfillment",
  stock_point: "Suitable for warehouses and regional distribution points",
  intermediate: "For supporting locations between major nodes"
};

export const DecouplingPointDialog = ({ locationId, onSuccess }: DecouplingPointDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bufferProfiles, setBufferProfiles] = React.useState<BufferProfile[]>([]);
  const [locations, setLocations] = React.useState<LocationWithHierarchy[]>([]);
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
        .select('location_id, location_description, hierarchy_level, parent_id, channel, city, region, warehouse')
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
        level: loc.hierarchy_level,
        parent_id: loc.parent_id,
        channel: loc.channel,
        city: loc.city,
        region: loc.region,
        warehouse: loc.warehouse
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

  const getLocationDetails = (location: LocationWithHierarchy) => {
    const parentLocation = location.parent_id 
      ? locations.find(l => l.id === location.parent_id)
      : null;

    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          <span>{location.name}</span>
          <Badge variant="outline" className="text-xs">
            Level {location.level}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {location.channel}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {location.city}, {location.region} • {location.warehouse}
          {parentLocation && (
            <span className="block">
              Reports to: {parentLocation.name}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Define Decoupling Point</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-4">
            <DialogHeader className="space-y-1.5">
              <DialogTitle>Define Decoupling Point</DialogTitle>
              <DialogDescription>
                Configure a decoupling point based on supply chain benchmarks.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="default" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Consider placement impact on inventory positioning
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {getLocationDetails(location)}
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_DESCRIPTIONS).map(([type, description]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex flex-col space-y-1">
                          <div>{description}</div>
                          <div className="text-xs text-muted-foreground">
                            {TYPE_RECOMMENDATIONS[type as keyof typeof TYPE_RECOMMENDATIONS]}
                          </div>
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
                        <div className="flex flex-col space-y-1">
                          <div>{profile.name}</div>
                          {profile.description && (
                            <div className="text-xs text-muted-foreground">
                              {profile.description}
                            </div>
                          )}
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
                  className="h-20 resize-none"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create Decoupling Point"}
              </Button>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
