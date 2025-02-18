
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';

mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHN3N2RxZWowMGRpMmptbGVyYzNiYmJ2In0.qNKFa0RyxHjEFJRQPhoVmQ';

export const LogisticsMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const { trackingData } = useLogisticsTracking();

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40],
        zoom: 9
      });
    }

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
        essential: true
      });
    }
  }, [trackingData]);

  return (
    <Card>
      <div ref={mapContainer} className="w-full h-[400px]" />
    </Card>
  );
};
