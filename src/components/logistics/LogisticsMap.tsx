
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const LogisticsMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { trackingData } = useLogisticsTracking();

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40],
        zoom: 9
      });
      
      setIsMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    if (trackingData && map.current && isMapInitialized) {
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
  }, [trackingData, isMapInitialized]);

  if (!isMapInitialized) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="mapbox-token">Mapbox Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="Enter your Mapbox public token"
              className="mt-1"
            />
          </div>
          <Button onClick={initializeMap}>Initialize Map</Button>
          <p className="text-sm text-muted-foreground">
            To get your Mapbox public token, visit{' '}
            <a 
              href="https://account.mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mapbox Account
            </a>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div ref={mapContainer} className="w-full h-[400px]" />
    </Card>
  );
};
