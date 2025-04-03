
export interface Shipment {
  id: string;
  shipmentNumber: string;
  status: 'planned' | 'in_transit' | 'delivered' | 'cancelled';
  origin: string;
  destination: string;
  carrier: string;
  trackingNumber?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  items: ShipmentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitOfMeasure: string;
}

export interface Carrier {
  id: string;
  name: string;
  contactInfo: string;
  serviceLevel: string;
  active: boolean;
}

export interface TrackingEvent {
  eventId: string;
  shipmentId: string;
  location: string;
  timestamp: string;
  status: string;
  description: string;
}

export type ShipmentStatus = 'planned' | 'in_transit' | 'delivered' | 'cancelled';

export interface ShipmentFilter {
  status?: ShipmentStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  origin?: string[];
  destination?: string[];
  carrier?: string[];
}
