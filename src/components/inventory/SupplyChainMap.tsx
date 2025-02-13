
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

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

export const SupplyChainMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [locations, setLocations] = React.useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('location_hierarchy')
        .select('location_id, location_description, coordinates, channel, hierarchy_level, parent_id')
        .eq('active', true);

      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }

      setLocations(data.map(loc => ({
        id: loc.location_id,
        name: loc.location_description || loc.location_id,
        coordinates: loc.coordinates,
        type: loc.channel,
        level: loc.hierarchy_level,
        parent_id: loc.parent_id
      })));
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !locations.length) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHR3bXB3b3UwMGRpMmltbGx6OWh4azd6In0.O9UxKUWGkFnmFGPS36Cisw';
    
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
    });

    return () => {
      map.current?.remove();
    };
  }, [locations]);

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
