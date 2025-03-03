
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { BaseMap } from '@/components/shared/maps/BaseMap';

export const LogisticsMap = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const routeSourceAddedRef = useRef<boolean>(false);
  const { trackingData } = useLogisticsTracking();

  const addRoute = async (mapInstance: mapboxgl.Map, start: [number, number], end: [number, number]) => {
    try {
      // Wait for the map to be fully loaded
      if (!mapInstance.isStyleLoaded()) {
        console.log('Map style not fully loaded yet, waiting...');
        return;
      }

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const json = await query.json();
      
      if (!json.routes || json.routes.length === 0) {
        console.error('No routes found in the response:', json);
        return;
      }
      
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Check if the map still exists and has the source
      if (!mapInstance || !mapInstance.getStyle()) {
        console.log('Map instance or style no longer available');
        return;
      }

      // Check if the 'route' source already exists with proper error handling
      let sourceExists = false;
      try {
        sourceExists = !!mapInstance.getSource('route');
      } catch (e) {
        console.log('Error checking for route source, assuming it does not exist', e);
      }

      if (sourceExists && routeSourceAddedRef.current) {
        // Update existing source
        try {
          (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
        } catch (err) {
          console.error('Error updating route source:', err);
        }
      } else {
        // Only add the source and layer if not already added
        try {
          // First add the source
          mapInstance.addSource('route', {
            type: 'geojson',
            data: geojson as any
          });
          
          // Then add the layer that uses this source
          mapInstance.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.75
            }
          });
          
          routeSourceAddedRef.current = true;
        } catch (err) {
          console.error('Error adding route source or layer:', err);
        }
      }

      // Add start marker (Riyadh hub) only once
      if (!mapInstance.getLayer('start-marker')) {
        try {
          new mapboxgl.Marker({ color: '#22c55e' })
            .setLngLat(start)
            .setPopup(new mapboxgl.Popup().setHTML('<h3>Distribution Hub</h3><p>Riyadh</p>'))
            .addTo(mapInstance);
        } catch (err) {
          console.error('Error adding start marker:', err);
        }
      }

      // Fit map to show entire route with proper error handling
      try {
        const coordinates = route;
        const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
          return bounds.extend(coord as mapboxgl.LngLatLike);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        mapInstance.fitBounds(bounds, {
          padding: 50,
          duration: 1000 // Smooth animation
        });
      } catch (err) {
        console.error('Error fitting bounds:', err);
      }
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    console.log('Map loaded successfully');
    setMap(loadedMap);
    
    // Wait for the style to fully load before attempting to modify the map
    loadedMap.on('style.load', () => {
      console.log('Map style loaded');
      renderTrackingData(loadedMap);
    });
  };

  const renderTrackingData = (mapInstance: mapboxgl.Map) => {
    // If no tracking data, center on Saudi Arabia
    if (!trackingData) {
      mapInstance.flyTo({
        center: [45.0792, 23.8859], // Center of Saudi Arabia
        zoom: 5,
        essential: true
      });
      return;
    }

    const { latitude, longitude, waypoints = [] } = trackingData;
    
    // Clear previous marker if it exists
    if (markerRef.current) {
      markerRef.current.remove();
    }
    
    // Add destination marker with popup
    try {
      markerRef.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML(
          `<h3>Delivery Location</h3>
           <p>Status: ${trackingData.status}</p>
           <p>Last Updated: ${new Date(trackingData.timestamp).toLocaleString()}</p>
           ${trackingData.eta ? `<p>ETA: ${new Date(trackingData.eta).toLocaleString()}</p>` : ''}
          `
        ))
        .addTo(mapInstance);
    } catch (err) {
      console.error('Error adding destination marker:', err);
    }
    
    // Add waypoint markers
    waypoints.forEach((waypoint, index) => {
      try {
        const color = waypoint.status === 'completed' ? '#22c55e' : '#f59e0b';
        new mapboxgl.Marker({ color })
          .setLngLat([waypoint.longitude, waypoint.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(
            `<h3>Waypoint ${index + 1}</h3>
             <p>Status: ${waypoint.status}</p>
             <p>Passed: ${new Date(waypoint.timestamp).toLocaleString()}</p>`
          ))
          .addTo(mapInstance);
      } catch (err) {
        console.error(`Error adding waypoint marker ${index}:`, err);
      }
    });
    
    // Add start point in Riyadh and route to current location
    const startPoint: [number, number] = [46.6753, 24.7136]; // Riyadh coordinates
    addRoute(mapInstance, startPoint, [longitude, latitude]);
  };

  useEffect(() => {
    if (trackingData && map && map.isStyleLoaded()) {
      console.log('Tracking data updated, updating route');
      const { latitude, longitude } = trackingData;
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      }

      // Update route
      const startPoint: [number, number] = [46.6753, 24.7136]; // Riyadh coordinates
      addRoute(map, startPoint, [longitude, latitude]);
    }
  }, [trackingData, map]);

  return (
    <Card>
      <BaseMap 
        onMapLoad={handleMapLoad}
        center={[45.0792, 23.8859]} // Center of Saudi Arabia
        zoom={5}
        className="h-[600px]"
      />
    </Card>
  );
};
