
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
  status: string;
  priority: string;
}

const logisticsLocations: Location[] = [
  {
    id: "po001",
    name: "PO-001 from Supplier A",
    coordinates: { lat: 24.7136, lng: 46.6753 },
    status: "in-transit",
    priority: "high"
  },
  {
    id: "po002",
    name: "PO-002 from Supplier B",
    coordinates: { lat: 21.5433, lng: 39.1728 },
    status: "delayed",
    priority: "medium"
  },
  {
    id: "po003",
    name: "PO-003 from Supplier C",
    coordinates: { lat: 26.4207, lng: 50.0888 },
    status: "processing",
    priority: "low"
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in-transit':
      return '#3b82f6'; // blue
    case 'delayed':
      return '#ef4444'; // red
    case 'processing':
      return '#f59e0b'; // amber
    default:
      return '#a855f7'; // purple
  }
};

export const LogisticsMap = () => {
  const handleMapLoad = (map: Map) => {
    logisticsLocations.forEach(location => {
      createMapMarker({
        map,
        coordinates: [location.coordinates.lng, location.coordinates.lat],
        color: getStatusColor(location.status),
        popupContent: `
          <div class="p-2">
            <h3 class="font-medium">${location.name}</h3>
            <p class="text-sm text-gray-500">Status: ${location.status}</p>
            <p class="text-sm text-gray-500">Priority: ${location.priority}</p>
          </div>
        `
      });
    });
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Tracking Map</h3>
        <BaseMap onMapLoad={handleMapLoad} />
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>In Transit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
