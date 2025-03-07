
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { Loader2, AlertTriangle } from 'lucide-react';
import BaseMap from '@/components/shared/maps/BaseMap';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorBoundary } from '../ErrorBoundary';

export const LogisticsMap: React.FC = () => {
  const { trackingData } = useLogisticsTracking();
  const [centerCoords, setCenterCoords] = useState({ lat: 34.0522, lng: -118.2437 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasMapError, setHasMapError] = useState(false);

  useEffect(() => {
    // Check if Mapbox token is available
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      console.log("Mapbox token is missing for logistics map. Map visualization is disabled.");
      setHasMapError(true);
    }

    if (trackingData) {
      setIsLoading(false);
      if (trackingData.latitude && trackingData.longitude) {
        setCenterCoords({
          lat: trackingData.latitude,
          lng: trackingData.longitude
        });
      }
    }
  }, [trackingData]);

  const MapErrorFallback = () => (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Map Unavailable</AlertTitle>
      <AlertDescription>
        The logistics tracking map is currently unavailable. Please check your Mapbox API configuration.
      </AlertDescription>
    </Alert>
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Logistics Tracking Map</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : hasMapError ? (
          <div className="h-80 flex items-center justify-center flex-col p-6">
            <MapErrorFallback />
          </div>
        ) : (
          <ErrorBoundary fallback={<MapErrorFallback />}>
            <BaseMap 
              latitude={centerCoords.lat} 
              longitude={centerCoords.lng} 
              zoom={5}
            />
          </ErrorBoundary>
        )}
      </CardContent>
    </Card>
  );
};
