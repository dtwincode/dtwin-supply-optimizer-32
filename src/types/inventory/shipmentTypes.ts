
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

export interface InventoryTransaction {
  id: string;
  transactionType: 'receipt' | 'shipment' | 'adjustment' | 'transfer';
  sku: string;
  quantity: number;
  location: string;
  referenceNumber?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdBy: string;
  notes?: string;
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

// Add Transaction type for useInventoryTransaction hook
export interface Transaction {
  id: string;
  type: 'receipt' | 'shipment' | 'adjustment' | 'transfer';
  sku: string;
  quantity: number;
  location: string;
  reference: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
  userId: string;
  notes?: string;
}
