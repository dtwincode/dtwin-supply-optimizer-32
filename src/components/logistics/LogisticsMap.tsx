
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { BaseMap } from '@/components/shared/maps/BaseMap';
import { Truck, Package, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const LogisticsMap = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const routeSourceAddedRef = useRef<boolean>(false);
  const { trackingData } = useLogisticsTracking();

  const addRoute = async (mapInstance: mapboxgl.Map, start: [number, number], end: [number, number]) => {
    try {
      // Wait for the map to be fully loaded
      if (!mapInstance.isStyleLoaded()) {
        console.log('Map style not fully loaded yet, waiting...');
        return;
      }

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const json = await query.json();
      
      if (!json.routes || json.routes.length === 0) {
        console.error('No routes found in the response:', json);
        return;
      }
      
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Check if the map still exists and has the source
      if (!mapInstance || !mapInstance.getStyle()) {
        console.log('Map instance or style no longer available');
        return;
      }

      // Check if the 'route' source already exists with proper error handling
      let sourceExists = false;
      try {
        sourceExists = !!mapInstance.getSource('route');
      } catch (e) {
        console.log('Error checking for route source, assuming it does not exist', e);
      }

      if (sourceExists && routeSourceAddedRef.current) {
        // Update existing source
        try {
          (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
        } catch (err) {
          console.error('Error updating route source:', err);
        }
      } else {
        // Only add the source and layer if not already added
        try {
          // First add the source
          mapInstance.addSource('route', {
            type: 'geojson',
            data: geojson as any
          });
          
          // Then add the layer that uses this source
          mapInstance.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.75
            }
          });
          
          routeSourceAddedRef.current = true;
        } catch (err) {
          console.error('Error adding route source or layer:', err);
        }
      }

      // Add start marker (Riyadh hub) only once
      if (!mapInstance.getLayer('start-marker')) {
        try {
          new mapboxgl.Marker({ color: '#22c55e' })
            .setLngLat(start)
            .setPopup(new mapboxgl.Popup().setHTML(
              `<h3>Distribution Hub</h3>
               <p>${trackingData?.origin || 'Riyadh'}</p>
               <p><strong>Carrier:</strong> ${trackingData?.carrier || 'Default Carrier'}</p>`
            ))
            .addTo(mapInstance);
        } catch (err) {
          console.error('Error adding start marker:', err);
        }
      }

      // Fit map to show entire route with proper error handling
      try {
        const coordinates = route;
        const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
          return bounds.extend(coord as mapboxgl.LngLatLike);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        mapInstance.fitBounds(bounds, {
          padding: 50,
          duration: 1000 // Smooth animation
        });
      } catch (err) {
        console.error('Error fitting bounds:', err);
      }
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    console.log('Map loaded successfully');
    setMap(loadedMap);
    
    // Wait for the style to fully load before attempting to modify the map
    loadedMap.on('style.load', () => {
      console.log('Map style loaded');
      renderTrackingData(loadedMap);
    });
  };

  const renderTrackingData = (mapInstance: mapboxgl.Map) => {
    // If no tracking data, center on Saudi Arabia
    if (!trackingData) {
      mapInstance.flyTo({
        center: [45.0792, 23.8859], // Center of Saudi Arabia
        zoom: 5,
        essential: true
      });
      return;
    }

    const { latitude, longitude, waypoints = [] } = trackingData;
    
    // Clear previous marker if it exists
    if (markerRef.current) {
      markerRef.current.remove();
    }
    
    // Add destination marker with popup
    try {
      markerRef.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML(
          `<h3>Delivery Location</h3>
           <p><strong>Destination:</strong> ${trackingData.destination || 'Unknown'}</p>
           <p><strong>Status:</strong> ${trackingData.status}</p>
           <p><strong>Last Updated:</strong> ${new Date(trackingData.timestamp).toLocaleString()}</p>
           ${trackingData.eta ? `<p><strong>ETA:</strong> ${new Date(trackingData.eta).toLocaleString()}</p>` : ''}
           ${trackingData.tracking_number ? `<p><strong>Tracking:</strong> ${trackingData.tracking_number}</p>` : ''}
           ${trackingData.package_weight ? `<p><strong>Weight:</strong> ${trackingData.package_weight}</p>` : ''}
           ${trackingData.special_instructions ? `<p><strong>Instructions:</strong> ${trackingData.special_instructions}</p>` : ''}
          `
        ))
        .addTo(mapInstance);
    } catch (err) {
      console.error('Error adding destination marker:', err);
    }
    
    // Add waypoint markers
    waypoints.forEach((waypoint, index) => {
      try {
        const color = waypoint.status === 'completed' ? '#22c55e' : '#f59e0b';
        new mapboxgl.Marker({ color })
          .setLngLat([waypoint.longitude, waypoint.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(
            `<h3>Waypoint ${index + 1}</h3>
             <p><strong>Location:</strong> ${waypoint.location || 'Unknown'}</p>
             <p><strong>Activity:</strong> ${waypoint.activity || 'In transit'}</p>
             <p><strong>Status:</strong> ${waypoint.status}</p>
             <p><strong>Passed:</strong> ${new Date(waypoint.timestamp).toLocaleString()}</p>`
          ))
          .addTo(mapInstance);
      } catch (err) {
        console.error(`Error adding waypoint marker ${index}:`, err);
      }
    });
    
    // Add start point in Riyadh and route to current location
    const startPoint: [number, number] = [46.6753, 24.7136]; // Riyadh coordinates
    addRoute(mapInstance, startPoint, [longitude, latitude]);
  };

  useEffect(() => {
    if (trackingData && map && map.isStyleLoaded()) {
      console.log('Tracking data updated, updating route');
      const { latitude, longitude } = trackingData;
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      }

      // Update route
      const startPoint: [number, number] = [46.6753, 24.7136]; // Riyadh coordinates
      addRoute(map, startPoint, [longitude, latitude]);
    }
  }, [trackingData, map]);

  return (
    <div className="space-y-4">
      <Card>
        <BaseMap 
          onMapLoad={handleMapLoad}
          center={[45.0792, 23.8859]} // Center of Saudi Arabia
          zoom={5}
          className="h-[600px]"
        />
      </Card>
      
      {trackingData && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Package Information
              </h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Order:</span> {trackingData.order_id}</p>
                <p><span className="font-medium">Tracking:</span> {trackingData.tracking_number || 'N/A'}</p>
                <p><span className="font-medium">Weight:</span> {trackingData.package_weight || 'N/A'}</p>
                <p><span className="font-medium">Dimensions:</span> {trackingData.package_dimensions || 'N/A'}</p>
                <p><span className="font-medium">Signature Required:</span> {trackingData.signature_required ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Shipping Details
              </h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Carrier:</span> {trackingData.carrier || 'N/A'}</p>
                <p><span className="font-medium">Last Mile:</span> {trackingData.last_mile_carrier || 'N/A'}</p>
                <p><span className="font-medium">Origin:</span> {trackingData.origin || 'N/A'}</p>
                <p><span className="font-medium">Destination:</span> {trackingData.destination || 'N/A'}</p>
                <p><span className="font-medium">Customs:</span> {trackingData.customs_status || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Delivery Status
              </h3>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-1">
                  <span className="font-medium">Status:</span> 
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    trackingData.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : 
                    trackingData.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                    trackingData.status === 'delayed' ? 'bg-orange-100 text-orange-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {trackingData.status?.replace('_', ' ')}
                  </span>
                </p>
                <p><span className="font-medium">Last Updated:</span> {new Date(trackingData.timestamp).toLocaleString()}</p>
                <p><span className="font-medium">ETA:</span> {trackingData.eta ? new Date(trackingData.eta).toLocaleString() : 'N/A'}</p>
                <p><span className="font-medium">Delivery Attempts:</span> {trackingData.delivery_attempts || 0}</p>
                <p>
                  <span className="font-medium">Special Instructions:</span><br />
                  <span className="text-xs">{trackingData.special_instructions || 'None'}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
