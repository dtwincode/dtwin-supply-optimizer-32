
export interface InventoryTransaction {
  id?: string;
  sku: string;
  quantity: number;
  transactionType: 'inbound' | 'outbound';
  referenceId?: string;
  referenceType?: 'purchase_order' | 'sales_order' | 'shipment';
  notes?: string;
  timestamp?: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  origin: string;
  destination: string;
  scheduledDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate?: string;
  carrierId?: string;
  trackingNumber?: string;
  notes?: string;
  items: ShipmentItem[];
}

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  sku: string;
  quantity: number;
  description?: string;
}

export interface ShipmentTracking {
  id: string;
  shipmentId: string;
  status: string;
  location: string;
  timestamp: string;
  notes?: string;
}
