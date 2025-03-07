
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader } from 'lucide-react';
import { TransportMode, getTransportModes } from '@/services/routeOptimizationService';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const TransportModeList = () => {
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransportModes = async () => {
      try {
        setLoading(true);
        const modes = await getTransportModes();
        setTransportModes(modes);
      } catch (error) {
        console.error('Error fetching transport modes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportModes();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transport Modes</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transport Modes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mode</TableHead>
              <TableHead>Speed (km/h)</TableHead>
              <TableHead>Cost per km</TableHead>
              <TableHead>Capacity (kg)</TableHead>
              <TableHead>Volume (m³)</TableHead>
              <TableHead>MOQ</TableHead>
              <TableHead>Max Shipments</TableHead>
              <TableHead>Emissions (kg/km)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transportModes.map((mode) => (
              <TableRow key={mode.id}>
                <TableCell className="font-medium">{mode.name}</TableCell>
                <TableCell>{mode.speed_kmh}</TableCell>
                <TableCell>${mode.cost_per_km.toFixed(2)}</TableCell>
                <TableCell>{(mode.capacity_kg / 1000).toFixed(1)} tons</TableCell>
                <TableCell>{mode.capacity_cbm} m³</TableCell>
                <TableCell>
                  {mode.moq ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline">
                            {mode.moq} {mode.moq_units}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimum Order Quantity</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  {mode.max_shipments ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary">
                            {mode.max_shipments}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Maximum shipments per transport</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{mode.emissions_kg_per_km.toFixed(1)} kg</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
