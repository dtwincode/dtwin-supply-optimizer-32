
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { BaseMap } from '@/components/shared/maps/BaseMap';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  DollarSign, 
  Navigation,
  AlertTriangle 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type RouteProfile = 'driving' | 'driving-traffic';
type OptimizationType = 'time' | 'cost';

export const LogisticsMap = () => {
  const marker = useRef<mapboxgl.Marker | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { trackingData } = useLogisticsTracking();
  const [routeProfile, setRouteProfile] = useState<RouteProfile>('driving-traffic');
  const [optimizationType, setOptimizationType] = useState<OptimizationType>('time');
  const [alternateRoutes, setAlternateRoutes] = useState<any[]>([]);
  const [trafficIncidents, setTrafficIncidents] = useState<any[]>([]);

  const addRoute = async (map: mapboxgl.Map, waypoints: Array<[number, number]>) => {
    try {
      // Remove duplicate coordinates by filtering consecutive identical points
      const uniqueWaypoints = waypoints.filter((wp, index, arr) => {
        if (index === 0) return true;
        const prev = arr[index - 1];
        return !(wp[0] === prev[0] && wp[1] === prev[1]);
      });

      // Create waypoints string for the Mapbox Directions API with traffic consideration
      const waypointsStr = uniqueWaypoints.map(wp => `${wp[0]},${wp[1]}`).join(';');
      
      // Add optimization parameters based on selected type
      const optimizationParams = optimizationType === 'time' 
        ? '&depart_at=now&annotations=duration,distance,speed,congestion&overview=full'
        : '&annotations=duration,distance,congestion&optimize=cost&overview=full';

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${routeProfile}/${waypointsStr}?steps=true&geometries=geojson&alternatives=true${optimizationParams}&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      
      if (!json.routes || json.routes.length === 0) {
        throw new Error('No routes found');
      }

      // Store alternate routes for later use
      setAlternateRoutes(json.routes.slice(1));

      const primaryRoute = json.routes[0];
      const route = primaryRoute.geometry.coordinates;

      // Show estimated time with traffic
      const estimatedMinutes = Math.round(primaryRoute.duration / 60);
      toast({
        title: "Route Updated",
        description: `Estimated delivery time: ${estimatedMinutes} minutes`,
      });

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Add traffic incidents if available
      if (primaryRoute.incidents) {
        setTrafficIncidents(primaryRoute.incidents);
        primaryRoute.incidents.forEach((incident: any) => {
          new mapboxgl.Marker({ color: '#ff0000' })
            .setLngLat(incident.location)
            .setPopup(new mapboxgl.Popup().setHTML(
              `<div>
                <h4>Traffic Alert</h4>
                <p>${incident.description}</p>
                <p>Delay: ${Math.round(incident.delay / 60)} minutes</p>
              </div>`
            ))
            .addTo(map);
        });
      }

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
            'line-color': [
              'match',
              ['get', 'congestion'],
              'low', '#22c55e',
              'moderate', '#f59e0b',
              'heavy', '#ef4444',
              'severe', '#7f1d1d',
              '#3b82f6'
            ],
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
      }

      // Add alternate routes with different styling
      alternateRoutes.forEach((altRoute, index) => {
        const altGeojson = {
          type: 'Feature',
          properties: {},
          geometry: altRoute.geometry
        };

        const altRouteId = `route-alternative-${index}`;

        if (map.getSource(altRouteId)) {
          (map.getSource(altRouteId) as mapboxgl.GeoJSONSource).setData(altGeojson as any);
        } else {
          map.addLayer({
            id: altRouteId,
            type: 'line',
            source: {
              type: 'geojson',
              data: altGeojson as any
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#94a3b8',
              'line-width': 3,
              'line-opacity': 0.5,
              'line-dasharray': [2, 2]
            }
          });
        }
      });

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
      toast({
        title: "Route Error",
        description: "Failed to update route. Please try again.",
        variant: "destructive",
      });
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
    <Card className="relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white/90 p-2 rounded-lg shadow">
        <Button
          size="sm"
          variant={routeProfile === 'driving-traffic' ? 'default' : 'outline'}
          onClick={() => setRouteProfile('driving-traffic')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Traffic
        </Button>
        <Button
          size="sm"
          variant={routeProfile === 'driving' ? 'default' : 'outline'}
          onClick={() => setRouteProfile('driving')}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Standard
        </Button>
        <Button
          size="sm"
          variant={optimizationType === 'time' ? 'default' : 'outline'}
          onClick={() => setOptimizationType('time')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Time
        </Button>
        <Button
          size="sm"
          variant={optimizationType === 'cost' ? 'default' : 'outline'}
          onClick={() => setOptimizationType('cost')}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Cost
        </Button>
      </div>
      {trafficIncidents.length > 0 && (
        <div className="absolute top-16 right-4 z-10 bg-red-50 p-2 rounded-lg shadow">
          <div className="flex items-center text-red-700 text-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {trafficIncidents.length} Traffic Incident(s)
          </div>
        </div>
      )}
      <BaseMap 
        onMapLoad={handleMapLoad}
        center={[45.0792, 23.8859]}
        zoom={5}
      />
    </Card>
  );
};
