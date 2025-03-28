
export interface ShipmentItem {
  id: string;
  sku: string;
  quantity: number;
  shipment_id: string;
}

export interface Shipment {
  id: string;
  shipment_number: string;
  status: 'planned' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  planned_ship_date: string;
  actual_ship_date?: string;
  destination: string;
  notes?: string;
  items?: ShipmentItem[];
}

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
