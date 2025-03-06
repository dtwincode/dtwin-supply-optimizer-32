
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { Loader2 } from 'lucide-react';
import BaseMap from '@/components/shared/maps/BaseMap';

export const LogisticsMap: React.FC = () => {
  const { trackingData, loading } = useLogisticsTracking();
  const [centerCoords, setCenterCoords] = useState({ lat: 34.0522, lng: -118.2437 });

  useEffect(() => {
    if (trackingData && trackingData.length > 0) {
      const firstPoint = trackingData[0];
      if (firstPoint.latitude && firstPoint.longitude) {
        setCenterCoords({
          lat: firstPoint.latitude,
          lng: firstPoint.longitude
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
        {loading ? (
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
