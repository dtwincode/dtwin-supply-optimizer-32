
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';
import { RoutePoint, TransportMode, generateOptimizedRoute, getTransportModes } from '@/services/routeOptimizationService';

interface RouteOptimizationFormProps {
  onRouteGenerated: (route: any) => void;
}

export const RouteOptimizationForm = ({ onRouteGenerated }: RouteOptimizationFormProps) => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('');
  const [optimizationCriteria, setOptimizationCriteria] = useState<'time' | 'cost' | 'emissions'>('time');
  const [loading, setLoading] = useState<boolean>(false);
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);
  const [locations, setLocations] = useState<RoutePoint[]>([]);

  useEffect(() => {
    const fetchTransportModes = async () => {
      try {
        const modes = await getTransportModes();
        setTransportModes(modes);
        if (modes.length > 0) {
          setTransportMode(modes[0].id);
        }
      } catch (error) {
        console.error('Error fetching transport modes:', error);
      }
    };

    fetchTransportModes();
    
    // Sample locations
    setLocations([
      {
        id: 'loc-001',
        name: 'Riyadh Warehouse',
        latitude: 24.7136,
        longitude: 46.6753,
        address: 'Industrial Area, Riyadh 12345, Saudi Arabia',
        type: 'origin'
      },
      {
        id: 'loc-002',
        name: 'Jeddah Distribution Center',
        latitude: 21.5412,
        longitude: 39.1721,
        address: 'Port Area, Jeddah 54321, Saudi Arabia',
        type: 'waypoint'
      },
      {
        id: 'loc-003',
        name: 'Dammam Port',
        latitude: 26.4207,
        longitude: 50.0887,
        address: 'Port Area, Dammam 31411, Saudi Arabia',
        type: 'waypoint'
      },
      {
        id: 'loc-004',
        name: 'Mecca Fulfillment Center',
        latitude: 21.3891,
        longitude: 39.8579,
        address: 'Industrial Zone, Mecca 24231, Saudi Arabia',
        type: 'waypoint'
      },
      {
        id: 'loc-005',
        name: 'Medina Regional Hub',
        latitude: 24.5247,
        longitude: 39.5692,
        address: 'Logistics Park, Medina 42351, Saudi Arabia',
        type: 'destination'
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await generateOptimizedRoute({
        origin,
        destination,
        transportModeId: transportMode,
        optimizationCriteria,
      });
      
      onRouteGenerated(result);
    } catch (error) {
      console.error('Error generating route:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Select
              value={origin}
              onValueChange={setOrigin}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select origin location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Select
              value={destination}
              onValueChange={setDestination}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportMode">Transport Mode</Label>
            <Select
              value={transportMode}
              onValueChange={setTransportMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transport mode" />
              </SelectTrigger>
              <SelectContent>
                {transportModes.map((mode) => (
                  <SelectItem key={mode.id} value={mode.id}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="optimizationCriteria">Optimize For</Label>
            <Select
              value={optimizationCriteria}
              onValueChange={(value) => setOptimizationCriteria(value as 'time' | 'cost' | 'emissions')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select optimization criteria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Fastest Time</SelectItem>
                <SelectItem value="cost">Lowest Cost</SelectItem>
                <SelectItem value="emissions">Lowest Emissions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !origin || !destination}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Calculating optimal route...
              </>
            ) : (
              'Calculate Optimal Route'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
