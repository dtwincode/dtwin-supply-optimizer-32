
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTranslation } from "@/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Truck, Ship, Plane, Train } from "lucide-react";

interface TransportMode {
  id: string;
  name: string;
  type: 'truck' | 'ship' | 'plane' | 'train';
  costPerKm: number;
  co2PerKm: number;
  averageSpeed: number;
  isAvailable: boolean;
}

const transportModes: TransportMode[] = [
  {
    id: "1",
    name: "Standard Truck",
    type: "truck",
    costPerKm: 2.5,
    co2PerKm: 0.8,
    averageSpeed: 65,
    isAvailable: true
  },
  {
    id: "2",
    name: "Container Ship",
    type: "ship",
    costPerKm: 0.8,
    co2PerKm: 0.4,
    averageSpeed: 25,
    isAvailable: true
  },
  {
    id: "3",
    name: "Cargo Plane",
    type: "plane",
    costPerKm: 12.0,
    co2PerKm: 2.1,
    averageSpeed: 800,
    isAvailable: true
  },
  {
    id: "4",
    name: "Freight Train",
    type: "train",
    costPerKm: 1.2,
    co2PerKm: 0.2,
    averageSpeed: 80,
    isAvailable: false
  }
];

export const TransportModeList = () => {
  const { language } = useLanguage();

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'truck':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'ship':
        return <Ship className="h-4 w-4 text-blue-500" />;
      case 'plane':
        return <Plane className="h-4 w-4 text-blue-500" />;
      case 'train':
        return <Train className="h-4 w-4 text-blue-500" />;
      default:
        return <Truck className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatNumber = (num: number): string => {
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTranslation('logistics.transportModes', language)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getTranslation('logistics.mode', language)}</TableHead>
              <TableHead>{getTranslation('logistics.costPerKm', language)}</TableHead>
              <TableHead>{getTranslation('logistics.co2PerKm', language)}</TableHead>
              <TableHead>{getTranslation('logistics.averageSpeed', language)}</TableHead>
              <TableHead>{getTranslation('logistics.status', language)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transportModes.map(mode => (
              <TableRow key={mode.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTransportIcon(mode.type)}
                    <span>{mode.name}</span>
                  </div>
                </TableCell>
                <TableCell>${formatNumber(mode.costPerKm)}</TableCell>
                <TableCell>{formatNumber(mode.co2PerKm)} kg</TableCell>
                <TableCell>{formatNumber(mode.averageSpeed)} km/h</TableCell>
                <TableCell>
                  {mode.isAvailable ? 
                    <Badge variant="outline" className="bg-green-50 text-green-600">
                      {getTranslation('logistics.available', language)}
                    </Badge> : 
                    <Badge variant="outline" className="bg-red-50 text-red-600">
                      {getTranslation('logistics.unavailable', language)}
                    </Badge>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Default export (resolves the component import error in TrackingTab.tsx)
export default TransportModeList;
