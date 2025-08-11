
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OptimizedRoute, saveOptimizedRoute } from '@/services/routeOptimizationService';
import { Check, Clock, DollarSign, Fuel, MapPin, RotateCcw, Save, TrendingDown, Loader } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

interface OptimizedRouteDetailsProps {
  route: OptimizedRoute | null;
  onReset: () => void;
}

export const OptimizedRouteDetails = ({ route, onReset }: OptimizedRouteDetailsProps) => {
  const { language } = useLanguage();
  const [saving, setSaving] = useState(false);

  if (!route) {
    return null;
  }

  const handleSaveRoute = async () => {
    setSaving(true);
    try {
      await saveOptimizedRoute(route);
      toast.success(getTranslation('common.logistics.routeSaved', language));
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error(getTranslation('common.logistics.failedToSaveRoute', language));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">{route.name}</CardTitle>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{getTranslation('common.logistics.transportMode', language)}</h3>
              <p className="text-base font-semibold">{route.transport_mode}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">{getTranslation('common.logistics.routeDetails', language)}</h3>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary/70" />
                <p className="text-sm">{route.origin.name}</p>
              </div>
              
              {route.waypoints && route.waypoints.length > 0 && (
                route.waypoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2 pl-6">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{point.name}</p>
                  </div>
                ))
              )}
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-destructive/70" />
                <p className="text-sm">{route.destination.name}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{route.total_time_hours} {getTranslation('common.logistics.totalTime', language).toLowerCase()}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation('common.logistics.transitTime', language)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">﷼{route.total_cost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation('common.logistics.totalCost', language)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{route.emissions_kg} kg</p>
                  <p className="text-xs text-muted-foreground">{getTranslation('common.logistics.co2Emissions', language)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{route.fuel_consumption_liters} L</p>
                  <p className="text-xs text-muted-foreground">{getTranslation('common.logistics.fuelConsumption', language)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">{route.total_distance_km} km</p>
              <p className="text-xs text-muted-foreground">{getTranslation('common.logistics.totalDistance', language)}</p>
            </div>
            
            <div className="pt-4 flex space-x-2">
              <Button onClick={handleSaveRoute} disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {getTranslation('common.logistics.saving', language)}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {getTranslation('common.logistics.saveRoute', language)}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onReset} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                {getTranslation('common.logistics.reset', language)}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
