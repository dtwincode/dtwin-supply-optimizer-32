
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { BaseMap } from '@/components/shared/maps/BaseMap';

export const LogisticsMap = () => {
  const marker = useRef<mapboxgl.Marker | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { trackingData } = useLogisticsTracking();

  const addRoute = async (map: mapboxgl.Map, waypoints: Array<[number, number]>) => {
    try {
      // Create waypoints string for the Mapbox Directions API
      const waypointsStr = waypoints.map(wp => `${wp[0]},${wp[1]}`).join(';');
      
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${waypointsStr}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
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

      // If the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
      } else {
        // Otherwise, we'll make a new request to add the route
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson as any
          },
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
      }

      // Fit map to show entire route
      const coordinates = route;
      const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
        return bounds.extend(coord as mapboxgl.LngLatLike);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, {
        padding: 50
      });
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    map.current = loadedMap;
    
    // If no tracking data, center on Saudi Arabia
    if (!trackingData) {
      loadedMap.flyTo({
        center: [45.0792, 23.8859], // Center of Saudi Arabia
        zoom: 5,
        essential: true
      });
      return;
    }

    const { latitude, longitude, waypoints = [] } = trackingData;
    
    // Add destination marker with popup
    marker.current = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup().setHTML(
        `<h3>Final Destination</h3>
         <p>Status: ${trackingData.status}</p>
         <p>Last Updated: ${new Date(trackingData.timestamp).toLocaleString()}</p>
         ${trackingData.eta ? `<p>ETA: ${new Date(trackingData.eta).toLocaleString()}</p>` : ''}`
      ))
      .addTo(loadedMap);
    
    // Add markers for all waypoints
    waypoints.forEach((waypoint, index) => {
      let color = '#22c55e'; // Default green for completed
      if (waypoint.status === 'in_progress') {
        color = '#f59e0b'; // Orange for in progress
      } else if (waypoint.status === 'pending') {
        color = '#ef4444'; // Red for pending
      }

      let status = '';
      switch (waypoint.status) {
        case 'completed':
          status = '✅ Completed';
          break;
        case 'in_progress':
          status = '🚚 In Progress';
          break;
        case 'pending':
          status = '⏳ Pending';
          break;
      }

      new mapboxgl.Marker({ color })
        .setLngLat([waypoint.longitude, waypoint.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(
          `<div style="min-width: 200px;">
             <h3 style="font-weight: bold; margin-bottom: 8px;">Checkpoint ${index + 1}</h3>
             <p style="margin: 4px 0;">Status: ${status}</p>
             <p style="margin: 4px 0;">Time: ${new Date(waypoint.timestamp).toLocaleString()}</p>
           </div>`
        ))
        .addTo(loadedMap);
    });
    
    // Create array of coordinates for the complete route
    const routeWaypoints = waypoints.map(wp => [wp.longitude, wp.latitude] as [number, number]);
    // Add final destination
    routeWaypoints.push([longitude, latitude]);
    
    // Add the complete route
    addRoute(loadedMap, routeWaypoints);
  };

  useEffect(() => {
    if (trackingData && map.current) {
      const { latitude, longitude, waypoints = [] } = trackingData;
      
      // Update destination marker position
      if (!marker.current) {
        marker.current = new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      } else {
        marker.current.setLngLat([longitude, latitude]);
      }

      // Update route with all waypoints
      const routeWaypoints = waypoints.map(wp => [wp.longitude, wp.latitude] as [number, number]);
      routeWaypoints.push([longitude, latitude]);
      addRoute(map.current, routeWaypoints);
    }
  }, [trackingData]);

  return (
    <Card>
      <BaseMap 
        onMapLoad={handleMapLoad}
        center={[45.0792, 23.8859]} // Center of Saudi Arabia
        zoom={5}
      />
    </Card>
  );
};
