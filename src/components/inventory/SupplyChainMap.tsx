
import React from 'react';
import { BaseMap } from '../shared/maps/BaseMap';
import { createMapMarker } from '../shared/maps/MapMarker';
import type { Map } from 'mapbox-gl';

interface Location {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: string;
  level: number;
  parent_id: string | null;
}

const sampleLocations: Location[] = [
  {
    id: "riyadh_dc",
    name: "Riyadh Distribution Center",
    coordinates: { lat: 24.7136, lng: 46.6753 },
    type: "distribution",
    level: 1,
    parent_id: null
  },
  {
    id: "jeddah_dc",
    name: "Jeddah Distribution Center",
    coordinates: { lat: 21.5433, lng: 39.1728 },
    type: "distribution",
    level: 1,
    parent_id: null
  },
  {
    id: "dammam_ws",
    name: "Dammam Wholesale",
    coordinates: { lat: 26.4207, lng: 50.0888 },
    type: "wholesale",
    level: 2,
    parent_id: "riyadh_dc"
  }
];

const getLocationColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'distribution':
      return '#ef4444';
    case 'wholesale':
      return '#3b82f6';
    case 'retail':
      return '#22c55e';
    default:
      return '#a855f7';
  }
};

export const SupplyChainMap = () => {
  const handleMapLoad = (map: Map) => {
    // Add markers
    sampleLocations.forEach(location => {
      createMapMarker({
        map,
        coordinates: [location.coordinates.lng, location.coordinates.lat],
        color: getLocationColor(location.type),
        popupContent: `
          <div class="p-2">
            <h3 class="font-medium">${location.name}</h3>
            <p class="text-sm text-gray-500">${location.type}</p>
          </div>
        `
      });

      // Add connection lines for locations with parents
      if (location.parent_id) {
        const parent = sampleLocations.find(l => l.id === location.parent_id);
        if (parent) {
          const lineId = `line-${location.id}`;
          map.addSource(lineId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [location.coordinates.lng, location.coordinates.lat],
                  [parent.coordinates.lng, parent.coordinates.lat]
                ]
              }
            }
          });

          map.addLayer({
            id: lineId,
            type: 'line',
            source: lineId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#888',
              'line-width': 1,
              'line-dasharray': [2, 1]
            }
          });
        }
      }
    });
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Supply Chain Network</h3>
        <BaseMap onMapLoad={handleMapLoad} />
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Distribution Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Wholesale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Retail</span>
          </div>
        </div>
      </div>
    </div>
  );
};
