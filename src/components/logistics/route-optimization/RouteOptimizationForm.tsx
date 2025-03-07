
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { RoutePoint, TransportMode, generateOptimizedRoute, getTransportModes } from '@/services/routeOptimizationService';

interface RouteOptimizationFormProps {
  onRouteGenerated: (route: any) => void;
  locations: RoutePoint[];
}

export const RouteOptimizationForm = ({ onRouteGenerated, locations }: RouteOptimizationFormProps) => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('');
  const [optimizationCriteria, setOptimizationCriteria] = useState<'time' | 'cost' | 'emissions'>('time');
  const [loading, setLoading] = useState<boolean>(false);
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);

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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
