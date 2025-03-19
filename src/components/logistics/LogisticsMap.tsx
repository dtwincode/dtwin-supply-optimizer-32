
import React, { useState, useEffect, useRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { useLogisticsTracking } from '@/hooks/useLogisticsTracking';
import { Loader2, AlertTriangle, MapPin, LocateFixed, Layers, AlertCircle, Truck, RefreshCw, Box } from 'lucide-react';
import BaseMap from '@/components/shared/maps/BaseMap';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorBoundary } from '../ErrorBoundary';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

export const LogisticsMap: React.FC = () => {
  const { trackingData } = useLogisticsTracking();
  const [centerCoords, setCenterCoords] = useState({ lat: 24.7136, lng: 46.6753 }); // Default to Riyadh
  const [isLoading, setIsLoading] = useState(true);
  const [hasMapError, setHasMapError] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [mapLayers, setMapLayers] = useState({
    shipments: true,
    warehouses: true,
    routes: true,
    trafficData: false,
    weatherOverlay: false
  });
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [showDelayedOnly, setShowDelayedOnly] = useState(false);
  const liveTrackingInterval = useRef<number | null>(null);
  const { language } = useLanguage();

  // Sample warehouse data
  const warehouseLocations = [
    { id: 'wh1', name: 'Riyadh Distribution Center', lat: 24.7136, lng: 46.6753, type: 'distribution_center', shipments: 24 },
    { id: 'wh2', name: 'Jeddah Regional Warehouse', lat: 21.5412, lng: 39.1721, type: 'warehouse', shipments: 18 },
    { id: 'wh3', name: 'Dammam Port Facility', lat: 26.4207, lng: 50.0887, type: 'port', shipments: 12 },
    { id: 'wh4', name: 'Mecca Fulfillment Center', lat: 21.3891, lng: 39.8579, type: 'fulfillment_center', shipments: 9 },
  ];

  // Sample shipment data
  const shipmentLocations = [
    { id: 'ship1', reference: 'ORD-20240315-001', lat: 26.3892, lng: 50.1872, status: 'in_transit', delayed: false, eta: '2h 15m' },
    { id: 'ship2', reference: 'ORD-20240314-002', lat: 25.1595, lng: 47.3091, status: 'delivered', delayed: false, eta: 'Delivered' },
    { id: 'ship3', reference: 'ORD-20240313-003', lat: 23.8859, lng: 45.0792, status: 'out_for_delivery', delayed: false, eta: '45m' },
    { id: 'ship4', reference: 'ORD-20240312-004', lat: 21.4225, lng: 39.8261, status: 'delayed', delayed: true, eta: 'Delayed (3h+)' },
  ];

  useEffect(() => {
    // Check if Mapbox token is available
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      console.error("Mapbox token is missing for logistics map. Map visualization is disabled.");
      setHasMapError(true);
    }

    if (trackingData) {
      setIsLoading(false);
      if (trackingData.latitude && trackingData.longitude) {
        setCenterCoords({
          lat: trackingData.latitude,
          lng: trackingData.longitude
        });
      }
    } else {
      // Use sample data if no tracking data is available
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }

    return () => {
      // Clean up live tracking interval
      if (liveTrackingInterval.current) {
        clearInterval(liveTrackingInterval.current);
      }
    };
  }, [trackingData]);

  const toggleLiveTracking = () => {
    const newState = !isLiveTracking;
    setIsLiveTracking(newState);
    
    if (newState) {
      toast.info(getTranslation('common.logistics.liveTrackingEnabled', language) || 'Live tracking enabled', {
        description: getTranslation('common.logistics.locationUpdatesEnabled', language) || 'Location updates every 15 seconds'
      });
      
      // Set up live tracking interval
      liveTrackingInterval.current = window.setInterval(() => {
        // Simulate location updates - in a real app, this would call an API
        const targetShipment = shipmentLocations.find(s => s.id === 'ship1');
        if (targetShipment) {
          // Slightly adjust coordinates to simulate movement
          targetShipment.lat += (Math.random() - 0.5) * 0.01;
          targetShipment.lng += (Math.random() - 0.5) * 0.01;
          
          // If this is the selected shipment, update center coordinates
          if (selectedShipmentId === 'ship1') {
            setCenterCoords({ lat: targetShipment.lat, lng: targetShipment.lng });
          }
        }
      }, 15000);
    } else {
      toast.info(getTranslation('common.logistics.liveTrackingDisabled', language) || 'Live tracking disabled');
      if (liveTrackingInterval.current) {
        clearInterval(liveTrackingInterval.current);
        liveTrackingInterval.current = null;
      }
    }
  };

  const handleLayerToggle = (layer: string) => {
    setMapLayers({
      ...mapLayers,
      [layer]: !mapLayers[layer]
    });
  };

  const handleShipmentSelect = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId);
    const shipment = shipmentLocations.find(s => s.id === shipmentId);
    if (shipment) {
      setCenterCoords({ lat: shipment.lat, lng: shipment.lng });
      setZoom(8);
    }
  };

  const handleWarehouseSelect = (warehouseId: string) => {
    const warehouse = warehouseLocations.find(w => w.id === warehouseId);
    if (warehouse) {
      setCenterCoords({ lat: warehouse.lat, lng: warehouse.lng });
      setZoom(10);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_transit': 
        return getTranslation('common.logistics.inTransit', language) || "In Transit";
      case 'delivered': 
        return getTranslation('common.logistics.delivered', language) || "Delivered";
      case 'out_for_delivery': 
        return getTranslation('common.logistics.outForDelivery', language) || "Out for Delivery";
      case 'delayed': 
        return getTranslation('common.logistics.delayed', language) || "Delayed";
      default: 
        return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'in_transit': return "default";
      case 'delivered': return "success";
      case 'out_for_delivery': return "secondary";
      case 'delayed': return "destructive";
      default: return "outline";
    }
  };

  const MapErrorFallback = () => (
    <Alert variant="destructive" className="mt-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{getTranslation("common.logistics.mapUnavailable", language)}</AlertTitle>
      <AlertDescription>
        {getTranslation("common.logistics.mapError", language)}
      </AlertDescription>
    </Alert>
  );

  const filteredShipments = showDelayedOnly
    ? shipmentLocations.filter(s => s.delayed)
    : shipmentLocations;

  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md flex items-center">
        <MapPin className="h-5 w-5 text-dtwin-medium mr-2" />
        <span className="font-semibold text-gray-800">
          {getTranslation("common.logistics.logisticsTrackingMap", language)}
        </span>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant={isLiveTracking ? "default" : "outline"}
          size="sm"
          onClick={toggleLiveTracking}
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white/70"
        >
          <LocateFixed className={`h-4 w-4 mr-2 ${isLiveTracking ? 'text-green-500 animate-pulse' : ''}`} />
          {isLiveTracking 
            ? getTranslation('common.logistics.liveOn', language) || "Live" 
            : getTranslation('common.logistics.liveOff', language) || "Go Live"}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white/70"
            >
              <Layers className="h-4 w-4 mr-2" />
              {getTranslation('common.logistics.layers', language) || "Layers"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{getTranslation('common.logistics.mapLayers', language) || "Map Layers"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={mapLayers.shipments}
              onCheckedChange={() => handleLayerToggle('shipments')}
            >
              {getTranslation('common.logistics.shipments', language) || "Shipments"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={mapLayers.warehouses}
              onCheckedChange={() => handleLayerToggle('warehouses')}
            >
              {getTranslation('common.logistics.warehouses', language) || "Warehouses"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={mapLayers.routes}
              onCheckedChange={() => handleLayerToggle('routes')}
            >
              {getTranslation('common.logistics.routes', language) || "Routes"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={mapLayers.trafficData}
              onCheckedChange={() => handleLayerToggle('trafficData')}
            >
              {getTranslation('common.logistics.trafficData', language) || "Traffic Data"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={mapLayers.weatherOverlay}
              onCheckedChange={() => handleLayerToggle('weatherOverlay')}
            >
              {getTranslation('common.logistics.weatherOverlay', language) || "Weather Overlay"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showDelayedOnly}
              onCheckedChange={setShowDelayedOnly}
            >
              {getTranslation('common.logistics.showDelayedOnly', language) || "Show Delayed Only"}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : hasMapError ? (
        <div className="h-80 flex items-center justify-center flex-col p-6">
          <MapErrorFallback />
        </div>
      ) : (
        <ErrorBoundary fallback={<MapErrorFallback />}>
          <div className="h-[450px] rounded-lg overflow-hidden">
            <BaseMap 
              latitude={centerCoords.lat} 
              longitude={centerCoords.lng} 
              zoom={zoom}
            />
            
            {/* Simplified visualization of map markers */}
            <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md max-w-xs max-h-[300px] overflow-auto">
              <h3 className="font-medium text-sm mb-2">
                {getTranslation('common.logistics.activeShipments', language) || "Active Shipments"}
                <Badge className="ml-2">{filteredShipments.length}</Badge>
              </h3>
              <div className="space-y-2">
                {filteredShipments.map((shipment) => (
                  <div 
                    key={shipment.id}
                    className={`p-2 rounded-md cursor-pointer border transition-colors ${
                      selectedShipmentId === shipment.id 
                        ? 'bg-primary/10 border-primary/20' 
                        : 'hover:bg-muted border-transparent'
                    }`}
                    onClick={() => handleShipmentSelect(shipment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{shipment.reference}</span>
                      <Badge variant={getStatusBadgeVariant(shipment.status)} className="text-[10px] px-1">
                        {getStatusLabel(shipment.status)}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>ETA: {shipment.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {mapLayers.warehouses && (
              <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md max-w-xs">
                <h3 className="font-medium text-sm mb-2">
                  {getTranslation('common.logistics.facilities', language) || "Logistics Facilities"}
                </h3>
                <div className="space-y-2">
                  {warehouseLocations.map((warehouse) => (
                    <div 
                      key={warehouse.id}
                      className="flex items-center justify-between p-1 text-xs hover:bg-muted rounded cursor-pointer"
                      onClick={() => handleWarehouseSelect(warehouse.id)}
                    >
                      <span>{warehouse.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {warehouse.shipments}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedShipmentId && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium text-sm">
                    {shipmentLocations.find(s => s.id === selectedShipmentId)?.reference}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2"
                    onClick={() => setSelectedShipmentId(null)}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};
