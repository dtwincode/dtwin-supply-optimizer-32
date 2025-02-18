
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
      marker.current = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(loadedMap);
      
      loadedMap.flyTo({
        center: [longitude, latitude],
        zoom: 8,
        essential: true
      });
    }
  };

  useEffect(() => {
    if (trackingData && map.current) {
      const { latitude, longitude } = trackingData;
      
      if (!marker.current) {
        marker.current = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      } else {
        marker.current.setLngLat([longitude, latitude]);
      }

      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 8,
        essential: true
      });
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
