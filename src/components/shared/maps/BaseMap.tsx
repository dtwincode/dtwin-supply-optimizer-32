
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface BaseMapProps {
  children?: React.ReactNode;
  onMapLoad?: (map: mapboxgl.Map) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export const BaseMap = ({ 
  children, 
  onMapLoad,
  center = [45.0792, 23.8859],
  zoom = 5,
  className = "h-[400px]"
}: BaseMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        if (!mapContainer.current) {
          throw new Error('Map container not found');
        }

        console.log("Starting map initialization...");
        
        const { data: secret, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .maybeSingle();

        if (secretError) {
          throw new Error(`Failed to fetch token: ${secretError.message}`);
        }

        if (!secret) {
          throw new Error('Mapbox token not found. Please ensure it is set in Supabase.');
        }

        const token = secret.value;
        
        if (!token.startsWith('pk.')) {
          throw new Error('Invalid Mapbox public token format.');
        }

        mapboxgl.accessToken = token;

        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: center,
          zoom: zoom,
          attributionControl: false
        });

        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        newMap.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

        // Wait for map to load before setting up event handlers
        newMap.on('load', () => {
          if (!isMounted) return;
          
          map.current = newMap;
          
          if (onMapLoad) {
            onMapLoad(newMap);
          }
          
          setIsLoading(false);
        });

        newMap.on('error', (e) => {
          console.error('Map error:', e);
          if (isMounted) {
            setError(`Map error: ${e.error.message}`);
            toast({
              title: "Map Error",
              description: e.error.message,
              variant: "destructive",
            });
          }
        });

      } catch (err) {
        console.error("Map initialization failed:", err);
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to initialize map';
          setError(errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, onMapLoad, toast]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-500 text-center p-4">{error}</div>
        </div>
      ) : (
        <div ref={mapContainer} className={`${className} w-full`} />
      )}
      {children}
    </div>
  );
};
