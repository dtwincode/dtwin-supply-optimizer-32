
import React, { useEffect, useState } from 'react';
import { BaseMap } from '../shared/maps/BaseMap';
import { createMapMarker } from '../shared/maps/MapMarker';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DecouplingPoint } from '@/types/inventory';
import type { Map } from 'mapbox-gl';

interface Location {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
  coordinates: {
    lat: number;
    lng: number;
  };
  channel: string;
  city: string;
  region: string;
  warehouse: string;
  decoupling_point?: {
    type: DecouplingPoint['type'];
    buffer_profile_id: string;
  };
}

const DECOUPLING_COLORS = {
  strategic: '#ef4444', // Red for strategic points
  customer_order: '#3b82f6', // Blue for customer order points
  stock_point: '#22c55e', // Green for stock points
  intermediate: '#a855f7' // Purple for intermediate points
};

const TYPE_DESCRIPTIONS = {
  strategic: "Strategic points (15-20% of network)",
  customer_order: "Customer order points (30-40% of network)",
  stock_point: "Stock points (40-50% of network)",
  intermediate: "Intermediate points (10-15% of network)"
};

export const NetworkDecouplingMap = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [map, setMap] = useState<Map | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('location_hierarchy')
          .select(`
            location_id,
            location_description,
            hierarchy_level,
            parent_id,
            coordinates,
            channel,
            city,
            region,
            warehouse,
            decoupling_points (
              type,
              buffer_profile_id
            )
          `)
          .eq('active', true);

        if (error) throw error;

        const formattedLocations = data.map(loc => ({
          id: loc.location_id,
          name: loc.location_description || loc.location_id,
          level: loc.hierarchy_level,
          parent_id: loc.parent_id,
          coordinates: loc.coordinates,
          channel: loc.channel,
          city: loc.city,
          region: loc.region,
          warehouse: loc.warehouse,
          decoupling_point: loc.decoupling_points?.[0]
        }));

        setLocations(formattedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch location data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [toast]);

  const handleMapLoad = (mapInstance: Map) => {
    setMap(mapInstance);
    
    // Add location markers
    locations.forEach(location => {
      if (!location.coordinates) return;

      const color = location.decoupling_point 
        ? DECOUPLING_COLORS[location.decoupling_point.type]
        : '#666666';

      const popupContent = `
        <div class="p-2">
          <div class="font-medium">${location.name}</div>
          <div class="text-sm text-gray-500">
            Level ${location.level} • ${location.channel}<br/>
            ${location.city}, ${location.region}
          </div>
          ${location.decoupling_point ? `
            <div class="mt-1 text-sm">
              <span class="font-medium">Decoupling Point:</span> 
              ${TYPE_DESCRIPTIONS[location.decoupling_point.type]}
            </div>
          ` : ''}
        </div>
      `;

      createMapMarker({
        map: mapInstance,
        coordinates: [location.coordinates.lng, location.coordinates.lat],
        color,
        popupContent
      });

      // Draw connections between parent and child locations
      if (location.parent_id) {
        const parent = locations.find(l => l.id === location.parent_id);
        if (parent?.coordinates) {
          const lineId = `line-${location.id}`;
          
          mapInstance.addSource(lineId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [location.coordinates.lng, location.coordinates.lat],
                  [parent.coordinates.lng, parent.coordinates.lat]
                ]
              }
            }
          });

          mapInstance.addLayer({
            id: lineId,
            type: 'line',
            source: lineId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#888',
              'line-width': 1,
              'line-dasharray': [2, 1]
            }
          });
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Supply Chain Network</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                Network Guide
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-80">
              <div className="space-y-2">
                <p className="font-medium">Decoupling Point Types:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(DECOUPLING_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="rounded-lg border">
        <BaseMap 
          onMapLoad={handleMapLoad}
          className="h-[600px]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(TYPE_DESCRIPTIONS).map(([type, description]) => (
          <Badge
            key={type}
            variant="outline"
            className="flex items-center gap-2"
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: DECOUPLING_COLORS[type as keyof typeof DECOUPLING_COLORS] }} 
            />
            {description}
          </Badge>
        ))}
      </div>
    </div>
  );
};
