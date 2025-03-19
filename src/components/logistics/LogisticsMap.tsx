
import React, { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { Loader2, AlertTriangle, MapPin } from 'lucide-react';
import BaseMap from '@/components/shared/maps/BaseMap';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorBoundary } from '../ErrorBoundary';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

export const LogisticsMap: React.FC = () => {
  const { trackingData } = useLogisticsTracking();
  const [centerCoords, setCenterCoords] = useState({ lat: 34.0522, lng: -118.2437 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasMapError, setHasMapError] = useState(false);
  const { language } = useLanguage();

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
    <Alert variant="destructive" className="mt-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{getTranslation("common.logistics.mapUnavailable", language)}</AlertTitle>
      <AlertDescription>
        {getTranslation("common.logistics.mapError", language)}
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md flex items-center">
        <MapPin className="h-5 w-5 text-dtwin-medium mr-2" />
        <span className="font-semibold text-gray-800">
          {getTranslation("common.logistics.logisticsTrackingMap", language)}
        </span>
      </div>
      
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
          <div className="h-[400px] rounded-lg overflow-hidden">
            <BaseMap 
              latitude={centerCoords.lat} 
              longitude={centerCoords.lng} 
              zoom={5}
            />
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};
