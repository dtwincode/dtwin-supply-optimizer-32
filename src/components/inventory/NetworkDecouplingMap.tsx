
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const NetworkDecouplingMap = () => {
  const [mapError, setMapError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Mapbox token is available
    const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || 
                        import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      setMapError(true);
      toast({
        title: "Map configuration error",
        description: "Mapbox API token is missing. Network visualization is disabled.",
        variant: "destructive",
      });
    }
  }, [toast]);

  if (mapError) {
    return (
      <Card className="p-6 my-4">
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Map Unavailable</AlertTitle>
          <AlertDescription>
            Network decoupling map requires a valid Mapbox API token. Please configure the token in your environment variables.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="p-6 my-4">
      <h3 className="text-lg font-semibold mb-4">Network Decoupling Map</h3>
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-muted-foreground">Network visualization is currently loading or unavailable.</p>
      </div>
    </Card>
  );
};
