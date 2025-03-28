
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
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled' | 'planned' | 'processing' | 'shipped';
  origin: string;
  destination: string;
  scheduledDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate?: string;
  carrierId?: string;
  trackingNumber?: string;
  notes?: string;
  items: ShipmentItem[];
  // Add compatibility fields for existing components
  shipment_number?: string;
  planned_ship_date?: string;
  actual_ship_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  sku: string;
  quantity: number;
  description?: string;
  // Add compatibility field for existing components
  shipment_id?: string;
}

export interface ShipmentTracking {
  id: string;
  shipmentId: string;
  status: string;
  location: string;
  timestamp: string;
  notes?: string;
}
