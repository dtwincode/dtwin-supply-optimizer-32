
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { Loader2 } from 'lucide-react';
import BaseMap from '@/components/shared/maps/BaseMap';

export const LogisticsMap: React.FC = () => {
  const { trackingData } = useLogisticsTracking();
  const [centerCoords, setCenterCoords] = useState({ lat: 34.0522, lng: -118.2437 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        ) : (
          <BaseMap 
            latitude={centerCoords.lat} 
            longitude={centerCoords.lng} 
            zoom={5}
          />
        )}
      </CardContent>
    </Card>
  );
};
