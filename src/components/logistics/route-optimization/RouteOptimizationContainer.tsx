
import { useState } from 'react';
import { RouteOptimizationForm } from './RouteOptimizationForm';
import { OptimizedRouteDetails } from './OptimizedRouteDetails';
import { RoutesList } from './RoutesList';
import { OptimizedRoute } from '@/services/routeOptimizationService';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const RouteOptimizationContainer = () => {
  const [generatedRoute, setGeneratedRoute] = useState<OptimizedRoute | null>(null);

  const handleRouteGenerated = (route: OptimizedRoute) => {
    setGeneratedRoute(route);
  };

  const handleReset = () => {
    setGeneratedRoute(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ErrorBoundary
            fallback={
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred while loading the route optimization form.
                </AlertDescription>
              </Alert>
            }
          >
            <RouteOptimizationForm 
              onRouteGenerated={handleRouteGenerated}
            />
          </ErrorBoundary>
        </div>
        
        <div className="md:col-span-2">
          <ErrorBoundary
            fallback={
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred while displaying route details.
                </AlertDescription>
              </Alert>
            }
          >
            {generatedRoute ? (
              <OptimizedRouteDetails 
                route={generatedRoute} 
                onReset={handleReset} 
              />
            ) : (
              <div className="h-full flex items-center justify-center p-6 border border-dashed rounded-lg">
                <div className="text-center">
                  <h3 className="font-medium">No Route Generated</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select origin, destination, and transport mode to calculate an optimal route
                  </p>
                </div>
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>
      
      <ErrorBoundary
        fallback={
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while loading the saved routes.
            </AlertDescription>
          </Alert>
        }
      >
        <RoutesList />
      </ErrorBoundary>
    </div>
  );
};
