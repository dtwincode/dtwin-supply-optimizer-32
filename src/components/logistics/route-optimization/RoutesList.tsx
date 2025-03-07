
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { OptimizedRoute, getSavedRoutes } from '@/services/routeOptimizationService';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

export const RoutesList = () => {
  const { language } = useLanguage();
  const [routes, setRoutes] = useState<OptimizedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const routesData = await getSavedRoutes();
        setRoutes(routesData);
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch routes'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load routes: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTranslation('common.logistics.savedRoutes', language)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getTranslation('common.logistics.routeName', language)}</TableHead>
              <TableHead>{getTranslation('common.logistics.transportMode', language)}</TableHead>
              <TableHead>{getTranslation('common.logistics.totalDistance', language)}</TableHead>
              <TableHead>{getTranslation('common.logistics.totalTime', language)}</TableHead>
              <TableHead>{getTranslation('common.logistics.totalCost', language)}</TableHead>
              <TableHead>{getTranslation('common.logistics.statusLabel', language)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.name}</TableCell>
                <TableCell>{route.transport_mode}</TableCell>
                <TableCell>{route.total_distance_km} km</TableCell>
                <TableCell>{route.total_time_hours} hours</TableCell>
                <TableCell>${route.total_cost.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      route.status === 'planned' ? 'default' :
                      route.status === 'in-progress' ? 'secondary' :
                      route.status === 'completed' ? 'outline' :
                      'default'
                    }
                    className="capitalize"
                  >
                    {route.status === 'planned' ? getTranslation('common.logistics.status.planned', language) :
                     route.status === 'in-progress' ? getTranslation('common.logistics.status.inProgress', language) :
                     getTranslation('common.logistics.status.completed', language)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {routes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  {getTranslation('common.logistics.noRoutesFound', language)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
