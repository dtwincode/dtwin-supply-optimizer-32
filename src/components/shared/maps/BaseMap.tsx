
import React, { useRef, useEffect, useState, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createMapMarker } from './MapMarker';

interface BaseMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

const BaseMap: React.FC<BaseMapProps> = ({ latitude = 34.0522, longitude = -118.2437, zoom = 9 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom: zoom
      });

      map.on('load', () => {
        setMap(map);
        map.resize();
      });

      // Add navigation control (the +/- zoom buttons)
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add geolocate control to the map.
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-left'
      );

      // Add full screen control
      map.addControl(new mapboxgl.FullscreenControl());

      // Add scale control
      map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      }));

      // Add attribution control
      new mapboxgl.AttributionControl({ compact: true })
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) map.remove();
    };
  }, [map, latitude, longitude, zoom]);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
  );
};

export default BaseMap;
