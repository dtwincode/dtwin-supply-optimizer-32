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
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function initializeMapWithToken() {
      try {
        setIsLoading(true);
        console.log('Starting map initialization...');
        
        // Add a small delay to ensure everything is properly loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Debug: Check if we can access the secrets table
        const { count, error: countError } = await supabase
          .from('secrets')
          .select('*', { count: 'exact', head: true });
          
        console.log('Secrets table access check:', { count, error: countError });

        if (countError) {
          console.error('Error accessing secrets table:', countError);
          throw new Error('Cannot access secrets table');
        }

        // Try to get the Mapbox token
        const { data: token, error: tokenError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .maybeSingle();

        console.log('Mapbox token query result:', {
          hasToken: !!token,
          error: tokenError
        });

        if (tokenError) {
          console.error('Token fetch error:', tokenError);
          throw new Error('Failed to fetch Mapbox token');
        }

        if (!token?.value) {
          console.error('No Mapbox token found in secrets');
          throw new Error('Mapbox token not found');
        }

        if (!mapContainer.current || !locations.length || isMapInitialized) {
          console.log('Initialization conditions not met:', {
            hasContainer: !!mapContainer.current,
            hasLocations: locations.length > 0,
            isInitialized: isMapInitialized
          });
          return;
        }

        console.log('Setting up Mapbox with token...');
        mapboxgl.accessToken = token.value;
        
        console.log('Creating map instance...');
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [45.0792, 23.8859], // Center of Saudi Arabia
          zoom: 5,
          transformRequest: (url, resourceType) => {
            console.log('Mapbox transform request:', { url, resourceType });
            return { url };
          }
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Handle map errors
        map.current.on('error', (e) => {
          console.error('Mapbox map error:', e);
          setError("An error occurred while loading the map");
          toast({
            title: "Error",
            description: "Map loading failed",
            variant: "destructive",
          });
        });

        map.current.on('load', () => {
          if (!map.current) return;
          console.log('Map loaded successfully');

          // Add markers and connections
          locations.forEach(location => {
            if (!location.coordinates) return;

            // Create a custom marker element
            const marker = document.createElement('div');
            marker.className = 'p-2 rounded-full';
            marker.style.backgroundColor = getLocationColor(location.type);
            marker.style.width = '12px';
            marker.style.height = '12px';
            marker.style.border = '2px solid white';
            marker.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.1)';

            // Add the marker to the map
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
              .addTo(map.current);

            // Draw connections to parent locations
            if (location.parent_id) {
              const parentLocation = locations.find(loc => loc.id === location.parent_id);
              if (parentLocation?.coordinates) {
                const lineId = `line-${location.id}-${parentLocation.id}`;
                
                map.current.addSource(lineId, {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: [
                        [location.coordinates.lng, location.coordinates.lat],
                        [parentLocation.coordinates.lng, parentLocation.coordinates.lat]
                      ]
                    }
                  }
                });

                map.current.addLayer({
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

          console.log('All markers and connections added');
          setIsMapInitialized(true);
          setIsLoading(false);
        });

      } catch (error) {
        console.error('Map initialization error:', error);
        setError(error instanceof Error ? error.message : "An error occurred while loading the map");
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to initialize map",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }

    initializeMapWithToken();
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations, isMapInitialized, toast]);

  const getLocationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'distribution':
        return '#ef4444'; // Red
      case 'wholesale':
        return '#3b82f6'; // Blue
      case 'retail':
        return '#22c55e'; // Green
      default:
        return '#a855f7'; // Purple
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Supply Chain Network</h3>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[400px] relative rounded-lg overflow-hidden">
            <div ref={mapContainer} className="absolute inset-0" />
          </div>
        )}
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
