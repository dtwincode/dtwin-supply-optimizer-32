
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

// Sample data for Saudi Arabia locations
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
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !locations.length || !mapboxToken || isMapInitialized) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [45.0792, 23.8859], // Center of Saudi Arabia
        zoom: 5
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        if (!map.current) return;

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

        setIsMapInitialized(true);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    if (map.current) {
      map.current.remove();
      setIsMapInitialized(false);
    }
    initializeMap();
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, locations]);

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

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Supply Chain Network</h3>
        {!mapboxToken ? (
          <div className="mb-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Please enter your Mapbox public token to view the map. You can get one at{' '}
              <a 
                href="https://www.mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                mapbox.com
              </a>
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your Mapbox token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => initializeMap()}>
                Load Map
              </Button>
            </div>
          </div>
        ) : null}
        <div className="h-[400px] relative rounded-lg overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
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
