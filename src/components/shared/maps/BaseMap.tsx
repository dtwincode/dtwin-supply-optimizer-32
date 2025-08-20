import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { createMapMarker } from "./MapMarker";

interface BaseMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    color: string;
    onClick?: () => void;
    icon?: string;
    tooltipContent?: React.ReactNode;
  }>;
}

const BaseMap: React.FC<BaseMapProps> = ({
  latitude = 34.0522,
  longitude = -118.2437,
  zoom = 9,
  markers = [],
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const markerRefs = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    // Use a fallback token if the environment variable is not available
    const mapboxToken =
      import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
      "pk.eyJ1IjoiZHR3aW4tc3VwcGx5LWNoYWluIiwiYSI6ImNscXVkZndnYzE3YXIya284bHkxdjgwa24ifQ.kWnflNf9FQtNwxTvTiG20g";
    mapboxgl.accessToken = mapboxToken;

    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [longitude, latitude],
        zoom: zoom,
      });

      mapInstance.on("load", () => {
        setMap(mapInstance);
        mapInstance.resize();
      });

      // Add navigation control (the +/- zoom buttons)
      mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add geolocate control to the map.
      mapInstance.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        "top-left"
      );

      // Add full screen control
      mapInstance.addControl(new mapboxgl.FullscreenControl());

      // Add scale control
      mapInstance.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 80,
          unit: "metric",
        })
      );

      // Add attribution control
      mapInstance.addControl(
        new mapboxgl.AttributionControl({ compact: true })
      );

      setMap(mapInstance);
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) map.remove();
    };
  }, [latitude, longitude, zoom]);

  // Handle markers
  useEffect(() => {
    if (!map) return;

    // Clear previous markers
    Object.values(markerRefs.current).forEach((marker) => marker.remove());
    markerRefs.current = {};

    // Add new markers
    markers.forEach((marker) => {
      const { id, latitude, longitude, color, onClick, icon, tooltipContent } =
        marker;
      const markerElement = createMapMarker({
        color,
        icon,
        tooltipContent,
      });

      const mapMarker = new mapboxgl.Marker(markerElement)
        .setLngLat([longitude, latitude])
        .addTo(map);

      if (onClick) {
        markerElement.addEventListener("click", onClick);
      }

      markerRefs.current[id] = mapMarker;
    });

    return () => {
      Object.values(markerRefs.current).forEach((marker) => marker.remove());
    };
  }, [map, markers]);

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
};

export default BaseMap;
