
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { BaseMap } from '@/components/shared/maps/BaseMap';

export const LogisticsMap = () => {
  const marker = useRef<mapboxgl.Marker | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { trackingData } = useLogisticsTracking();

  const addRoute = async (map: mapboxgl.Map, start: [number, number], end: [number, number]) => {
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

      // If the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
      } else {
        // Otherwise, we'll make a new request to add the route
        map.addLayer({
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
        .addTo(map);

      // Fit map to show entire route
      const coordinates = route;
      const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
        return bounds.extend(coord as mapboxgl.LngLatLike);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, {
        padding: 50
      });
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    map.current = loadedMap;
    
    // If no tracking data, center on Saudi Arabia
    if (!trackingData) {
      loadedMap.flyTo({
        center: [45.0792, 23.8859], // Center of Saudi Arabia
        zoom: 5,
        essential: true
      });
    } else {
      const { latitude, longitude } = trackingData;
      
      // Add destination marker with popup
      marker.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML(
          `<h3>Delivery Location</h3>
           <p>Status: ${trackingData.status}</p>
           <p>Last Updated: ${new Date(trackingData.timestamp).toLocaleString()}</p>`
        ))
        .addTo(loadedMap);
      
      // Add start point in Riyadh and route to current location
      const startPoint: [number, number] = [46.6753, 24.7136]; // Riyadh coordinates
      addRoute(loadedMap, startPoint, [longitude, latitude]);
    }
  };

  useEffect(() => {
    if (trackingData && map.current) {
      const { latitude, longitude } = trackingData;
      
      if (!marker.current) {
        marker.current = new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      } else {
        marker.current.setLngLat([longitude, latitude]);
      }

      // Update route when tracking data changes
      const startPoint: [number, number] = [46.6753, 24.7136]; // Riyadh coordinates
      addRoute(map.current, startPoint, [longitude, latitude]);
    }
  }, [trackingData]);

  return (
    <Card>
      <BaseMap 
        onMapLoad={handleMapLoad}
        center={[45.0792, 23.8859]} // Center of Saudi Arabia
        zoom={5}
      />
    </Card>
  );
};
