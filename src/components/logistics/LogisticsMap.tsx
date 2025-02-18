
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface Location {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: string;
  priority: string;
}

const logisticsLocations: Location[] = [
  {
    id: "po001",
    name: "PO-001 from Supplier A",
    coordinates: { lat: 24.7136, lng: 46.6753 },
    status: "in-transit",
    priority: "high"
  },
  {
    id: "po002",
    name: "PO-002 from Supplier B",
    coordinates: { lat: 21.5433, lng: 39.1728 },
    status: "delayed",
    priority: "medium"
  },
  {
    id: "po003",
    name: "PO-003 from Supplier C",
    coordinates: { lat: 26.4207, lng: 50.0888 },
    status: "processing",
    priority: "low"
  }
];

export const LogisticsMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [locations] = React.useState<Location[]>(logisticsLocations);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        console.log("Starting map initialization...");
        
        const { data: secret, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .maybeSingle();

        console.log("Supabase query response:", { 
          hasData: !!secret,
          data: secret,
          error: secretError
        });

        if (secretError) {
          console.error("Failed to fetch Mapbox token:", secretError);
          throw new Error(`Failed to fetch token: ${secretError.message}`);
        }

        if (!secret) {
          console.error("No Mapbox token found in secrets table");
          throw new Error('Mapbox token not found. Please ensure it is set in Supabase.');
        }

        const token = secret.value;
        console.log("Retrieved token starting with:", token.substring(0, 10) + "...");
        
        if (!token.startsWith('pk.')) {
          console.error("Invalid token format detected");
          throw new Error('Invalid Mapbox public token format.');
        }

        if (!mapContainer.current) {
          throw new Error('Map container not found');
        }

        mapboxgl.accessToken = token;
        console.log("Mapbox token set successfully");

        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [45.0792, 23.8859],
          zoom: 5,
          attributionControl: false
        });

        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        newMap.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

        newMap.on('load', () => {
          if (!isMounted) return;
          
          console.log("Map loaded, adding markers...");
          
          locations.forEach(location => {
            const marker = document.createElement('div');
            marker.className = 'rounded-full';
            marker.style.backgroundColor = getStatusColor(location.status);
            marker.style.width = '12px';
            marker.style.height = '12px';
            marker.style.border = '2px solid white';
            marker.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.1)';

            new mapboxgl.Marker(marker)
              .setLngLat([location.coordinates.lng, location.coordinates.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <div class="p-2">
                      <h3 class="font-medium">${location.name}</h3>
                      <p class="text-sm text-gray-500">Status: ${location.status}</p>
                      <p class="text-sm text-gray-500">Priority: ${location.priority}</p>
                    </div>
                  `)
              )
              .addTo(newMap);
          });

          if (isMounted) {
            setIsLoading(false);
          }
        });

        newMap.on('error', (e) => {
          console.error('Map error:', e);
          if (isMounted) {
            setError(`Map error: ${e.error.message}`);
            toast({
              title: "Map Error",
              description: e.error.message,
              variant: "destructive",
            });
          }
        });

        map.current = newMap;

      } catch (err) {
        console.error("Map initialization failed:", err);
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to initialize map';
          setError(errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in-transit':
        return '#3b82f6'; // blue
      case 'delayed':
        return '#ef4444'; // red
      case 'processing':
        return '#f59e0b'; // amber
      default:
        return '#a855f7'; // purple
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Tracking Map</h3>
        <div className="h-[400px] relative rounded-lg overflow-hidden bg-gray-50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-center p-4">{error}</div>
            </div>
          ) : (
            <div ref={mapContainer} className="absolute inset-0" />
          )}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>In Transit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

