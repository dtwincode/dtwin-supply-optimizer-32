import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Layers,
  MapPin,
  Truck,
  Package,
  Clock,
  AlertTriangle,
  ChevronDown,
  Settings,
  RefreshCw,
} from "lucide-react";
import { useLogisticsTracking } from "@/hooks/useLogisticsTracking";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import BaseMap from "@/components/shared/maps/BaseMap";
import { createMapMarker } from "@/components/shared/maps/MapMarker";

export const LogisticsMap = () => {
  const { language } = useLanguage();
  const { trackingData } = useLogisticsTracking();
  const [liveTracking, setLiveTracking] = useState(false);
  const [showWarehousesLayer, setShowWarehousesLayer] = useState(true);
  const [showShipmentsLayer, setShowShipmentsLayer] = useState(true);
  const [showDelayedOnly, setShowDelayedOnly] = useState(false);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(false);
  const [showTrafficData, setShowTrafficData] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [clusterMarkers, setClusterMarkers] = useState(true);
  const mapRef = useRef(null);

  // Sample warehouse data
  const warehouseLocations = [
    {
      id: "wh1",
      name:
        getTranslation("logistics.warehouseLocations.riyadh", language) ||
        "Riyadh Distribution Center",
      lat: 24.7136,
      lng: 46.6753,
      type: "distribution_center",
      shipments: 24,
    },
    {
      id: "wh2",
      name:
        getTranslation("logistics.warehouseLocations.jeddah", language) ||
        "Jeddah Regional Warehouse",
      lat: 21.5412,
      lng: 39.1721,
      type: "warehouse",
      shipments: 18,
    },
    {
      id: "wh3",
      name:
        getTranslation("logistics.warehouseLocations.dammam", language) ||
        "Dammam Port Facility",
      lat: 26.4207,
      lng: 50.0887,
      type: "port",
      shipments: 12,
    },
    {
      id: "wh4",
      name:
        getTranslation("logistics.warehouseLocations.mecca", language) ||
        "Mecca Fulfillment Center",
      lat: 21.3891,
      lng: 39.8579,
      type: "fulfillment_center",
      shipments: 9,
    },
  ];

  // Sample shipment data
  const shipments = [
    {
      id: "s1",
      orderId: "ORD-12345",
      status: "in_transit",
      lat: 23.1802,
      lng: 43.9412,
      from: warehouseLocations[0].name,
      to: "Customer Location A",
      carrier:
        getTranslation("logistics.carriers.saudiPost.en", language) ||
        "Saudi Post",
      eta: "2025-03-20T15:30:00",
      isDelayed: false,
      vehicle: "truck",
    },
    {
      id: "s2",
      orderId: "ORD-12346",
      status: "in_transit",
      lat: 22.2734,
      lng: 39.8851,
      from: warehouseLocations[1].name,
      to: "Customer Location B",
      carrier:
        getTranslation("logistics.carriers.aramex.en", language) || "Aramex",
      eta: "2025-03-19T18:45:00",
      isDelayed: true,
      vehicle: "van",
    },
    {
      id: "s3",
      orderId: "ORD-12347",
      status: "out_for_delivery",
      lat: 26.2172,
      lng: 50.1971,
      from: warehouseLocations[2].name,
      to: "Customer Location C",
      carrier: getTranslation("logistics.carriers.dhl.en", language) || "DHL",
      eta: "2025-03-19T14:15:00",
      isDelayed: false,
      vehicle: "truck",
    },
    {
      id: "s4",
      orderId: "ORD-12348",
      status: "in_transit",
      lat: 21.2805,
      lng: 40.4513,
      from: warehouseLocations[3].name,
      to: "Customer Location D",
      carrier:
        getTranslation("logistics.carriers.fedex.en", language) || "FedEx",
      eta: "2025-03-21T09:30:00",
      isDelayed: true,
      vehicle: "truck",
    },
  ];

  const filteredShipments = showDelayedOnly
    ? shipments.filter((s) => s.isDelayed)
    : shipments;

  // Handle live tracking toggle
  const toggleLiveTracking = () => {
    setLiveTracking(!liveTracking);
  };

  // Shipment marker click handler
  const handleShipmentClick = (shipment) => {
    console.log("Shipment clicked:", shipment);
    // Here you would typically show a detailed view or modal
  };

  // Warehouse marker click handler
  const handleWarehouseClick = (warehouse) => {
    console.log("Warehouse clicked:", warehouse);
    // Here you would typically show a detailed view or modal
  };

  // Get marker color based on shipment status
  const getShipmentMarkerColor = (status, isDelayed) => {
    if (isDelayed) return "red";
    switch (status) {
      case "delivered":
        return "green";
      case "out_for_delivery":
        return "blue";
      case "in_transit":
        return "yellow";
      case "processing":
        return "purple";
      case "exception":
        return "red";
      default:
        return "gray";
    }
  };

  // Get marker color based on warehouse type
  const getWarehouseMarkerColor = (type) => {
    switch (type) {
      case "distribution_center":
        return "blue";
      case "warehouse":
        return "green";
      case "port":
        return "purple";
      case "fulfillment_center":
        return "orange";
      default:
        return "gray";
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(language === "ar" ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLiveTrackingStatus = () => {
    return liveTracking
      ? getTranslation("logistics.liveTrackingEnabled", language) ||
          "Live tracking enabled"
      : getTranslation("logistics.liveTrackingDisabled", language) ||
          "Live tracking disabled";
  };

  const getStatusBadge = (status, isDelayed) => {
    if (isDelayed) {
      return (
        <Badge variant="destructive" className="ml-2">
          <Clock className="h-3 w-3 mr-1" />
          {getTranslation("logistics.delayedEta", language) || "Delayed (3h+)"}
        </Badge>
      );
    }

    switch (status) {
      case "in_transit":
        return (
          <Badge variant="secondary" className="ml-2">
            <Truck className="h-3 w-3 mr-1" />
            {getTranslation("logistics.inTransit", language) || "In Transit"}
          </Badge>
        );
      case "out_for_delivery":
        return (
          <Badge variant="default" className="bg-blue-500 ml-2">
            <Package className="h-3 w-3 mr-1" />
            {getTranslation("logistics.outForDelivery", language) ||
              "Out for Delivery"}
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-500 ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {getTranslation("logistics.delivered", language) || "Delivered"}
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M22 12A10 10 0 1 1 12 2a1 1 0 0 1 1 1v8h8a1 1 0 0 1 1 1Z"></path>
            </svg>
            {getTranslation("logistics.processing", language) || "Processing"}
          </Badge>
        );
      case "exception":
        return (
          <Badge variant="destructive" className="ml-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {getTranslation("logistics.exception", language) || "Exception"}
          </Badge>
        );
      default:
        return null;
    }
  };

  // Prepare map markers
  const prepareMapMarkers = () => {
    const markers = [];

    // Add warehouse markers if the layer is enabled
    if (showWarehousesLayer) {
      warehouseLocations.forEach((warehouse) => {
        markers.push({
          id: `warehouse-${warehouse.id}`,
          latitude: warehouse.lat,
          longitude: warehouse.lng,
          color: getWarehouseMarkerColor(warehouse.type),
          icon: "warehouse",
          onClick: () => handleWarehouseClick(warehouse),
          tooltipContent: (
            <div className="p-2 max-w-[200px]">
              <div className="font-semibold">{warehouse.name}</div>
              <div className="text-sm text-muted-foreground">
                {warehouse.type.replace("_", " ")}
              </div>
              <div className="text-sm mt-1">
                <span className="font-medium">{warehouse.shipments}</span>{" "}
                active shipments
              </div>
            </div>
          ),
        });
      });
    }

    // Add shipment markers if the layer is enabled
    if (showShipmentsLayer) {
      filteredShipments.forEach((shipment) => {
        markers.push({
          id: `shipment-${shipment.id}`,
          latitude: shipment.lat,
          longitude: shipment.lng,
          color: getShipmentMarkerColor(shipment.status, shipment.isDelayed),
          icon: shipment.vehicle || "delivery",
          onClick: () => handleShipmentClick(shipment),
          tooltipContent: (
            <div className="p-2 max-w-[200px]">
              <div className="font-semibold">{shipment.orderId}</div>
              <div className="flex items-center text-sm">
                {getStatusBadge(shipment.status, shipment.isDelayed)}
              </div>
              <div className="text-xs mt-2">
                <div>
                  <span className="font-medium">
                    {getTranslation("logistics.origin", language) || "From"}:
                  </span>{" "}
                  {shipment.from}
                </div>
                <div>
                  <span className="font-medium">
                    {getTranslation("logistics.destination", language) || "To"}:
                  </span>{" "}
                  {shipment.to}
                </div>
                <div>
                  <span className="font-medium">
                    {getTranslation("logistics.carrier", language) || "Carrier"}
                    :
                  </span>{" "}
                  {shipment.carrier}
                </div>
                <div>
                  <span className="font-medium">
                    {getTranslation("logistics.eta", language) || "ETA"}:
                  </span>{" "}
                  {formatDate(shipment.eta)}
                </div>
              </div>
            </div>
          ),
        });
      });
    }

    return markers;
  };

  return (
    <div className="h-full">
      <div className="h-[500px] relative overflow-hidden rounded-md">
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className={`flex items-center ${liveTracking ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            onClick={toggleLiveTracking}
          >
            <span
              className={`h-2 w-2 rounded-full mr-2 ${liveTracking ? "bg-white animate-pulse" : "bg-muted-foreground"}`}
            ></span>
            {liveTracking
              ? getTranslation("logistics.liveOn", language) || "Live"
              : getTranslation("logistics.liveOff", language) || "Go Live"}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                {getTranslation("logistics.layers", language) || "Layers"}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <h4 className="font-medium">
                  {getTranslation("logistics.mapLayers", language) ||
                    "Map Layers"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      {getTranslation("logistics.shipments", language) ||
                        "Shipments"}
                    </label>
                    <Switch
                      checked={showShipmentsLayer}
                      onCheckedChange={setShowShipmentsLayer}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {getTranslation("logistics.warehouses", language) ||
                        "Warehouses"}
                    </label>
                    <Switch
                      checked={showWarehousesLayer}
                      onCheckedChange={setShowWarehousesLayer}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M20 17.5v-13a2.5 2.5 0 0 0-5 0v13"></path>
                        <path d="M4 17.5v-13a2.5 2.5 0 0 1 5 0v13"></path>
                        <path d="M4 5h16"></path>
                        <path d="M20 17.5h-16"></path>
                      </svg>
                      {getTranslation("logistics.trafficData", language) ||
                        "Traffic Data"}
                    </label>
                    <Switch
                      checked={showTrafficData}
                      onCheckedChange={setShowTrafficData}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M17.5 17a5 5 0 1 1-.4-4"></path>
                        <path d="m22 22-5-5"></path>
                        <path d="M11.7 3a20 20 0 0 0-1.1 3"></path>
                        <path d="M9.5 9C6.4 9.9 5 11.5 5 15a7 7 0 1 0 13.3-3"></path>
                        <path d="M13.1 7a20 20 0 0 1 1.1-3"></path>
                        <path d="M8 2a20 20 0 0 0-.7 2"></path>
                        <path d="M16 2a20 20 0 0 1 .7 2"></path>
                      </svg>
                      {getTranslation("logistics.weatherOverlay", language) ||
                        "Weather Overlay"}
                    </label>
                    <Switch
                      checked={showWeatherOverlay}
                      onCheckedChange={setShowWeatherOverlay}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <label className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {getTranslation("logistics.showDelayedOnly", language) ||
                        "Show Delayed Only"}
                    </label>
                    <Switch
                      checked={showDelayedOnly}
                      onCheckedChange={setShowDelayedOnly}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <div className="p-2">
                <h4 className="font-medium mb-3">
                  {getTranslation("logistics.mapViewSettings", language) ||
                    "Map View Settings"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">
                      {getTranslation("logistics.showRoutes", language) ||
                        "Show Routes"}
                    </label>
                    <Switch
                      checked={showRoutes}
                      onCheckedChange={setShowRoutes}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm">
                      {getTranslation("logistics.showHeatmap", language) ||
                        "Show Heatmap"}
                    </label>
                    <Switch
                      checked={showHeatmap}
                      onCheckedChange={setShowHeatmap}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm">
                      {getTranslation("logistics.clusterMarkers", language) ||
                        "Cluster Markers"}
                    </label>
                    <Switch
                      checked={clusterMarkers}
                      onCheckedChange={setClusterMarkers}
                    />
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-2 left-2 z-10">
          <Card className="bg-white/90 shadow-md border-0">
            <CardContent className="p-2">
              <div className="text-xs text-muted-foreground">
                {getLiveTrackingStatus()}
              </div>
              {liveTracking && (
                <div className="text-xs text-muted-foreground">
                  {getTranslation(
                    "logistics.locationUpdatesEnabled",
                    language
                  ) || "Location updates every 15 seconds"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="absolute top-2 right-2 z-10">
          <Card className="bg-white/90 shadow-md border-0">
            <CardContent className="p-2">
              <div className="text-xs font-medium">
                {getTranslation("logistics.activeShipments", language) ||
                  "Active Shipments"}
                : {filteredShipments.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <BaseMap
          latitude={24.0}
          longitude={45.0}
          zoom={5}
          markers={prepareMapMarkers()}
        />
      </div>
    </div>
  );
};
