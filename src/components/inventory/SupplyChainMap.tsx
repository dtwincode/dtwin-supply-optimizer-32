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
  type: string;
  level: number;
  parent_id: string | null;
}

const sampleLocations: Location[] = [
  {
    id: "riyadh_dc",
    name: "Riyadh Distribution Center",
    coordinates: { lat: 24.7136, lng: 46.6753 },
    type: "distribution",
    level: 1,
    parent_id: null
  },
  {
    id: "jeddah_dc",
    name: "Jeddah Distribution Center",
    coordinates: { lat: 21.5433, lng: 39.1728 },
    type: "distribution",
    level: 1,
    parent_id: null
  },
  {
    id: "dammam_ws",
    name: "Dammam Wholesale",
    coordinates: { lat: 26.4207, lng: 50.0888 },
    type: "wholesale",
    level: 2,
    parent_id: "riyadh_dc"
  },
  {
    id: "mecca_ws",
    name: "Mecca Wholesale",
    coordinates: { lat: 21.3891, lng: 39.8579 },
    type: "wholesale",
    level: 2,
    parent_id: "jeddah_dc"
  },
  {
    id: "medina_rt",
    name: "Medina Retail Store",
    coordinates: { lat: 24.5247, lng: 39.5692 },
    type: "retail",
    level: 3,
    parent_id: "mecca_ws"
  },
  {
    id: "taif_rt",
    name: "Taif Retail Store",
    coordinates: { lat: 21.4375, lng: 40.5125 },
    type: "retail",
    level: 3,
    parent_id: "mecca_ws"
  }
];

export const SupplyChainMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [locations] = React.useState<Location[]>(sampleLocations);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        console.log("Starting map initialization...");
        
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('*')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .single();

        if (secretError) {
          console.error("Secret fetch error:", secretError);
          throw new Error(`Failed to fetch Mapbox token: ${secretError.message}`);
        }

        if (!secretData) {
          console.error("No Mapbox token found in database");
          throw new Error('Mapbox token not found in database. Please ensure it is set in Supabase.');
        }

        const token = secretData.value;
        
        if (!token || typeof token !== 'string') {
          console.error("Invalid token format:", { tokenType: typeof token });
          throw new Error('Invalid Mapbox token format.');
        }

        if (!token.startsWith('pk.')) {
          console.error("Token validation failed: doesn't start with 'pk.'");
          throw new Error('Invalid Mapbox public token format. Token should start with "pk."');
        }

        console.log("Mapbox token validation passed");

        if (!mapContainer.current) {
          throw new Error('Map container element not found in DOM');
        }

        mapboxgl.accessToken = token;

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
          
          console.log("Map loaded successfully, adding markers...");
          
          locations.forEach(location => {
            const marker = document.createElement('div');
            marker.className = 'rounded-full';
            marker.style.backgroundColor = getLocationColor(location.type);
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
                      <p class="text-sm text-gray-500">${location.type}</p>
                    </div>
                  `)
              )
              .addTo(newMap);

            if (location.parent_id) {
              const parent = locations.find(l => l.id === location.parent_id);
              if (parent) {
                const lineId = `line-${location.id}`;
                newMap.addSource(lineId, {
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

                newMap.addLayer({
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

          if (isMounted) {
            setIsLoading(false);
            console.log("Map initialization completed successfully");
          }
        });

        newMap.on('error', (e) => {
          console.error('Mapbox error:', e);
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

  const getLocationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'distribution':
        return '#ef4444';
      case 'wholesale':
        return '#3b82f6';
      case 'retail':
        return '#22c55e';
      default:
        return '#a855f7';
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Supply Chain Network</h3>
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
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Distribution Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Wholesale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Retail</span>
          </div>
        </div>
      </div>
    </div>
  );
};
