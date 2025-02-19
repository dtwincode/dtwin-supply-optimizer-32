import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { BaseMap } from '@/components/shared/maps/BaseMap';

export const LogisticsMap = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const { trackingData } = useLogisticsTracking();

  const addRoute = async (mapInstance: mapboxgl.Map, start: [number, number], end: [number, number]) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
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

      // If the route already exists on the map, reset it using setData
      if (mapInstance.getSource('route')) {
        (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
      } else {
        // Otherwise, add a new layer for the route
        mapInstance.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson as any
          },
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
      }

      // Add start marker (Riyadh hub)
      new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(start)
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Distribution Hub</h3><p>Riyadh</p>'))
        .addTo(mapInstance);

      // Fit map to show entire route
      const coordinates = route;
      const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
        return bounds.extend(coord as mapboxgl.LngLatLike);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      mapInstance.fitBounds(bounds, {
        padding: 50
      });
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    setMap(loadedMap);
    
    // If no tracking data, center on Saudi Arabia
    if (!trackingData) {
      loadedMap.flyTo({
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
    markerRef.current = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup().setHTML(
        `<h3>Delivery Location</h3>
         <p>Status: ${trackingData.status}</p>
         <p>Last Updated: ${new Date(trackingData.timestamp).toLocaleString()}</p>
         ${trackingData.eta ? `<p>ETA: ${new Date(trackingData.eta).toLocaleString()}</p>` : ''}
        `
      ))
      .addTo(loadedMap);
    
    // Add waypoint markers
    waypoints.forEach((waypoint, index) => {
      const color = waypoint.status === 'completed' ? '#22c55e' : '#f59e0b';
      new mapboxgl.Marker({ color })
        .setLngLat([waypoint.longitude, waypoint.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(
          `<h3>Waypoint ${index + 1}</h3>
           <p>Status: ${waypoint.status}</p>
           <p>Passed: ${new Date(waypoint.timestamp).toLocaleString()}</p>`
        ))
        .addTo(loadedMap);
    });
    
    // Add start point in Riyadh and route to current location
    const startPoint: [number, number] = [46.6753, 24.7136]; // Riyadh coordinates
    addRoute(loadedMap, startPoint, [longitude, latitude]);
  };

  useEffect(() => {
    if (trackingData && map) {
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
