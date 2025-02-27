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
import { AlertTriangle, Info } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  strategic: "Strategic points (15-20% of network)",
  customer_order: "Customer order points (30-40% of network)",
  stock_point: "Stock points (40-50% of network)",
  intermediate: "Intermediate points (10-15% of network)"
};

const TYPE_RECOMMENDATIONS = {
  strategic: {
    description: "Main distribution centers and key hubs",
    criteria: [
      "Long lead times (>14 days)",
      "High demand aggregation",
      "Critical supply chain convergence points"
    ]
  },
  customer_order: {
    description: "Retail locations and direct customer fulfillment",
    criteria: [
      "Customer tolerance time < lead time",
      "High service level requirements",
      "Direct customer demand points"
    ]
  },
  stock_point: {
    description: "Warehouses and regional distribution points",
    criteria: [
      "Medium lead times (7-14 days)",
      "Regional demand aggregation",
      "Buffer against supply variability"
    ]
  },
  intermediate: {
    description: "Supporting locations between major nodes",
    criteria: [
      "Short lead times (<7 days)",
      "Protection against operational variability",
      "Process decoupling requirements"
    ]
  }
};

const INDUSTRY_BENCHMARKS = {
  strategic: 0.20, // 20% of total points
  customer_order: 0.35, // 35% of total points
  stock_point: 0.35, // 35% of total points
  intermediate: 0.10 // 10% of total points
};

export const DecouplingPointDialog = ({ locationId, onSuccess }: DecouplingPointDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bufferProfiles, setBufferProfiles] = React.useState<BufferProfile[]>([]);
  const [locations, setLocations] = React.useState<LocationWithHierarchy[]>([]);
  const [currentDistribution, setCurrentDistribution] = React.useState<Record<string, number>>({});
  const [formData, setFormData] = React.useState<Partial<DecouplingPoint>>({
    locationId,
    type: 'stock_point',
  });
  const [expandedType, setExpandedType] = React.useState<string | null>(null);

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
        .select('*')
        .eq('active', true);

      if (locationError) {
        console.error('Error fetching locations:', locationError);
        return;
      }

      const { data: decouplingPoints, error: dpError } = await supabase
        .from('decoupling_points')
        .select('type');

      if (!dpError && decouplingPoints) {
        const distribution = decouplingPoints.reduce((acc: Record<string, number>, point) => {
          acc[point.type] = (acc[point.type] || 0) + 1;
          return acc;
        }, {});
        setCurrentDistribution(distribution);
      }

      setBufferProfiles(profileData?.map(profile => ({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        variabilityFactor: profile.variability_factor,
        leadTimeFactor: profile.lead_time_factor,
        moq: profile.moq,
        lotSizeFactor: profile.lot_size_factor,
      })) || []);

      setLocations(locationData?.map(loc => ({
        id: loc.location_id,
        name: loc.location_description || loc.location_id,
        level: loc.hierarchy_level,
        parent_id: loc.parent_id,
        channel: loc.channel,
        city: loc.city,
        region: loc.region,
        warehouse: loc.warehouse
      })) || []);
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

  const getDistributionStatus = (type: keyof typeof INDUSTRY_BENCHMARKS) => {
    const total = Object.values(currentDistribution).reduce((sum, count) => sum + count, 0) || 1;
    const current = (currentDistribution[type] || 0) / total;
    const benchmark = INDUSTRY_BENCHMARKS[type];
    
    if (current <= benchmark) return "text-green-500";
    return "text-yellow-500";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Define Decoupling Point</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-xl mb-2">
                Strategic Decoupling Point
              </DialogTitle>
              <DialogDescription className="text-base">
                Select location and type to optimize your supply chain positioning
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="location" className="text-base font-medium block">Location</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}
                >
                  <SelectTrigger className="w-full h-auto min-h-[44px]">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id} className="py-2">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{location.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {location.city}, {location.region}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Point Type</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Position based on DDMRP strategic factors</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-3">
                  {Object.entries(TYPE_DESCRIPTIONS).map(([type, description]) => (
                    <div key={type} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between gap-4 cursor-pointer" 
                           onClick={() => setExpandedType(expandedType === type ? null : type)}>
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, type: type as DecouplingPoint['type'] }));
                            }}
                          >
                            <div className={`h-4 w-4 rounded-full border-2 ${formData.type === type ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                          </Button>
                          <span className="font-medium">{description}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={getDistributionStatus(type as keyof typeof INDUSTRY_BENCHMARKS)}>
                            {((currentDistribution[type] || 0) * 100).toFixed(1)}%
                          </Badge>
                          {expandedType === type ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      
                      {expandedType === type && (
                        <div className="mt-4 pl-9 space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {TYPE_RECOMMENDATIONS[type as keyof typeof TYPE_RECOMMENDATIONS].description}
                          </p>
                          <div>
                            <p className="text-sm font-medium mb-2">Key Criteria:</p>
                            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                              {TYPE_RECOMMENDATIONS[type as keyof typeof TYPE_RECOMMENDATIONS].criteria.map((criterion, idx) => (
                                <li key={idx}>{criterion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="bufferProfile" className="text-base font-medium block">Buffer Profile</Label>
                <Select
                  value={formData.bufferProfileId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bufferProfileId: value }))}
                >
                  <SelectTrigger className="w-full h-auto min-h-[44px]">
                    <SelectValue placeholder="Select buffer profile" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {bufferProfiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id} className="py-2">
                        <div className="flex flex-col gap-1">
                          <div className="font-medium">{profile.name}</div>
                          {profile.description && (
                            <div className="text-sm text-muted-foreground">
                              {profile.description}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="description" className="text-base font-medium block">Strategic Rationale</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Document the strategic reasoning..."
                  className="h-20 resize-none"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-11">
                {isSubmitting ? "Creating..." : "Create Decoupling Point"}
              </Button>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
